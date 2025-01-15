import { isEmptyData } from "utils";
import { get } from "lodash-es";

const DictStatus = {
  PENDING: "pending",
  SUCCESS: "success",
  ERROR: "error",
};

export class DictManager {
  constructor(vue, options = {}) {
    this.vue = vue;
    this.vm = new vue();
    this.loadTasks = {};
    this.dictMeta = new Map();
    this.dictWatch = new Map();
    this.pendingPromises = new Set();
    this.defaultMeta = this.createDefaultMeta(options);

    // 创建响应式数据
    this.state = vue.observable({
      dictsData: {}, // 字典数据
      dictStatus: {}, // 字典状态
      dictsParams: {}, // 字典参数
    });

    // 创建代理
    return new Proxy(this, {
      get: (target, prop) => {
        // 如果访问的是类的方法或其他属性，直接返回
        if (prop in target) {
          return target[prop];
        }

        // 如果字典数据不存在或为空，自动加载
        if (!target.state.dictsData[prop]) {
          target.get(prop).catch((err) => {
            console.error(`加载字典 ${prop} 失败:`, err);
          });
          return target.enhanceDict([], prop); // 返回增强后的空数组
        }

        // 返回增强后的字典数据
        return target.enhanceDict(target.state.dictsData[prop], prop);
      },
    });
  }

  // 创建默认字典元数据
  createDefaultMeta(options) {
    return {
      request: () => {},
      label: "label",
      value: "value",
      color: "color",
      children: "children",
      params: null, // 请求参数，支持函数
      immediate: false, // 是否立即加载
      cache: true, // 是否缓存
      dataPath: "data", // 数据路径
      transform: null, // 数据转换函数
      noRepeat: false, // 是否重复加载
      otherPath: null, // 其他路径
      debounceTime: 300, // 防抖时间
      ...options,
    };
  }

  // 注册字典配置
  register(key, config) {
    const dictConfig = {
      ...this.defaultMeta,
      ...(typeof config === "function" ? { request: config } : config),
      otherPath: Array.isArray(config.otherPath)
        ? config.otherPath
        : [config.otherPath],
      isCustom: true,
    };

    // 将本地数据转换为字典管理
    if (config.options) {
      dictConfig.request = () => {
        return new Promise((resolve) => {
          resolve({
            data: config.options,
          });
        });
      };
      return this;
    }

    this.dictMeta.set(key, dictConfig);

    // 如果参数是函数，创建监听
    if (typeof dictConfig.params === "function" && !this.dictWatch.get(key)) {
      this.dictWatch.set(
        key,
        this.vm.$watch(
          dictConfig.params,
          (params) => {
            this.get(key, params);
          },
          { deep: true, immediate: dictConfig.immediate }
        )
      );
    }

    // 如果配置了立即加载且参数不是函数
    if (dictConfig.immediate && typeof dictConfig.params !== "function") {
      this.get(key, dictConfig.params);
    }
    return this;
  }

  // 检查参数是否相等
  isParamsEqual(params1, params2) {
    if (!params1 && !params2) return true;
    if (!params1 || !params2) return false;
    return JSON.stringify(params1) === JSON.stringify(params2);
  }

  // 批量注册
  registerBatch(configs) {
    Object.entries(configs).forEach(([key, config]) => {
      this.register(key, config);
    });
    return this;
  }

  // 检查参数是否有效
  isValidParams(params) {
    if (!params) return false;
    return Object.values(params).every(
      (value) => value !== null && value !== undefined && value !== ""
    );
  }

  // 字典数据扩展方法
  enhanceDict(dictData, key) {
    if (!Array.isArray(dictData) || dictData.findLabel) {
      return dictData;
    }

    const meta = this.dictMeta.get(key) || this.defaultMeta;
    const defineProperties = {
      findLabel: {
        value: (value) => dictData.find((i) => i.value === value)?.label || "",
        configurable: true,
        enumerable: false,
      },
      toMap: {
        value: () => this.formatMap(dictData),
        configurable: true,
        enumerable: false,
      },
      values: {
        value: () => dictData.map((i) => i.value),
        configurable: true,
        enumerable: false,
      },
      labels: {
        value: () => dictData.map((i) => i.label),
        configurable: true,
        enumerable: false,
      },
      getOption: {
        value: (value) => dictData.find((i) => i.value === value),
        configurable: true,
        enumerable: false,
      },
      wait: {
        value: () => this.waitFor(key),
        configurable: true,
        enumerable: false,
      },
      ready: {
        value: this.isReady(key),
        configurable: true,
        enumerable: false,
      },
    };

    // 获取其他路径的数据
    const otherData = this.state.dictsData[`${key}_other`];
    if (otherData) {
      meta.otherPath.forEach((path) => {
        defineProperties[path] = {
          value: otherData[path],
          configurable: true,
          enumerable: false,
        };
      });
    }

    // 自定义扩展方法
    if (meta.enhanceDict && Object.keys(meta.enhanceDict).length > 0) {
      Object.keys(meta.enhanceDict).forEach((key) => {
        if (typeof meta.enhanceDict[key] === "function") {
          defineProperties[key] = {
            value: (value) => meta.enhanceDict[key](value, key, dictData, meta),
            configurable: true,
            enumerable: false,
          };
        }
      });
    }

    Object.defineProperties(dictData, defineProperties);
    return dictData;
  }

  // 设置响应式数据的辅助方法
  setState(key, value, stateKey = "dictsData") {
    this.vue.set(this.state[stateKey], key, value);
  }

