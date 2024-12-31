import {
  merge,
  cloneDeep,
  isFunction,
  isPlainObject,
  debounce,
  isEqual,
} from "lodash-es";
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
        resultColumns: [],
        resultOptions: {},
      };
    },
    watch: {
      initColumns() {
        this.debounceInitHandler();
      },
      options: {
        handler() {
          this.debounceInitHandler();
        },
        deep: true,
      },
      $attrs(v, oldVal) {
        if (!isEqual(v, oldVal)) {
          this.debounceInitHandler();
        }
      },
    },
    computed: {
      initColumns() {
        const columns = this.options.renderColumns || this.renderColumns;
        return isFunction(columns) ? columns() : columns;
      },
    },
    created() {
      this.initHandler();
      this.debounceInitHandler = debounce(this.initHandler, 0);
    },
    methods: {
      initHandler() {
        this.resultOptions = configManager.getInstance().mergeConfig(
          Object.assign(this.getUserOptions(), {
            renderColumns: this.initColumns,
          }),
          {
            type: optionsKey,
          }
        );
        if (
          this.resultOptions.renderColumns &&
          Array.isArray(this.resultOptions.renderColumns)
        ) {
          this.resultColumns = filterColumns(
            cloneDeep(this.resultOptions.renderColumns)
              .map(this.handleInitColumn)
              .sort((a, b) => a.order - b.order)
          );
        }
        // console.log(this.resultOptions, this.resultColumns, "resultColumns");
      },
      resetInit() {
        this.initHandler();
      },
      getUserOptions() {
        let userOptions = opts || this.options;
        userOptions = cloneDeep(userOptions);
        userOptions.size = userOptions.size || (this.$ELEMENT || {}).size;
        return this.convertKeysToCamelCase(
          Object.assign(userOptions, this.$attrs)
        );
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
