import Mock from "mockjs";
import mockConfig from "src/config/mock";
import { findComponentInstance } from "utils";
const Random = Mock.Random;

/**
 * 预设的数据生成规则
 */
const PRESET_RULES = {
  // 数字相关
  integer: (min = 1, max = 100) => Random.integer(min, max), // 整数
  float: (min = 1, max = 100, precision = 2) =>
    Random.float(min, max, 0, precision), // 浮点数

  // 文本相关
  chinese: (min = 2, max = 4) => Random.cword(min, max), // 中文字符
  english: (min = 3, max = 8) => Random.word(min, max), // 英文字符
  paragraph: (min = 1, max = 3) => Random.cparagraph(min, max), // 中文段落
  sentence: (min = 3, max = 8) => Random.csentence(min, max), // 中文句子

  // 特殊格式
  email: () => Random.email(), // 邮箱
  phone: () => Mock.mock(/^1[3-9]\d{9}$/), // 手机号
  id: () => Mock.mock(/^\d{18}$/), // 18位数字
  date: (format = "yyyy-MM-dd") => Random.date(format), // 日期
  time: (format = "HH:mm:ss") => Random.time(format), // 时间
  datetime: (format = "yyyy-MM-dd HH:mm:ss") => Random.datetime(format), // 日期时间
  timestamp: () => Random.datetime("T"), // 时间戳

  // 列表生成
  array: (generator, length = 1) => {
    const count =
      typeof length === "number"
        ? length
        : Random.integer(length[0], length[1]);
    return Array.from({ length: count }, () =>
      typeof generator === "function" ? generator() : generator
    );
  },

  // 图片相关
  image: (width = 100, height = 100) => Random.image(`${width}x${height}`),
  imageUrl: (seed = 1, width = 100, height = 100) =>
    `https://picsum.photos/seed/${seed}/${width}/${height}`,
  url: () => Random.url(),

  // 其他
  pick: (arr) => Random.pick(arr), // 从数组中随机选择
  uuid: () => Random.guid(), // 唯一标识
};

export function generateCustomMockData(m, scope) {
  if (typeof m === "function") {
    return m(
      {
        Random,
        Mock,
        Preset: PRESET_RULES,
      },
      scope
    );
  }
  return m;
}

const typeGenerators = {
  input: generateInputValue,
  number: generateNumberValue,
  select: generateSelectValue,
  date: generateDateValue,
  time: generateTimeValue,
  radio: generateRadioValue,
  checkbox: generateCheckboxValue,
  cascader: generateCascaderValue,
  switch: generateSwitchValue,
  slider: generateSliderValue,
  rate: generateRateValue,
  transfer: generateTransferValue,
};

/**
 * 根据配置生成 mock 数据
 */
export function generateMockData(config, options = {}) {
  if (!config) return null;

  const { yearRange = 1, pattern, vnode, componentName } = options;

  if (config.disabled) {
    return undefined;
  }

  if (pattern) {
    return Mock.mock(pattern);
  }

  // 处理自定义组件模拟数据
  if (vnode && componentName) {
    const customValue = generateCustomComponentMockData(vnode, componentName);
    if (customValue !== undefined) {
      return customValue;
    }
  }

  const generator = typeGenerators[config.type];
  if (generator) {
    return generator(config, { yearRange });
  }

  return undefined;
}

/**
 * 根据组件名称生成自定义模拟数据
 * @param {Object} vnode 组件VNode
 * @param {String} componentName 组件名称
 * @returns {any} 模拟数据
 */
export function generateCustomComponentMockData(vnode, componentName) {
  // 获取组件实例
  let instance;
  if (componentName) {
    instance = findComponentInstance(vnode?.componentInstance, componentName);
  } else {
    for (const key in mockConfig) {
      const instance = findComponentInstance(vnode?.componentInstance, key);
      if (instance) {
        componentName = key;
        break;
      }
    }
  }
  if (!instance) return undefined;

  // 查找对应的自定义模拟函数
  const mockFn = mockConfig[componentName];
  if (typeof mockFn !== "function") return undefined;

  try {
    // 执行自定义模拟函数
    return mockFn(instance, {
      Random,
      Mock,
      Preset: PRESET_RULES,
    });
  } catch (error) {
    console.warn(`自定义组件 ${componentName} 的模拟数据生成失败:`, error);
    return undefined;
  }
}

