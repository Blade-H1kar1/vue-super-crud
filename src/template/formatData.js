import { isEmptyData } from "utils";
import dayjs from "dayjs";
import { DATE_PATTERNS } from "../constants";
import { get } from "lodash-es";

export default {
  // 字符串转数组
  strToArr: (item) => {
    const separator =
      get(item, "formatData.separator") || item.separator || ",";
    return {
      input: (value, { row }) => {
        if (!value) {
          return [];
        }
        return typeof value === "string" ? value.split(separator) : value;
      },
      output: (value, { row }) => {
        if (!value) {
          return "";
        }
        return value.join(separator);
      },
    };
  },
  // 双字段格式化
  doublePropToArr: (item) => {
    const props = get(item, "formatData.doubleProp") || item.doubleProp;
    if (!Array.isArray(props)) {
      console.error("doubleProp必须为数组");
      return;
    }
    return {
      input: (value, { row }) => {
        return row[props[0]] !== undefined || row[props[1]] !== undefined
          ? [row[props[0]] || "", row[props[1]] || ""]
          : [];
      },
      output: (value, { row }, setRow) => {
        if (value && value.length) {
          setRow(props[0], value[0]);
          setRow(props[1], value[1]);
        } else {
          setRow(props[0], "");
          setRow(props[1], "");
        }
      },
    };
  },
  // 多字段格式化
  multiPropToArr: (item) => {
    const props = get(item, "formatData.multiProp") || item.multiProp;
    // 是否包裹对象
    const isObject = get(item, "formatData.isObject") || item.isObject;
    if (!Array.isArray(props)) {
      console.error("multiProp必须为数组");
      return;
    }
    return {
      input: (value, { row }) => {
        // 检查是否所有字段都为空

        const isAllEmpty = props.every((prop) =>
          isEmptyData(isObject ? row[item.prop][prop] : row[prop])
        );
        if (isAllEmpty) return [];

        // 获取所有值（包括空值）
        const values = props.map((prop) =>
          +isObject ? row[item.prop][prop] : row[prop]
        );

        // 找到最后一个非空值的索引
        const lastValidIndex = values.reduce((lastIndex, val, index) => {
          return !isEmptyData(val) ? index : lastIndex;
        }, -1);

        // 检查从开始到最后一个非空值之间是否有空值
        const hasInvalidGap = values
          .slice(0, lastValidIndex + 1)
          .some((val, index) => isEmptyData(val));

        // 如果中间有空值，返回空数组；否则返回到最后一个非空值的数组
        return hasInvalidGap ? [] : values.slice(0, lastValidIndex + 1);
      },
      output: (value, { row }, setRow) => {
        // 如果value为空数组或undefined，清空所有字段
        if (!value || !Array.isArray(value) || value.length === 0) {
          props.forEach((prop) =>
            setRow(isObject ? [item.prop, prop] : prop, "")
          );
          return;
        }

        // 设置有值的字段，其余字段清空
        props.forEach((prop, index) => {
          setRow(isObject ? [item.prop, prop] : prop, value[index] || "");
        });
      },
    };
  },
  // 通用日期格式化
  dateFormat: (item) => {
    // 转换日期格式标记
    const convertDateFormat = (format) => {
      if (!format) return format;

      return format
        .replace(/yyyy/g, "YYYY") // 年份
        .replace(/dd/g, "DD"); // 日期
    };
    // 默认配置
    const config = {
      valueFormat:
        convertDateFormat(get(item, "comp.valueFormat")) || "YYYY-MM-DD", // 优先获取时间组件格式，否则使用默认格式
      outputFormat: null, // 输出格式化
      outputType: "string",
      ...(get(item, "formatData") || item),
    };

    // 检测日期格式
    const detectDateFormat = (value) => {
      if (!value) return null;

      // 检测是否为时间戳
      if (typeof value === "number") {
        return { type: "timestamp" };
      }

      // 检测是否为 Date 对象
      if (value instanceof Date) {
        return { type: "Date" };
      }

      // 检测字符串格式
      if (typeof value === "string") {
        for (const pattern of DATE_PATTERNS) {
          if (pattern.regex.test(value)) {
            return { type: "string", format: pattern.format };
          }
        }

        // 如果没有匹配到预定义格式，但是是有效日期
        if (dayjs(value).isValid()) {
          return { type: "string", format: "unknown" };
        }
      }

      return null;
    };

    // 通用的日期转换函数
    const convertDate = (value, format) => {
      if (!value) return undefined;

      try {
        const date = dayjs(value);
        if (!date.isValid()) return undefined;
        return date.format(format);
      } catch (error) {
        console.warn("日期格式化失败:", error);
        return undefined;
      }
    };

    let originalFormat = null;
    return {
      input: (value) => {
        // 检测并存储原始格式
        originalFormat = detectDateFormat(value);

        return convertDate(value, config.valueFormat);
      },
      output: (value) => {
        if (!value) return undefined;

        // 优先使用 outputFormat, 否则使用原始格式
        const format =
          config.outputFormat || originalFormat?.format || config.valueFormat;

        // 如果是特殊类型（timestamp 或 Date），使用对应的转换器
        if (originalFormat?.type === "timestamp") {
          return dayjs(value).valueOf();
        }
        if (originalFormat?.type === "Date") {
          return dayjs(value).toDate();
        }
        return convertDate(value, format);
      },
    };
  },
  // 周格式化
  weekFormat: (item) => {
    // 默认配置
    const config = {
      valueFormat: "YYYY-MM-DD", // 日期格式
      weekStart: 0, // 周起始日（0-6）
      includeTime: false, // 是否包含时间
      separator: " ~ ", // 日期分隔符
      outputType: "array", // 输出类型：array 或 string
      ...(get(item, "formatData") || item),
    };

    let originalValue = null;
    return {
      input: (value) => {
        if (Array.isArray(value) && originalValue) return originalValue;
        return value;
      },
      output: (value) => {
        if (!value) return undefined;
        originalValue = value;
        try {
          const date = dayjs(value);
          if (!date.isValid()) return undefined;

          // 获取周的开始和结束日期
          const weekStart = date.startOf("week").add(config.weekStart, "day");
          const weekEnd = date.endOf("week").add(config.weekStart, "day");

          // 设置格式
          const format = config.includeTime
            ? `${config.valueFormat} HH:mm:ss`
            : config.valueFormat;

          const startStr = weekStart.format(format);
          const endStr = weekEnd.format(format);

          // 根据输出类型返回不同格式
          return config.outputType === "array"
            ? [startStr, endStr]
            : `${startStr}${config.separator}${endStr}`;
        } catch (error) {
          console.warn("周格式化失败:", error);
          return undefined;
        }
      },
    };
  },
  // 数字格式化
  numberFormat: (item) => {
    const config = {
      precision: 2, // 精度（小数位数）
      round: true, // 是否四舍五入
      toFixed: false, // 是否固定小数位数
      thousandth: false, // 是否显示千分位
      prefix: "", // 前缀
      suffix: "", // 后缀
      keepZero: false, // 是否保留末尾0
      ...(get(item, "formatData") || item),
    };

    // 处理千分位逻辑
    const formatThousandth = (numStr) => {
      const parts = numStr.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    };

    // 处理数字精度
    const formatPrecision = (num) => {
      if (typeof num !== "number") return num;

      if (config.precision !== undefined) {
        const multiplier = Math.pow(10, config.precision);
        num = config.round
          ? Math.round(num * multiplier) / multiplier
          : Math.floor(num * multiplier) / multiplier;
      }

      if (config.toFixed && config.precision !== undefined) {
        num = num.toFixed(config.precision);
        if (!config.keepZero) {
          num = String(Number(num));
        }
      }
      return num;
    };

    // 处理多个小数点的情况（只保留第一个）
    const normalizeInput = (inputStr) => {
      let str = inputStr;
      const parts = str.split(".");
      if (parts.length > 2) {
        str = parts[0] + "." + parts.slice(1).join("");
      }
      return str;
    };

    return {
      input: (value) => {
        try {
          let rawStr = "";
          if (typeof value === "string") {
            rawStr = normalizeInput(value);
          } else {
            rawStr = String(value);
          }

          // 校验是否为有效的数字格式（允许负号和小数点）
          if (!/^-?\d*\.?\d*$/.test(rawStr)) {
            return value;
          }

          // 检查原始字符串是否以小数点结尾
          const endsWithDot = rawStr.endsWith(".");

          const num = Number(rawStr);
          if (isNaN(num)) {
            return value;
          }
          let formatted = formatPrecision(num);
          formatted = String(formatted);

          // 如果原始输入以小数点结尾，但格式化后中没有小数点，则补回
          if (endsWithDot && !formatted.includes(".")) {
            formatted += ".";
          }

          if (config.thousandth) {
            formatted = formatThousandth(formatted);
          }

          return `${config.prefix}${formatted}${config.suffix}`;
        } catch (error) {
          console.warn("数字格式化失败:", error);
          return value;
        }
      },
      // 输出时去除格式化（还原为原始数字字符串）
      output: (value) => {
        try {
          let rawStr = String(value);

          rawStr = rawStr
            .replace(config.prefix, "")
            .replace(config.suffix, "")
            .replace(/,/g, "");

          // 如果用户处于删除过程（例如后缀已丢失），则移除最后一个字符
          if (config.suffix && value.indexOf(config.suffix) === -1) {
            rawStr = rawStr.slice(0, -1);
          }

          if (rawStr.endsWith(".")) {
            return rawStr;
          }
          const num = Number(rawStr);
          return isNaN(num) ? undefined : rawStr;
        } catch (error) {
          console.warn("数字还原失败:", error);
          return undefined;
        }
      },
    };
  },
  // 输入格式化
  inputFormat: (item) => {
    // 预设的正则规则
    const REGEX_RULES = {
      number: /[^\d]/g, // 仅数字
      phone: /[^\d]/g, // 手机号
      decimal: /[^\d.]/g, // 小数
      letter: /[^a-zA-Z]/g, // 仅字母
      chinese: /[^\u4e00-\u9fa5]/g, // 仅中文
      letterNumber: /[^a-zA-Z0-9]/g, // 字母和数字
      email: /[^a-zA-Z0-9@._-]/g, // 邮箱
      custom: null, // 自定义正则
    };

    // 默认配置
    const config = {
      inputType: "number", // 格式化类型
      pattern: "", // 自定义正则
      maxLength: undefined, // 最大长度
      decimal: undefined, // 小数位数（type为decimal时使用）
      ...(get(item, "formatData") || item),
    };

    // 处理小数格式化
    const formatDecimal = (value) => {
      if (!value) return value;

      // 先去除非数字和小数点
      let formatted = value.replace(/[^\d.]/g, "");

      // 只保留第一个小数点
      const parts = formatted.split(".");
      if (parts.length > 2) {
        formatted = parts[0] + "." + parts.slice(1).join("");
      }

      // 处理小数位数
      if (config.decimal !== undefined && parts[1]) {
        formatted = parts[0] + "." + parts[1].slice(0, config.decimal);
      }

      return formatted;
    };

    return {
      input: (value) => {
        if (!value) return value;

        try {
          let formatted = String(value);

          // 处理最大长度
          if (config.maxLength) {
            formatted = formatted.slice(0, config.maxLength);
          }

          // 小数特殊处理
          if (config.inputType === "decimal") {
            return formatDecimal(formatted);
          }

          // 优先使用自定义正则，如果没有则使用预设规则
          const rule = config.pattern
            ? new RegExp(config.pattern, "g")
            : REGEX_RULES[config.inputType];

          return formatted.replace(rule, "");
        } catch (error) {
          console.warn("输入格式化失败:", error);
          return value;
        }
      },
      output: (value) => value,
    };
  },
  // 百分比格式化
  percentFormat: (item) => {
    const config = {
      precision: 2, // 小数位数
      multiplier: 100, // 乘数因子
      addSymbol: true, // 是否添加百分号
      ...(get(item, "formatData") || item),
    };

    return {
      input: (value) => {
        if (!value && value !== 0) return "";
        try {
          const num = Number(value) * config.multiplier;
          const formatted = num.toFixed(config.precision);
          return config.addSymbol ? `${formatted}%` : formatted;
        } catch (error) {
          console.warn("百分比格式化失败:", error);
          return value;
        }
      },
      output: (value) => {
        if (!value && value !== 0) return undefined;
        try {
          const num = parseFloat(value.replace("%", "")) / config.multiplier;
          return isNaN(num) ? undefined : String(num);
        } catch (error) {
          console.warn("百分比还原失败:", error);
          return undefined;
        }
      },
    };
  },
  // 文件大小格式化
  fileSizeFormat: (item) => {
    const config = {
      units: ["B", "KB", "MB", "GB", "TB"],
      precision: 2,
      ...(get(item, "formatData") || item),
    };

    return {
      input: (value) => {
        if (!value && value !== 0) return "";
        try {
          let size = Number(value);
          let unitIndex = 0;

          while (size >= 1024 && unitIndex < config.units.length - 1) {
            size /= 1024;
            unitIndex++;
          }

          return `${size.toFixed(config.precision)} ${config.units[unitIndex]}`;
        } catch (error) {
          console.warn("文件大小格式化失败:", error);
          return value;
        }
      },
      output: (value) => {
        if (!value) return undefined;
        try {
          const [size, unit] = value.split(" ");
          const unitIndex = config.units.indexOf(unit);
          if (unitIndex === -1) return undefined;

          const bytes = parseFloat(size) * Math.pow(1024, unitIndex);
          return String(Math.round(bytes));
        } catch (error) {
          console.warn("文件大小还原失败:", error);
          return undefined;
        }
      },
    };
  },
};
