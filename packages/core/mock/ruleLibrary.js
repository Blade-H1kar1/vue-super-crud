import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
/**
 * 规则库 - 预设的数据生成规则
 */

export const RULE_CATEGORIES = {
  BASIC: "basic", // 基础类型
  TEXT: "text", // 文本类型
  NUMBER: "number", // 数字类型
  DATE: "date", // 日期时间
  SPECIAL: "special", // 特殊格式
  CUSTOM: "custom", // 自定义
};

export const RULE_LIBRARY = {
  // 基础类型
  [RULE_CATEGORIES.BASIC]: [
    {
      id: "uuid",
      name: "UUID",
      description: "唯一标识符",
      icon: "el-icon-key",
      generator: () => {
        const template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
        return template.replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      },
      configurable: false,
    },
  ],

  // 文本类型
  [RULE_CATEGORIES.TEXT]: [
    {
      id: "chinese_name",
      name: "中文姓名",
      description: "随机中文姓名",
      icon: "el-icon-user",
      generator: () => {
        const surnames = [
          "李",
          "王",
          "张",
          "刘",
          "陈",
          "杨",
          "赵",
          "黄",
          "周",
          "吴",
        ];
        const names = [
          "伟",
          "芳",
          "娜",
          "秀英",
          "敏",
          "静",
          "丽",
          "强",
          "磊",
          "军",
        ];
        return (
          surnames[Math.floor(Math.random() * surnames.length)] +
          names[Math.floor(Math.random() * names.length)] +
          (Math.random() > 0.5
            ? names[Math.floor(Math.random() * names.length)]
            : "")
        );
      },
      configurable: false,
    },
    {
      id: "chinese_text",
      name: "中文文本",
      description: "指定长度的中文文本",
      icon: "el-icon-document",
      generator: (config) => {
        const chars =
          "的一是了我不人在他有这个上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学么之都好看起发当没成只如事把还用第样道想作种开美总从无情己面最女但现前些所同日手又行意动方期它头经长儿回位分爱老因很给名法间斯知世什两次使身者被高已亲其进此话常与活正感";
        const { minLength = 2, maxLength = 10 } = config || {};
        const length =
          Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        let result = "";
        for (let i = 0; i < length; i++) {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
      },
      configurable: true,
      configSchema: [
        {
          field: "minLength",
          label: "最小长度",
          type: "number",
          default: 2,
          min: 1,
        },
        {
          field: "maxLength",
          label: "最大长度",
          type: "number",
          default: 10,
          min: 1,
        },
      ],
    },
    {
      id: "english_text",
      name: "英文文本",
      description: "随机英文单词",
      icon: "el-icon-document",
      generator: (config) => {
        const words = [
          "lorem",
          "ipsum",
          "dolor",
          "sit",
          "amet",
          "consectetur",
          "adipiscing",
          "elit",
          "sed",
          "do",
          "eiusmod",
          "tempor",
          "incididunt",
          "ut",
          "labore",
          "et",
          "dolore",
          "magna",
          "aliqua",
        ];
        const { minWords = 1, maxWords = 5 } = config || {};
        const wordCount =
          Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
        const selectedWords = [];
        for (let i = 0; i < wordCount; i++) {
          selectedWords.push(words[Math.floor(Math.random() * words.length)]);
        }
        return selectedWords.join(" ");
      },
      configurable: true,
      configSchema: [
        {
          field: "minWords",
          label: "最少单词数",
          type: "number",
          default: 1,
          min: 1,
        },
        {
          field: "maxWords",
          label: "最多单词数",
          type: "number",
          default: 5,
          min: 1,
        },
      ],
    },
  ],

  // 数字类型
  [RULE_CATEGORIES.NUMBER]: [
    {
      id: "integer",
      name: "整数",
      description: "指定范围的随机整数",
      icon: "el-icon-s-data",
      generator: (config) => {
        const { min = 1, max = 100 } = config || {};
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      configurable: true,
      configSchema: [
        { field: "min", label: "最小值", type: "number", default: 1 },
        { field: "max", label: "最大值", type: "number", default: 100 },
      ],
    },
    {
      id: "decimal",
      name: "小数",
      description: "指定精度的随机小数",
      icon: "el-icon-s-data",
      generator: (config) => {
        const { min = 0, max = 100, precision = 2 } = config || {};
        const factor = Math.pow(10, precision);
        return (
          Math.round((Math.random() * (max - min) + min) * factor) / factor
        );
      },
      configurable: true,
      configSchema: [
        { field: "min", label: "最小值", type: "number", default: 0 },
        { field: "max", label: "最大值", type: "number", default: 100 },
        {
          field: "precision",
          label: "小数位数",
          type: "number",
          default: 2,
          min: 0,
          max: 10,
        },
      ],
    },
  ],

  // 日期时间
  [RULE_CATEGORIES.DATE]: [
    {
      id: "date",
      name: "日期",
      description: "指定格式的随机日期",
      icon: "el-icon-date",
      generator: (config) => {
        const { format = "YYYY-MM-DD", minDate, maxDate } = config || {};

        // 设置默认的最小和最大日期
        const min = minDate ? dayjs(minDate) : dayjs().subtract(3, "year");
        const max = maxDate ? dayjs(maxDate) : dayjs();

        // 确保最小日期不大于最大日期
        if (min.isAfter(max)) {
          return max.format(format);
        }

        // 计算两个日期之间的时间差（毫秒）
        const diffTime = max.valueOf() - min.valueOf();

        // 生成随机时间戳
        const randomTime = min.valueOf() + Math.floor(Math.random() * diffTime);

        // 使用 dayjs 格式化日期
        return dayjs(randomTime).format(format);
      },
      configurable: true,
      configSchema: [
        {
          field: "format",
          label: "日期格式",
          type: "select",
          default: "YYYY-MM-DD",
          options: [
            { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
            { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },
            { label: "YYYY-MM-DD HH:mm:ss", value: "YYYY-MM-DD HH:mm:ss" },
            { label: "YYYY/MM/DD HH:mm:ss", value: "YYYY/MM/DD HH:mm:ss" },
            { label: "YYYY年MM月DD日", value: "YYYY年MM月DD日" },
            { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
          ],
        },
        { field: "minDate", label: "最早日期", type: "date" },
        { field: "maxDate", label: "最晚日期", type: "date" },
      ],
    },
    {
      id: "datetime",
      name: "日期时间",
      description: "带时间的随机日期",
      icon: "el-icon-time",
      generator: (config) => {
        const {
          format = "YYYY-MM-DD HH:mm:ss",
          minDate,
          maxDate,
          withTime = true,
        } = config || {};

        // 设置默认的最小和最大日期
        const min = minDate ? dayjs(minDate) : dayjs().subtract(1, "month");
        const max = maxDate ? dayjs(maxDate) : dayjs();

        // 计算两个日期之间的时间差（毫秒）
        const diffTime = max.valueOf() - min.valueOf();

        // 生成随机时间戳
        const randomTime = min.valueOf() + Math.floor(Math.random() * diffTime);

        // 使用 dayjs 格式化日期时间
        return dayjs(randomTime).format(format);
      },
      configurable: true,
      configSchema: [
        {
          field: "format",
          label: "日期格式",
          type: "select",
          default: "YYYY-MM-DD HH:mm:ss",
          options: [
            { label: "YYYY-MM-DD HH:mm:ss", value: "YYYY-MM-DD HH:mm:ss" },
            { label: "YYYY/MM/DD HH:mm:ss", value: "YYYY/MM/DD HH:mm:ss" },
            { label: "YYYY-MM-DD HH:mm", value: "YYYY-MM-DD HH:mm" },
            { label: "HH:mm:ss", value: "HH:mm:ss" },
            { label: "HH:mm", value: "HH:mm" },
          ],
        },
        { field: "minDate", label: "最早日期", type: "date" },
        { field: "maxDate", label: "最晚日期", type: "date" },
      ],
    },
    {
      id: "time_ago",
      name: "相对时间",
      description: "生成相对于当前的时间",
      icon: "el-icon-time",
      generator: (config) => {
        const { unit = "day", min = 1, max = 30, format = "relative" } =
          config || {};

        // 生成随机数量的时间单位
        const amount = Math.floor(Math.random() * (max - min + 1)) + min;

        // 生成过去的时间
        const date = dayjs().subtract(amount, unit);

        // 根据格式返回
        if (format === "relative") {
          return date.fromNow();
        } else {
          return date.format(format);
        }
      },
      configurable: true,
      configSchema: [
        {
          field: "unit",
          label: "时间单位",
          type: "select",
          default: "day",
          options: [
            { label: "分钟", value: "minute" },
            { label: "小时", value: "hour" },
            { label: "天", value: "day" },
            { label: "周", value: "week" },
            { label: "月", value: "month" },
            { label: "年", value: "year" },
          ],
        },
        { field: "min", label: "最小值", type: "number", default: 1 },
        { field: "max", label: "最大值", type: "number", default: 30 },
        {
          field: "format",
          label: "输出格式",
          type: "select",
          default: "relative",
          options: [
            { label: "相对时间", value: "relative" },
            { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
            { label: "YYYY-MM-DD HH:mm:ss", value: "YYYY-MM-DD HH:mm:ss" },
          ],
        },
      ],
    },
  ],

  // 特殊格式
  [RULE_CATEGORIES.SPECIAL]: [
    {
      id: "email",
      name: "邮箱",
      description: "随机邮箱地址",
      icon: "el-icon-message",
      generator: () => {
        const domains = [
          "gmail.com",
          "163.com",
          "qq.com",
          "hotmail.com",
          "outlook.com",
        ];
        const names = ["user", "test", "admin", "demo", "example"];
        const numbers = Math.floor(Math.random() * 1000);
        return `${names[Math.floor(Math.random() * names.length)]}${numbers}@${
          domains[Math.floor(Math.random() * domains.length)]
        }`;
      },
      configurable: false,
    },
    {
      id: "phone",
      name: "手机号",
      description: "中国大陆手机号",
      icon: "el-icon-phone",
      generator: () => {
        const prefixes = [
          "130",
          "131",
          "132",
          "133",
          "134",
          "135",
          "136",
          "137",
          "138",
          "139",
          "150",
          "151",
          "152",
          "153",
          "155",
          "156",
          "157",
          "158",
          "159",
          "180",
          "181",
          "182",
          "183",
          "184",
          "185",
          "186",
          "187",
          "188",
          "189",
        ];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = Math.floor(Math.random() * 100000000)
          .toString()
          .padStart(8, "0");
        return prefix + suffix;
      },
      configurable: false,
    },
    {
      id: "id_card",
      name: "身份证号",
      description: "18位身份证号码",
      icon: "el-icon-postcard",
      generator: () => {
        // 简化的身份证号生成（仅用于测试）
        const areaCode = "110101"; // 北京市东城区
        const birthDate = "19900101"; // 固定生日
        const sequence = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0");
        const base = areaCode + birthDate + sequence;

        // 计算校验码
        const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        const checkCodes = [
          "1",
          "0",
          "X",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2",
        ];

        let sum = 0;
        for (let i = 0; i < 17; i++) {
          sum += parseInt(base[i]) * weights[i];
        }

        return base + checkCodes[sum % 11];
      },
      configurable: false,
    },
    {
      id: "custom_regex",
      name: "自定义正则",
      description: "基于正则表达式生成",
      icon: "el-icon-edit",
      generator: (config) => {
        const { pattern = "\\d{4}" } = config || {};
        // 这里需要一个正则表达式生成器库，暂时简化处理
        if (pattern === "\\d{4}")
          return Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0");
        if (pattern === "[A-Z]{3}") return "ABC"; // 简化示例
        return "REGEX_" + Math.random().toString(36).substr(2, 5);
      },
      configurable: true,
      configSchema: [
        {
          field: "pattern",
          label: "正则表达式",
          type: "input",
          default: "\\d{4}",
          placeholder: "例如: \\d{4}",
        },
        {
          field: "description",
          label: "规则描述",
          type: "input",
          placeholder: "描述这个规则的用途",
        },
      ],
    },
  ],
};

/**
 * 获取所有规则
 */
export function getAllRules() {
  const allRules = [];
  Object.keys(RULE_LIBRARY).forEach((category) => {
    allRules.push(
      ...RULE_LIBRARY[category].map((rule) => ({
        ...rule,
        category,
      }))
    );
  });
  return allRules;
}

/**
 * 根据ID获取规则
 */
export function getRuleById(id) {
  const allRules = getAllRules();
  return allRules.find((rule) => rule.id === id);
}

/**
 * 根据类别获取规则
 */
export function getRulesByCategory(category) {
  return RULE_LIBRARY[category] || [];
}

/**
 * 执行规则生成数据
 */
export function executeRule(ruleId, config = {}) {
  const rule = getRuleById(ruleId);
  if (!rule) {
    throw new Error(`Rule not found: ${ruleId}`);
  }

  return rule.generator(config);
}
