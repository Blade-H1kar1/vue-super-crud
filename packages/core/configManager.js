import {
  cloneDeep,
  merge,
  get,
  set,
  isPlainObject,
  isFunction,
} from "lodash-es";
import { mergeTemp, getObjectType } from "utils";

/**
 * 配置管理器
 */
class ConfigManager {
  constructor(defaultConfigs = {}, globalConfigs = {}, options = {}) {
    this.excludeKeys = options.excludeKeys || [];
    this.defaultConfigs = defaultConfigs;
    this.globalConfigs = globalConfigs;
  }
  /**
   * 获取预设配置
   */
  getPresetConfig(userConfig) {
    const presetName = userConfig.presetType;
    return presetName
      ? mergeTemp("options", presetName, userConfig)
      : userConfig;
  }

  getDefaultConfig(key) {
    return cloneDeep(this.defaultConfigs[key]) || {};
  }

  getGlobalConfig(key) {
    return cloneDeep(this.globalConfigs[key]) || {};
  }

  /**
   * 转换配置对象
   */
  transformConfig(config, transforms) {
    const result = cloneDeep(config);
    if (this.excludeKeys.length > 0) {
      this.excludeKeys.forEach((key) => {
        delete result[key];
      });
    }
    if (!transforms) return result;
    const handleTransform = (source, key) => {
      for (const transform of transforms) {
        transform(source, key, source[key]);
      }
      // 如果值是对象，递归处理
      const value = source[key];
      if (isPlainObject(value)) {
        Object.keys(value).forEach((key) => {
          handleTransform(value, key, value[key]);
        });
      }
    };

    // 处理每个顶级属性
    Object.keys(result).forEach((key) => {
      handleTransform(result, key);
    });
    return result;
  }
  /**
   * 合并配置
   */
  mergeConfig(userConfig = {}, options = {}) {
    const { type = "", config = {} } = options;

    const defaultConfig = this.getDefaultConfig(type) || config;
    const globalConfig = this.getGlobalConfig(type) || {};

    userConfig = this.getPresetConfig(userConfig);

    const transformConfig = this.transformConfig(
      merge({}, globalConfig, userConfig),
      defaultConfig.transforms
    );
    const resultConfig = this.applyDefaults(
      transformConfig,
      defaultConfig.schema
    );
    // 验证配置
    this.validateConfig(resultConfig, {
      schema: defaultConfig.schema,
      strict: defaultConfig.strict,
      ignoreKeys: defaultConfig.ignoreKeys,
      type,
    });

    return resultConfig;
  }

