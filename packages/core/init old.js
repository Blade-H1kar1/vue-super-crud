import {
  merge,
  cloneDeep,
  isFunction,
  isPlainObject,
  uniqueId,
  debounce,
} from "lodash-es";
import { mergeTemp, singleMerge, filterColumns } from "utils";
export default (optionsKey, config, opts) => {
  return {
    props: {
      options: {
        type: Object,
        default: () => ({}),
      },
      renderColumns: {
        type: [Array, Function],
        default: () => [],
      },
    },
    computed: {
      initColumns() {
        const renderColumns = this.options.renderColumns || this.renderColumns;
        if (!renderColumns) return;
        let columns = isFunction(renderColumns)
          ? renderColumns()
          : cloneDeep(renderColumns);
        if (columns) {
          columns = columns.map(this.handleInitColumn);
          columns = columns.sort((a, b) => a.order - b.order);
        }
        return columns;
      },
      resultColumns() {
        return filterColumns(this.initColumns);
      },
      resultOptions() {
        return this.initOptions(config);
      },
    },
    methods: {
      mergeOptions() {
        let initConfig = cloneDeep(this.$scOpt[optionsKey]) || {};
        initConfig.size = this.$scOpt.size || (this.$ELEMENT || {}).size;
        // 必须拷贝，否则会修改用户配置
        let userOptions = opts || this.options;
        // 防止scope中携带实例时，拷贝合并报错
        delete userOptions.scope;
        userOptions = cloneDeep(userOptions);
        // console.log(optionsKey, userOptions);
        // 合并预设用户配置
        userOptions = mergeTemp("options", userOptions.presetType, userOptions);
        // 合并组件配置
        Object.assign(userOptions, this.$attrs);
        // 合并全局配置
        return this.convertKeysToCamelCase(merge(initConfig, userOptions));
      },
      initOptions(conf) {
        const config = conf();
        // 合并默认配置
        const resultOptions = merge(config.normal, this.mergeOptions());
        // 合并
        Object.keys(resultOptions).forEach((key) => {
          const showConfig = config.showConfig[key];
          const resOpt = resultOptions[key];
          if (showConfig && resOpt) {
            // 合并继承配置项
            if (isPlainObject(resOpt)) {
              resultOptions[key] = merge(showConfig, resOpt);
            } else if (Array.isArray(resOpt) && showConfig.handles) {
              // 按钮类配置简写为数组时，将数组加入到配置项对象的数组key中
              resultOptions[key] = {
                handles: resOpt,
              };
            } else {
              resultOptions[key] = showConfig;
            }
          }
        });
        return resultOptions;
      },
      handleInitColumn(item, index) {
        if (item.presetType) {
          item = mergeTemp("render", item.presetType, item);
        }
        if (typeof item.formatData === "string") {
          item.formatData = singleMerge("formatData", item.formatData, item);
        }
        if (!item.prop) item.prop = "prop_" + index;
        if (this.resultOptions.allColumn)
          item = merge(cloneDeep(this.resultOptions.allColumn), item);
        if (this.initColumn) this.initColumn(item, index);
        if (item.children)
          item.children = item.children.map(this.handleInitColumn);
        return item;
      },
      // 继承ref的Method
      extendMethod(ref, exclude = []) {
        const refMethod = Object.entries(ref);
        for (const [key, value] of refMethod) {
          if (
            !(key.includes("$") || key.includes("_")) &&
            isFunction(value) &&
            !this[key] &&
            !exclude.includes(key)
          ) {
            this[key] = value;
          }
        }
      },
      // 下划线分隔的格式转换为驼峰式格式
      convertKeysToCamelCase(obj) {
        const result = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const camelCaseKey = key.replace(/([-_][a-z])/gi, (match) =>
              match.toUpperCase().replace("-", "").replace("_", "")
            );
            result[camelCaseKey] = obj[key];
          }
        }
        return result;
      },
    },
  };
};
