import {
  merge,
  cloneDeep,
  isFunction,
  isPlainObject,
  debounce,
} from "lodash-es";
import { mergeTemp, singleMerge, filterColumns } from "utils";
export default (optionsKey, config, opts) => {
  return {
    props: {
      scope: {}, // 防止scope携带vue实例导致的问题
      options: {
        type: Object,
        default: () => ({}),
      },
      renderColumns: {
        type: [Array, Function],
        default: () => [],
      },
    },
    data() {
      return {
        resultColumns: [],
        resultOptions: {},
      };
    },
    watch: {
      initColumns() {
        this.initColumnsHandler();
      },
      options: {
        handler(newVal, oldVal) {
          this.initOptionsHandler();
        },
        deep: true,
      },
      $attrs() {
        this.initOptionsHandler();
      },
    },
    computed: {
      initColumns() {
        const columns = this.options.renderColumns || this.renderColumns;
        return isFunction(columns) ? columns() : columns;
      },
    },
    created() {
      this.initColumnsHandler();
      this.initOptionsHandler();
      this.initColumnsHandler = debounce(this.initColumnsHandler, 300);
      this.initOptionsHandler = debounce(this.initOptionsHandler, 300);
    },
    methods: {
      initColumnsHandler() {
        if (this.initColumns && Array.isArray(this.initColumns)) {
          this.resultColumns = filterColumns(
            this.initColumns
              .map(this.handleInitColumn)
              .sort((a, b) => a.order - b.order)
          );
        } else {
          console.error("initColumns must be an array");
        }
      },
      initOptionsHandler() {
        this.resultOptions = this.initOptions(config);
      },
      mergeOptions() {
        const initConfig = this.getInitConfig();
        let userOptions = this.getUserOptions();
        userOptions = this.mergeUserOptions(userOptions);
        return this.convertKeysToCamelCase(merge(initConfig, userOptions));
      },
      getInitConfig() {
        let initConfig = cloneDeep(this.$scOpt[optionsKey]) || {};
        initConfig.size = this.$scOpt.size || (this.$ELEMENT || {}).size;
        return initConfig;
      },
      getUserOptions() {
        let userOptions = opts || this.options;
        return cloneDeep(userOptions);
      },
      mergeUserOptions(userOptions) {
        userOptions = mergeTemp("options", userOptions.presetType, userOptions);
        Object.assign(userOptions, this.$attrs);
        return userOptions;
      },
      initOptions(conf) {
        const config = conf();
        const resultOptions = merge(config.normal, this.mergeOptions());
        this.mergeShowConfig(resultOptions, config.showConfig);
        return resultOptions;
      },
      mergeShowConfig(resultOptions, showConfig) {
        Object.keys(resultOptions).forEach((key) => {
          const resOpt = resultOptions[key];
          if (showConfig[key] && resOpt) {
            if (isPlainObject(resOpt)) {
              resultOptions[key] = merge(showConfig[key], resOpt);
            } else if (Array.isArray(resOpt) && showConfig[key].handles) {
              resultOptions[key] = { handles: resOpt };
            } else {
              resultOptions[key] = showConfig[key];
            }
          }
        });
      },
      handleInitColumn(col, index) {
        let item = { ...col };
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