function generateInputValue(config) {
  const { subtype, maxLength = 10, minLength = 1 } = config;

  switch (subtype) {
    case "email":
      return Random.email();
    case "url":
      return Random.url();
    case "number":
      return Random.string("number", minLength, maxLength);
    case "tel":
    case "phone":
      return Mock.mock(/^1[3-9]\d{9}$/);
    case "textarea":
      return Random.cparagraph(1, 3);
    default:
      return Random.cword(minLength, maxLength);
  }
}

function generateNumberValue(config) {
  const { min = 1, max = 100, precision = 0 } = config;
  const factor = Math.pow(10, precision);
  return Math.round(Random.float(min, max) * factor) / factor;
}

function generateSelectValue(config) {
  const { options = [], multiple, multipleLimit = 3 } = config;

  if (!options.length) return multiple ? [] : undefined;

  if (multiple) {
    const availableOptions = options.filter((opt) => !opt.disabled);
    const maxCount = multipleLimit || availableOptions.length;
    const count = Random.integer(1, maxCount);
    const values = Random.pick(
      availableOptions.map((opt) => opt.value),
      count
    );
    return Array.isArray(values) ? values : [values];
  }

  const availableOptions = options.filter((opt) => !opt.disabled);
  if (!availableOptions.length) return undefined;

  const option = Random.pick(availableOptions);
  return option.value;
}

function generateDateValue(config, options = {}) {
  const { pickerType, valueFormat } = config;
  const { yearRange = 1 } = options;

  // 计算日期范围
  const now = new Date();
  const minDate = new Date(now);
  minDate.setFullYear(now.getFullYear() - yearRange);

  // 如果配置中有指定范围，则使用配置的范围
  const startDate = config.min ? new Date(config.min) : minDate;
  const endDate = config.max ? new Date(config.max) : now;

  // 辅助函数：生成指定范围内的随机日期
  function getRandomDate() {
    const timestamp =
      startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime());
    const date = new Date(timestamp);
    if (valueFormat) {
      return formatDate(date, valueFormat);
    }
    return date.toISOString().split("T")[0];
  }

  // 辅助函数：格式化日期
  function formatDate(date, format) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return format
      .replace(/yyyy/g, year)
      .replace(/MM/g, month)
      .replace(/dd/g, day)
      .replace(/HH/g, hours)
      .replace(/mm/g, minutes)
      .replace(/ss/g, seconds);
  }

  switch (pickerType) {
    case "datetime": {
      const date = new Date(
        startDate.getTime() +
          Math.random() * (endDate.getTime() - startDate.getTime())
      );
      return valueFormat ? formatDate(date, valueFormat) : date.toISOString();
    }

    case "daterange":
    case "datetimerange": {
      const date1 = getRandomDate();
      let date2;
      do {
        date2 = getRandomDate();
      } while (date2 <= date1);
      return [date1, date2];
    }

    case "month": {
      const date = new Date(
        startDate.getTime() +
          Math.random() * (endDate.getTime() - startDate.getTime())
      );
      return valueFormat
        ? formatDate(date, valueFormat)
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
    }

    case "year": {
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const year =
        startYear + Math.floor(Math.random() * (endYear - startYear + 1));
      return valueFormat
        ? formatDate(new Date(year, 0, 1), valueFormat)
        : String(year);
    }

    case "dates": {
      const count = Random.integer(1, 3);
      const dates = new Set();
      while (dates.size < count) {
        dates.add(getRandomDate());
      }
      return Array.from(dates).sort();
    }

    default:
      return getRandomDate();
  }
}

