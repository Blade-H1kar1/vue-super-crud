import { isArray } from "lodash-es";
import { mergeDataFormat } from "utils/mergeTemp";

export default {
  props: {
    format: [String, Object],
    formatWatchDeep: Boolean,
    scope: Object,
    item: Object,
    prop: String,
  },
  data() {
    return {
      formatRow: null,
    };
  },
  created() {
    if (this.format) {
      this.initDataFormat();
      this.$watch(() => this.format, this.initDataFormat);
    }
  },
  computed: {
    formatScope() {
      // 存在格式化时使用渲染数据使用formatRow
      const scope = this.format
        ? { ...this.scope, row: this.formatRow }
        : this.scope;
      return scope;
    },
  },
  methods: {
    initDataFormat() {
      let scope = this.scope;
      if (this.format) {
        const format = mergeDataFormat(this.format, this.item);
        if (this.formatWatchDeep === true) {
          this.$watch(
            () => scope.row,
            (val) => {
              this.formatRow = this.dataFormat(scope.row, format, this.prop);
            },
            {
              immediate: true,
              deep: true,
            }
          );
          this.$watch(
            () => this.formatRow,
            (val) => {
              const newRow = this.dataFormat(
                this.formatRow,
                format,
                this.prop,
                "outer"
              );
              Object.keys(scope.row).forEach((key) => {
                this.$set(scope.row, key, newRow[key]);
              });
            },
            {
              deep: true,
            }
          );
        } else {
          this.$watch(
            () => scope.row[this.prop],
            (val) => {
              this.formatRow = this.dataFormat(scope.row, format, this.prop);
            },
            {
              immediate: true,
            }
          );
          this.$watch(
            () => this.formatRow[this.prop],
            (val) => {
              const newRow = this.dataFormat(
                this.formatRow,
                format,
                this.prop,
                "outer"
              );
              Object.keys(scope.row).forEach((key) => {
                this.$set(scope.row, key, newRow[key]);
              });
            }
          );
        }
      }
    },
    // 外部数据与内部数据的格式转换 inner:内部数据 outer:外部数据
    dataFormat(data, format, key, type = "inner") {
      const obj = { ...data };
      // 多字段格式化处理
      if (key.includes("-")) {
        const keys = key.split("-");
        if (type === "inner") {
          // 删除多余字段
          keys.forEach((k) => {
            delete obj[k];
          });

          const value = [];
          keys.forEach((k) => {
            value.push(data[k] || "");
          });
          if (format) {
            const res = format[type](value, key, obj, data, format);
            if (res !== undefined) obj[key] = res;
          } else {
            // 默认返回数组
            obj[key] = value;
          }
        } else {
          // 删除多余字段
          delete obj[key];

          const value = data[key];
          if (!value)
            return keys.forEach((k, idx) => {
              obj[k] = "";
            });
          if (format) {
            const res = format[type](value, key, obj, data, format);
            if (
              res !== undefined &&
              isArray(res) &&
              res.length === keys.length
            ) {
              keys.forEach((k, idx) => {
                obj[k] = res[idx];
              });
            }
          } else {
            keys.forEach((k, idx) => {
              obj[k] = value[idx];
            });
          }
        }
      } else if (format) {
        const res = format[type](data[key], key, obj, data, format);
        if (res !== undefined) obj[key] = res;
      }
      return obj;
    },
  },
};
