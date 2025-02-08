import Mock from "mockjs";
const Random = Mock.Random;

/**
 * 预设的数据生成规则
 */
const PRESET_RULES = {
  // 用户信息相关
  name: () => Random.cname(),
  nickname: () => Random.cword(2, 4),
  username: () => Random.word(5, 8),
  password: () => Random.string("lower", 8, 16),
  email: () => Random.email(),
  phone: () => Mock.mock(/^1[3-9]\d{9}$/),
  idcard: () => Mock.mock(/^\d{18}$/),
  avatar: () => Random.image("100x100"),

  // 地址相关
  province: () => Random.province(),
  city: () => Random.city(),
  address: () => Random.county(true),
  zip: () => Random.zip(),

  // 公司相关
  company: () => Random.company(),
  department: () => Random.cword(2, 4) + "部",
  position: () => Random.cword(2, 4),

  // 其他常用
  guid: () => Random.guid(),
  age: () => Random.integer(18, 60),
  status: () => Random.pick(["active", "inactive", "pending"]),
  timestamp: () => Random.datetime("T"),
  color: () => Random.color(),
  url: () => Random.url(),
};

export function generateCustomMockData(m, scope) {
  if (typeof m === "function") {
    return m(
      {
        Random,
        Mock,
      },
      scope
    );
  }
  return m;
}

/**
 * 根据配置生成 mock 数据
 */
export function generateMockData(config, options = {}) {
  if (!config) return null;

  const { yearRange = 1, preset, pattern } = options;

  // 1. 检查是否使用预设规则
  if (preset && PRESET_RULES[preset]) {
    return PRESET_RULES[preset]();
  }

  if (config.disabled) {
    return undefined;
  }

  if (pattern) {
    return Mock.mock(pattern);
  }

  // 5. 根据组件类型生成数据
  switch (config.type) {
    case "input":
      return generateInputValue(config);
    case "number":
      return generateNumberValue(config);
    case "select":
      return generateSelectValue(config);
    case "date":
      return generateDateValue(config, { yearRange });
    case "time":
      return generateTimeValue(config);
    case "radio":
      return generateRadioValue(config);
    case "checkbox":
      return generateCheckboxValue(config);
    case "cascader":
      return generateCascaderValue(config);
    case "switch":
      return generateSwitchValue(config);
    case "slider":
      return generateSliderValue(config);
    case "rate":
      return generateRateValue(config);
    default:
      return undefined;
  }
}

function generateInputValue(config) {
  const { subtype, maxLength = 10, minLength = 0 } = config;

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
  const { min = 0, max = 100, precision = 0 } = config;
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
  const { min = "00:00", max = "23:59", step = 60 } = config;
  const [minHour, minMinute] = min.split(":").map(Number);
  const [maxHour, maxMinute] = max.split(":").map(Number);

  const totalMinutes = Random.integer(
    minHour * 60 + minMinute,
    maxHour * 60 + maxMinute
  );

  const hour = Math.floor(totalMinutes / 60);
  const minute = Math.floor((totalMinutes % 60) / step) * step;

  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
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

  const { options = [], min = 0, max = options.length } = config;
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
  const { options = [], props = {}, multiple } = config;

  function getRandomPath(items) {
    if (!items.length) return [];
    const item = Random.pick(items);
    const children = item[props.children || "children"] || [];
    return [item[props.value || "value"]].concat(
      Math.random() < 0.7 ? getRandomPath(children) : []
    );
  }

  if (multiple) {
    const count = Random.integer(1, 3);
    return Array.from({ length: count }, () => getRandomPath(options));
  }

  return getRandomPath(options);
}

function generateSwitchValue(config) {
  const { activeValue = true, inactiveValue = false } = config;
  return Random.boolean() ? activeValue : inactiveValue;
}

function generateSliderValue(config) {
  const { min = 0, max = 100, step = 1, range = false } = config;

  if (range) {
    const value1 = Random.integer(min, max - step);
    const value2 = Random.integer(value1 + step, max);
    return [value1, value2];
  }

  return Random.integer(min, max);
}

function generateRateValue(config) {
  const { max = 5, allowHalf = false } = config;
  if (allowHalf) {
    return Math.round(Random.float(0, max) * 2) / 2;
  }
  return Random.integer(0, max);
}