  setParams(key, params) {
    this.vue.set(this.state.dictsParams, key, params);
  }

  // 获取字典数据
  get(key, params) {
    try {
      const config = this.dictMeta.get(key) || this.defaultMeta;
      const result = this.loadDict(key, config, false, params);
      this.pendingPromises.add(result);

      result.finally(() => {
        this.pendingPromises.delete(result);
      });
      return result;
    } catch (error) {
      console.error("获取字典数据失败:", error);
      return Promise.reject(error);
    }
  }

  // 加载字典数据
  loadDict(key, meta, force, params) {
    if (!force && this.isValidCache(key, params)) {
      return Promise.resolve({ key, data: this.state.dictsData[key] });
    }

    this.setState(key, DictStatus.PENDING, "dictStatus");
    this.setState(key, [], "dictsData");

    if (this.loadTasks[key] && meta.noRepeat) {
      return this.loadTasks[key];
    }
    const { request } = meta;
    if (!meta.request) {
      const error = new Error(`${key} 字典缺少请求函数`);
      this.handleDictError(key, error);
      return Promise.reject(error);
    }

    this.loadTasks[key] = new Promise((resolve, reject) => {
      const handleSuccess = (res) => {
        let data = meta.dataPath ? get(res, meta.dataPath) : res;

        // 处理 otherPath 数据
        if (meta.otherPath) {
          const paths = meta.otherPath;
          const otherData = paths.reduce((acc, path) => {
            acc[path] = get(res, path);
            return acc;
          }, {});
          this.setState(`${key}_other`, otherData, "dictsData");
        }

        if (!data) {
          resolve({ key, data: [] });
          return;
        }
        if (!Array.isArray(data)) {
          const error = new Error(`${key} 字典返回数据必须为数组`, data);
          this.handleDictError(key, error);
          reject(error);
          return;
        }
        if (meta.transform && typeof meta.transform === "function") {
          data = meta.transform(data);
        } else {
          data = this.formatDictData(meta, data);
        }

        this.setState(key, DictStatus.SUCCESS, "dictStatus");
        this.setState(key, data, "dictsData");
        resolve({ key, data });

        // 清理任务
        setTimeout(() => {
          this.loadTasks[key] = null;
        }, meta.debounceTime || 0);
      };

      const handleError = (error) => {
        this.handleDictError(key, error);
        reject(error);
      };

      try {
        const actualParams = params || this.state.dictsParams[key];
        actualParams && this.setState(key, actualParams, "dictsParams");
        request(meta.isCustom ? actualParams : key)
          .then(handleSuccess)
          .catch(handleError);
      } catch (error) {
        handleError(error);
      }
    });

    return this.loadTasks[key];
  }

  // 等待字典加载完成
  async waitFor(key) {
    if (this.isReady(key)) {
      return this.enhanceDict(this.state.dictsData[key], key);
    } else {
      await this.get(key);
    }

    return this.enhanceDict(this.state.dictsData[key], key);
  }

  // 等待所有注册的字典加载完成
  async waitAll() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          if (this.pendingPromises.size === 0) {
            return resolve(this.state.dictsData);
          }

          await Promise.all(Array.from(this.pendingPromises));
          return resolve(this.state.dictsData);
        } catch (error) {
          this.pendingPromises.clear();
          console.error("等待字典加载失败:", error);
          return reject(error);
        }
      }, 0);
    });
  }

  wait(key) {
    if (key) {
      return this.waitFor(key);
    }
    return this.waitAll();
  }

  // 检查字典是否已加载完成
  isReady(key) {
    return this.state.dictStatus[key] === DictStatus.SUCCESS;
  }

  handleDictError(key, error) {
    this.setState(key, DictStatus.ERROR, "dictStatus");
    console.error(`Dict Error (${key}):`, error);
  }

  isValidCache(key, params) {
    const config = this.dictMeta.get(key) || this.defaultMeta;
    return (
      !isEmptyData(this.state.dictsData[key]) &&
      config?.cache !== false &&
      this.state.dictStatus[key] === DictStatus.SUCCESS &&
      this.isParamsEqual(this.state.dictsParams[key], params)
    );
  }

  formatDictData(config, data) {
    return data.map((item) => ({
      color: item[config.color],
      label: item[config.label],
      value: item[config.value],
      children: item[config.children]
        ? this.formatDictData(config, item[config.children])
        : null,
      raw: item,
    }));
  }

  formatMap(data) {
    const dataMap = {};
    data.forEach((item) => {
      dataMap[item.value] = item;
      if (item.children) {
        this.formatMap(item.children, dataMap);
      }
    });
    return dataMap;
  }

  clear(key) {
    if (key) {
      this.pendingPromises.delete(this.loadTasks[key]);
      this.loadTasks[key] = null;
      this.dictMeta.delete(key);
      this.state.dictsData[key] = null;
      this.state.dictStatus[key] = null;
      this.state.dictsParams[key] = null;
      const unwatch = this.dictWatch.get(key);
      unwatch && unwatch();
      this.dictWatch.delete(key);
    } else {
      this.pendingPromises.clear();
      this.loadTasks = {};
      this.dictMeta.clear();
      this.state.dictsData = {};
      this.state.dictStatus = {};
      this.state.dictsParams = {};
      this.dictWatch.forEach((unwatch) => unwatch());
      this.dictWatch.clear();
    }
  }
}
