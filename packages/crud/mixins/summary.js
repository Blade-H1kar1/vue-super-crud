import { isFunction, get } from "lodash-es";

// 内置统计方法
export const builtInSummaryMethods = {
  // 求和
  sum(values, config = {}) {
    const { ignoreZero, absolute } = config;
    let filteredValues = [...values];
    if (ignoreZero) {
      filteredValues = filteredValues.filter((v) => v !== 0);
    }
    if (absolute) {
      filteredValues = filteredValues.map((v) => Math.abs(v));
    }
    return filteredValues.reduce((acc, curr) => acc + curr, 0);
  },

  // 平均值
  avg(values, config = {}) {
    const { ignoreZero } = config;
    let filteredValues = [...values];
    if (ignoreZero) {
      filteredValues = filteredValues.filter((v) => v !== 0);
    }
    return filteredValues.length
      ? filteredValues.reduce((acc, curr) => acc + curr, 0) /
          filteredValues.length
      : 0;
  },

  // 计数
  count(values, config = {}) {
    const { ignoreZero, predicate } = config;

    if (isFunction(predicate)) {
      return values.filter(predicate).length;
    }

    if (ignoreZero) {
      return values.filter((v) => v !== 0).length;
    }

    return values.length;
  },

  // 最大值
  max(values, config = {}) {
    const { absolute } = config;
    if (!values.length) return 0;

    let filteredValues = [...values];
    if (absolute) {
      filteredValues = filteredValues.map((v) => Math.abs(v));
    }
    return Math.max(...filteredValues);
  },

  // 最小值
  min(values, config = {}) {
    const { absolute } = config;
    if (!values.length) return 0;

    let filteredValues = [...values];
    if (absolute) {
      filteredValues = filteredValues.map((v) => Math.abs(v));
    }
    return Math.min(...filteredValues);
  },
};

export default {
  methods: {
    summaryMethod(param) {
      if (!this.showSummary) return;

      const { columns } = param;
      const data = this.crudOptions.summaryData || this.list;
      let sumsList = {};
      let sums = new Array(columns.length).fill("");

      // 使用自定义统计方法
      if (isFunction(this.crudOptions.summaryMethod)) {
        try {
          sums = this.crudOptions.summaryMethod(param);
        } catch (error) {
          console.error("自定义统计方法执行出错:", error);
          this.sumsList = {};
          return sums;
        }
      } else {
        // 使用内置统计方法
        columns.forEach((column, index) => {
          const currItem = column.col;
          if (!currItem?.summary) return;

          try {
            const summaryConfig = this.normalizeSummaryConfig(currItem.summary);
            const result = this.calculateSummary(data, column, summaryConfig);
            sums[index] = this.formatSummaryResult(result, summaryConfig);

            if (column.property) {
              sumsList[column.property] = sums[index];
            }
          } catch (error) {
            console.error(`列 ${column.property} 统计计算出错:`, error);
            sums[index] = "";
          }
        });
      }

      this.sumsList = sumsList;
      return sums;
    },

    // 标准化summary配置
    normalizeSummaryConfig(summary) {
      if (typeof summary === "string") {
        return { type: summary };
      }
      if (typeof summary === "function") {
        return { type: "custom", method: summary };
      }
      return summary;
    },

    // 计算统计值
    calculateSummary(data, column, config) {
      const { type, method, path, ignoreZero, absolute, predicate } = config;

      // 获取数值 - 根据统计类型区分处理
      let values;
      if (type === "count") {
        // count类型直接获取原始值
        values = data.map((item) => {
          return path ? get(item, path) : item[column.property];
        });
      } else {
        // 其他类型转换为数值
        values = data
          .map((item) => {
            const value = path ? get(item, path) : item[column.property];
            return Number(value);
          })
          .filter((value) => !isNaN(value));
      }

      if (type === "custom" && isFunction(method)) {
        return method(values, data);
      }

      const summaryMethod = builtInSummaryMethods[type.toLowerCase()];
      if (!summaryMethod) {
        console.warn(`未知的统计类型: ${type}`);
        return type;
      }

      return summaryMethod(values, {
        ignoreZero,
        absolute,
        predicate,
      });
    },
    // 格式化统计结果
    formatSummaryResult(result, config) {
      const { prefix = "", suffix = "", decimals = 0 } = config;

      if (result === null || result === undefined) return "";

      const formattedValue = Number.isFinite(result)
        ? Number(Number(result).toFixed(decimals)).toString()
        : result;

      return `${prefix}${formattedValue}${suffix}`;
    },
  },
};
