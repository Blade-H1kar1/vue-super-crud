import { merge, cloneDeep, isFunction, isEqualWith, get } from "lodash-es";
import { mergeTemp, singleMerge, filterColumns } from "utils";
import configManager from "core/configManager";

export default (optionsKey, opts) => {
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
        attrs: this.$attrs,
      };
    },
    watch: {
      $attrs(v) {
        // 添加函数类型的特殊处理
        const customizer = (a, b) => {
          if (typeof a === "function" && typeof b === "function") {
            return a.toString() === b.toString();
          }
          return undefined;
        };
        if (!isEqualWith(v, this.attrs, customizer)) {
          this.attrs = v;
        }
      },
    },
    computed: {
      initColumns() {
        const columns = this.options.renderColumns || this.renderColumns;
        return isFunction(columns) ? columns() : columns;
      },
      resultOptions() {
        return configManager.getInstance().mergeConfig(
          Object.assign(this.getUserOptions(), {
            renderColumns: this.initColumns,
          }),
          {
            type: optionsKey,
          }
        );
      },
      resultColumns() {
        if (
          this.resultOptions.renderColumns &&
          Array.isArray(this.resultOptions.renderColumns)
        ) {
          return filterColumns(
            cloneDeep(this.resultOptions.renderColumns)
              .map(this.handleInitColumn)
              .sort((a, b) => a.order - b.order)
          );
        }
        return [];
      },
    },
    methods: {
      getUserOptions() {
        let userOptions = opts || this.options;
        userOptions = cloneDeep(userOptions);
        userOptions.size = userOptions.size || (this.$ELEMENT || {}).size;
        return this.convertKeysToCamelCase(
          Object.assign(userOptions, this.attrs)
        );
      },
      handleInitColumn(col, index) {
        let item = { ...col };
        if (item.presetType) {
          item = mergeTemp("render", item.presetType, item);
        }
        const formatData = get(item, "formatData.type") || item.formatData;
        if (typeof formatData === "string") {
          item.formatData = Object.assign(
            {},
            item.formatData,
            singleMerge("formatData", formatData, item)
          );
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