function generateTimeValue(config) {
  const {
    isRange,
    valueFormat = "HH:mm:ss",
    format = "HH:mm:ss",
    min = "01:00:00",
    max = "23:59:59",
    step = 1,
  } = config;

  // 辅助函数：生成随机时间
  function generateTime() {
    const [minHour, minMinute, minSecond = "00"] = min.split(":").map(Number);
    const [maxHour, maxMinute, maxSecond = "59"] = max.split(":").map(Number);

    const minTotal = minHour * 3600 + minMinute * 60 + minSecond;
    const maxTotal = maxHour * 3600 + maxMinute * 60 + maxSecond;

    let totalSeconds = Random.integer(minTotal, maxTotal);
    totalSeconds = Math.floor(totalSeconds / step) * step;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const timeStr = [hours, minutes, seconds]
      .map((num) => String(num).padStart(2, "0"))
      .join(":");

    return valueFormat.includes("ss") ? timeStr : timeStr.slice(0, 5);
  }

  if (isRange) {
    const time1 = generateTime();
    let time2;
    do {
      time2 = generateTime();
    } while (time2 <= time1);
    return [time1, time2];
  }

  return generateTime();
}

function generateRadioValue(config) {
  const { options = [] } = config;
  if (!options.length) return undefined;

  const availableOptions = options.filter((opt) => !opt.disabled);
  if (!availableOptions.length) return undefined;

  const option = Random.pick(availableOptions);
  return option.value;
}

function generateCheckboxValue(config) {
  if (config.trueLabel !== undefined) {
    return Random.boolean() ? config.trueLabel : config.falseLabel;
  }

  const { options = [], min = 1, max = options.length } = config;
  if (!options.length) return [];

  const availableOptions = options.filter((opt) => !opt.disabled);
  const count = Random.integer(min, Math.min(max, availableOptions.length));

  const values = Random.pick(
    availableOptions.map((opt) => opt.value),
    count
  );
  return Array.isArray(values) ? values : [values];
}

function generateCascaderValue(config) {
  const { options = [], props = {} } = config;

  // 获取完整的路径(直到叶子节点)
  function getFullPath(items, currentPath = []) {
    if (!items?.length) return currentPath;

    const item = Random.pick(items);
    currentPath.push(item[props.value || "value"]);

    const children = item[props.children || "children"];
    if (!children?.length) return currentPath;

    // 如果不是任意级别选择，必须选到最后一级
    if (!props.checkStrictly) {
      return getFullPath(children, currentPath);
    }

    // 如果是任意级别选择，随机决定是否继续选择子级
    return Math.random() < 0.5
      ? currentPath
      : getFullPath(children, currentPath);
  }

  // 获取随机路径
  function getRandomPath(items) {
    if (!items?.length) return [];
    return getFullPath(items);
  }

  if (props.multiple) {
    // 生成1-3个路径
    const count = Random.integer(1, 3);
    const paths = new Set(); // 使用Set避免重复路径

    while (paths.size < count) {
      const path = getRandomPath(options);
      paths.add(JSON.stringify(path)); // 转成字符串以便Set去重
    }

    return Array.from(paths).map((path) => JSON.parse(path));
  }

  return getRandomPath(options);
}

function generateSwitchValue(config) {
  const { activeValue = true, inactiveValue = false } = config;
  return Random.boolean() ? activeValue : inactiveValue;
}

function generateSliderValue(config) {
  const { min = 1, max = 100, step = 1, range = false } = config;

  // 根据step调整值
  const adjustValueByStep = (value) => {
    if (!step || step === 1) return value;
    // 计算最接近的合法值
    return Math.round(value / step) * step;
  };

  if (range) {
    // 生成范围值
    const value1 = adjustValueByStep(Random.integer(min, max - step));
    const value2 = adjustValueByStep(Random.integer(value1 + step, max));
    return [value1, value2];
  }

  // 生成单个值
  return adjustValueByStep(Random.integer(min, max));
}

function generateRateValue(config) {
  const { max = 5, allowHalf = false } = config;

  if (allowHalf) {
    // 生成0.5的倍数
    const value = Random.integer(1, max * 2) / 2;
    return value;
  }
  return Random.integer(1, max);
}

function generateTransferValue(config) {
  const { data = [] } = config;

  if (!data.length) return [];

  // 随机选择1-3个可用的值
  const availableValues = data
    .filter((item) => !item.disabled)
    .map((item) => item.key || item.value);

  const count = Random.integer(1, Math.min(3, availableValues.length));
  const selectedValues = Random.pick(availableValues, count);

  // 如果是数组则返回数组，否则返回单个值
  return Array.isArray(selectedValues) ? selectedValues : [selectedValues];
}