  /**
   * 验证配置
   */
  validateConfig(config, options = {}) {
    const { schema, strict, ignoreKeys, type } = options;
    // 对schema对象进行严格校验
    if (strict) {
      const extraKeys = Object.keys(config).filter(
        (key) => !schema[key] && !(ignoreKeys || []).includes(key)
      );
      if (extraKeys.length > 0) {
        console.warn(
          `配置对象 ${type} 包含不存在的属性: ${extraKeys.join(", ")}`
        );
      }
    }
    const validate = (config, schema, path = "") => {
      for (const [key, definition] of Object.entries(schema)) {
        const value = get(config, key);
        const fullPath = path ? `${path}.${key}` : key;
        let def = definition;
        if (!isPlainObject(def)) {
          def = {
            type: def,
          };
        }
        if (value === undefined || value === null) {
          if (def.required) console.warn(`缺少必填配置项: "${fullPath}"`);
        } else {
          // 类型检查
          if (def.type) {
            const types = Array.isArray(def.type) ? def.type : [def.type];

            const valid = types.some((type) => {
              if (type === Boolean) return typeof value === "boolean";
              if (type === Function) return typeof value === "function";
              if (type === Object) return isPlainObject(value);
              if (type === Array) return Array.isArray(value);
              if (type === String) return typeof value === "string";
              if (type === Number) return typeof value === "number";
              if (type === Promise) return value instanceof Promise;
              if (type === RegExp) return value instanceof RegExp;
              if (type === Date) return value instanceof Date;
              return false;
            });

            if (!valid) {
              console.warn(
                `配置项 "${fullPath.replace(
                  /\.arrayOf/g,
                  ""
                )}" 类型错误: 期望类型为 ${types
                  .map((t) => t.name)
                  .join("|")}, 实际类型为 ${getObjectType(
                  value
                )}, 值为 ${value}`
              );
            }
          }

          // 数组类型校验
          if (def.arrayOf && Array.isArray(value)) {
            value.forEach((item, index) => {
              const itemPath = `${fullPath}[${index}]`;

              if (isPlainObject(def.arrayOf)) {
                validate({ arrayOf: item }, { arrayOf: def.arrayOf }, itemPath);
              }

              if (isFunction(def.arrayOf.validate)) {
                try {
                  def.arrayOf.validate(item);
                } catch (error) {
                  console.warn(
                    `数组项 "${itemPath}" 验证失败: ${error.message}, 值为 ${value}`
                  );
                }
              }
            });
          }

          // 枚举值校验
          if (
            def.enum &&
            typeof value === "string" &&
            !def.enum.includes(value)
          ) {
            console.warn(
              `配置项 "${fullPath}" 的值无效: 必须是 ${def.enum.join(
                ", "
              )}, 当前值为 ${value}`
            );
          }

          // 自定义验证
          if (def.validator && !def.validator(value)) {
            console.warn(`配置项 "${fullPath}" 验证失败, 值为 ${value}`);
          }

          // 嵌套对象验证
          if (def.properties && isPlainObject(value)) {
            // 对象严格校验
            if (def.strict) {
              const extraKeys = Object.keys(value).filter(
                (k) => !def.properties[k] && !(def.ignoreKeys || []).includes(k)
              );
              if (extraKeys.length > 0) {
                console.warn(
                  `配置项 "${fullPath}" 包含不存在的属性: ${extraKeys.join(
                    ", "
                  )}}`
                );
              }
            }
            validate(value, def.properties, fullPath);
          }
        }
      }
    };
    validate(config, schema);
  }

  /**
   * 应用默认值
   */
  applyDefaults(config, schema) {
    const result = cloneDeep(config);

    const applyDefaultsRecursive = (config, schema, basePath = "") => {
      for (const [key, definition] of Object.entries(schema)) {
        const fullPath = basePath ? `${basePath}.${key}` : key;
        const value = get(config, key);

        let def = definition;
        if (!isPlainObject(def)) {
          def = {
            type: def,
          };
        }

        if (def.default) {
          if (value === undefined) {
            const defaultValue = isFunction(definition.default)
              ? definition.default()
              : definition.default;
            defaultValue && set(result, fullPath, defaultValue);
          } else if (isPlainObject(value)) {
            // 值为对象类型与默认值合并
            const defaultValue = isFunction(definition.default)
              ? definition.default()
              : definition.default;
            if (isPlainObject(defaultValue)) {
              defaultValue &&
                set(result, fullPath, merge({}, defaultValue, value));
            }
          }
        }

        // 空字符串转换为 true
        if (def.type) {
          const types = Array.isArray(def.type) ? def.type : [def.type];
          if (types.includes(Boolean) && value === "") {
            set(result, fullPath, true);
          }
        }

        // 处理嵌套对象的属性
        if (def.properties) {
          const currentValue = get(result, fullPath) || {};
          if (isPlainObject(currentValue)) {
            applyDefaultsRecursive(currentValue, def.properties, fullPath);
          }
        }
      }
    };

    applyDefaultsRecursive(config, schema);
    return result;
  }
}

let instance = null;

export default {
  create: (conf, gloConf) => {
    if (!instance) {
      instance = new ConfigManager(conf, gloConf);
      return instance;
    }
    return instance;
  },
  getInstance: () => instance,
};

export { ConfigManager };
