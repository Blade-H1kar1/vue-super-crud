import { isFunction } from "lodash-es";

export default {
  computed: {
    sameRowMap() {
      const sameRowSpans = Array.from(new Set(this.sameRowSpans));
      if (!sameRowSpans.length) return {};
      const map = {};
      sameRowSpans.forEach((item) => {
        map[item] = this.createGroupMap(this.list, item);
      });
      return map;
    },
    sumColumnList() {
      return this.trueRenderColumns.filter((item) => item.summary);
    },
    showSummary() {
      return (
        this.crudOptions.showSummary ||
        this.crudOptions.showSummary === "" ||
        this._showSummary ||
        isFunction(this.crudOptions.summaryMethod)
      );
    },
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        this.crudOptions.spanMethod &&
        isFunction(this.crudOptions.spanMethod)
      ) {
        const result = this.crudOptions.spanMethod({
          row,
          column,
          rowIndex,
          columnIndex,
        });
        if (result) return result;
      }
      const col = column.col;
      if (col) {
        if (col.spanMethod) {
          return col.spanMethod({ row, column, rowIndex, columnIndex });
        }
        if (col.sameRowSpan) {
          let prop =
            typeof col.sameRowSpan === "string" ? col.sameRowSpan : col.prop;
          const map = this.sameRowMap[prop];
          if (map) {
            const mapItem = map[row[prop]];
            if (mapItem.firstIndex === rowIndex) {
              return {
                rowspan: mapItem.span,
                colspan: 1,
              };
            } else {
              return {
                rowspan: 0,
                colspan: 0,
              };
            }
          }
        }
      }
    },
    createGroupMap(arr, groupBy) {
      const groupMap = {};
      const map = {};
      // 根据 `groupBy` 属性分组
      arr.forEach((item, index) => {
        const key = item[groupBy];
        if (!groupMap[key]) {
          groupMap[key] = [];
        }
        groupMap[key].push({ item, index });
      });
      let index = 0;
      // 计算每个分组的 firstIndex 和 span
      for (const key in groupMap) {
        if (groupMap.hasOwnProperty(key)) {
          // 对 `groupMap` 中的每个分组按索引进行排序
          groupMap[key].sort((a, b) => a.index - b.index);
          const firstIndex = groupMap[key][0].index;
          const span = groupMap[key].length;
          map[key] = {
            firstIndex,
            span,
            spanIndex: index++,
          };
        }
      }
      return map;
    },
    summaryMethod(param) {
      let sumsList = {};
      let sums = [];
      const { columns } = param;
      const data = this.list;
      if (!this.showSummary) return;
      if (isFunction(this.crudOptions.summaryMethod)) {
        //如果自己写逻辑则调用summaryMethod方法
        sums = this.crudOptions.summaryMethod(param);
        columns.forEach((column, index) => {
          sumsList[column.property] = sums[index];
        });
        this.sumsList = sumsList;
      } else {
        columns.forEach((column, index) => {
          let currItem = column.col;
          if (currItem && currItem.summary) {
            let decimals = currItem.decimals || 2;
            let prefix = currItem.prefix || "";
            let values = data.map((item) => Number(item[column.property]));
            // 过滤掉 NaN 值
            values = values.filter((value) => !isNaN(value));

            if (typeof currItem.summary === "string") {
              switch (currItem.summary) {
                case "count":
                  sums[index] = prefix + data.length;
                  break;
                case "avg":
                  if (values.length > 0) {
                    let sum = values.reduce((acc, curr) => acc + curr, 0);
                    sums[index] =
                      prefix + (sum / values.length).toFixed(decimals);
                  } else {
                    sums[index] = prefix + "0.00";
                  }
                  break;
                case "sum":
                  let total = values.reduce((acc, curr) => acc + curr, 0);
                  sums[index] = prefix + total.toFixed(decimals);
                  break;
                case "max":
                  if (values.length > 0) {
                    sums[index] =
                      prefix + Math.max(...values).toFixed(decimals);
                  } else {
                    sums[index] = prefix + "0.00";
                  }
                  break;
                case "min":
                  if (values.length > 0) {
                    sums[index] =
                      prefix + Math.min(...values).toFixed(decimals);
                  } else {
                    sums[index] = prefix + "0.00";
                  }
                  break;
                default:
                  sums[index] = currItem.summary;
              }
            } else if (typeof currItem.summary === "function") {
              sums[index] = currItem.summary(values, data);
            }
            sumsList[column.property] = sums[index];
          } else {
            sums[index] = "";
          }
        });
      }
      this.sumsList = sumsList;
      return sums;
    },
  },
};
