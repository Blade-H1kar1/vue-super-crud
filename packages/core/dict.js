import { batchMerge } from "utils/mergeTemp";
import { isEmptyData } from "utils";
import { uniqueId } from "lodash-es";

let globalOptCopy = {};
let loadTasks = {}; //所有字典的临时请求
// TODO: 本地options处理成字典
export default (globalOpt) => ({
  data() {
    return {
      defaultMeta: {}, //默认配置
      dictsMeta: {}, //所有字典的配置
      dictsData: {}, //所有字典数据
      dictsParams: {}, //所有字典上一次的请求参数
    };
  },
  created() {
    if (globalOpt) globalOptCopy = globalOpt;
    this.defaultMeta = {
      request: () => {},
      label: "label",
      value: "value",
      color: "color",
      children: "children",
      noRepeat: true, //并发请求是否去重
      cache: true, //是否缓存
      uniqueTime: 0, //请求去重的时间
      ...globalOptCopy,
    };
  },
  methods: {
    // 获取字典数据
    get(dicts) {
      if (!Array.isArray(dicts)) dicts = [dicts];
      dicts = batchMerge("dicts", dicts);
      dicts.forEach((dict) => {
        if (dict.request) dict.isCustom = true;
      });
      const promises = dicts.map((dict) => {
        const key = this.getKey(dict);
        if (this.isLoadCache(key, dict.params))
          return Promise.resolve({ key, data: this.dictsData[key] });
        dict.params && (this.dictsParams[key] = dict.params);
        const dictMeta = this.getDictMeta(dict, key);
        return this.loadDict(key, dictMeta, false, dict.params);
      });
      return this.allFulfilled(promises);
    },
    setDictsData(key, data) {
      this.$set(this.dictsData, key, data);
    },
    isLoadCache(key, params) {
      if (isEmptyData(this.dictsData[key])) return false;
      if (this.dictsMeta[key].cache === false) return false;
      if (params) {
        return JSON.stringify(this.dictsParams[key]) === JSON.stringify(params);
      }
      return true;
    },
    getKey(dict) {
      let key = dict;
      if (typeof key !== "string")
        key = dict?.key || dict?.presetType || uniqueId("dict-");
      return key;
    },
    // 并发处理
    allFulfilled(promises) {
      return Promise.allSettled(promises).then((res) => {
        const data = {};
        res
          .filter((item) => item.status === "fulfilled")
          .forEach((i) => {
            data[i.value.key] = i.value.data;
            this.setDictsData(i.value.key, data[i.value.key]);
          });
        return data;
      });
    },
    // 获取字典配置
    getDictMeta(dict, key) {
      if (this.dictsMeta[key]) return this.dictsMeta[key];

      if (typeof dict === "string") {
        let meta = { ...this.defaultMeta };
        this.dictsMeta[key] = meta;
        return meta;
      } else if (typeof dict === "object") {
        let meta = { ...this.defaultMeta, ...dict };
        this.dictsMeta[key] = meta;
        return meta;
      } else {
        console.error(key + "字典配置格式错误");
      }
    },
    // 根据value获取字典label
    getLabel(key, value) {
      if (!this.dictsData[key]) return console.error(key + "字典不存在");
      return this.dictsData[key].find((i) => i.value === value)?.label;
    },
    // 获取字典label数组
    getLabels(key) {
      if (!this.dictsData[key]) return console.error(key + "字典不存在");
      return this.dictsData[key].map((i) => i.label);
    },
    // 获取字典value数组
    getValues(key) {
      if (!this.dictsData[key]) return console.error(key + "字典不存在");
      return this.dictsData[key].map((i) => i.value);
    },
    // 获取字典map
    getMap(key) {
      if (!this.dictsData[key]) return console.error(key + "字典不存在");
      return this.formatMap(this.dictsData[key]);
    },
    formatMap(data) {
      const dataMap = {};
      data.forEach((item) => {
        dataMap[item.value] = item;
        if (item.children) {
          this.formatMap(item.children, dataMap);
        }
      });
      return dataMap;
    },
    // 重新加载
    reload(dicts) {
      if (!Array.isArray(dicts)) dicts = [dicts];
      const promises = dicts.map((dict) => {
        const key = this.getKey(dict);
        return this.loadDict(key, this.dictsMeta[key], true, dict.params);
      });
      return this.allFulfilled(promises);
    },
    // 等待字典返回
    wait(keys) {
      keys = typeof keys === "string" ? [keys] : keys;
      const promises = keys.map((key) => loadTasks[key] || Promise.resolve());
      return this.allFulfilled(promises);
    },
    // 清除字典
    clearDict(keys) {
      keys = typeof keys === "string" ? [keys] : keys;
      keys = keys || Object.keys(this.dictsData); // 如果没有指定keys，则清除所有键
      keys.forEach((key) => {
        this.$delete(this.dictsData, key);
      });
    },
    /**
     * 加载字典数据。
     * @param {string} key 字典的唯一标识符。
     * @param {Object} meta 字典配置。
     * @param {boolean} force 是否强制重新请求数据。
     * @param {Object} params 请求参数。
     */
    loadDict(key, meta, force, params) {
      this.setDictsData(key, []);
      // 去除重复请求
      if (loadTasks[key] && meta.noRepeat) return loadTasks[key];
      const { request, cache } = meta;
      if (!request) {
        console.error(`${key} 字典缺少请求函数`);
        return Promise.reject(new Error(`${key} 字典缺少请求函数`));
      }
      loadTasks[key] = new Promise((resolve, reject) => {
        const callback = (res) => {
          if (!res) return resolve({ key, data: [] });
          if (res && !Array.isArray(res)) {
            console.error(key + "字典返回数据必须为数组");
            reject();
          }
          const dictData = this.formatDictData(meta, res);
          resolve({ key, data: dictData });
          setTimeout(() => {
            loadTasks[key] = null;
          }, meta.uniqueTime);
        };
        // 当前请求没有参数就获取上一次的参数
        params = params || this.dictsParams[key];
        if (meta.isCustom) {
          request(params, callback);
        } else {
          request(key, callback);
        }
      });
      return loadTasks[key];
    },
    formatDictData(meta, data) {
      return data.map((item) => {
        const children = item[meta.children]
          ? this.formatDictData(meta, item[meta.children])
          : null;
        return {
          color: item[meta.color],
          label: item[meta.label],
          value: item[meta.value],
          children,
          raw: item,
        };
      });
    },
  },
});
