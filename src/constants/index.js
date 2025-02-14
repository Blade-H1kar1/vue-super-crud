// 常见日期格式
export const DATE_PATTERNS = [
  // 完整日期时间格式
  {
    format: "YYYY-MM-DD HH:mm:ss",
    regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
  },
  {
    format: "YYYY-MM-DD HH:mm",
    regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
  },
  {
    format: "YYYY/MM/DD HH:mm:ss",
    regex: /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/,
  },
  {
    format: "YYYY/MM/DD HH:mm",
    regex: /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/,
  },

  // 日期格式
  {
    format: "YYYY-MM-DD",
    regex: /^\d{4}-\d{2}-\d{2}$/,
  },
  {
    format: "YYYY/MM/DD",
    regex: /^\d{4}\/\d{2}\/\d{2}$/,
  },
  {
    format: "YYYY年MM月DD日",
    regex: /^\d{4}年\d{2}月\d{2}日$/,
  },

  // 时间格式
  {
    format: "HH:mm:ss",
    regex: /^\d{2}:\d{2}:\d{2}$/,
  },
  {
    format: "HH:mm",
    regex: /^\d{2}:\d{2}$/,
  },

  // 月日格式
  {
    format: "MM-DD",
    regex: /^\d{2}-\d{2}$/,
  },
  {
    format: "MM/DD",
    regex: /^\d{2}\/\d{2}$/,
  },
  {
    format: "MM月DD日",
    regex: /^\d{2}月\d{2}日$/,
  },

  // 年月格式
  {
    format: "YYYY-MM",
    regex: /^\d{4}-\d{2}$/,
  },
  {
    format: "YYYY/MM",
    regex: /^\d{4}\/\d{2}$/,
  },
  {
    format: "YYYY年MM月",
    regex: /^\d{4}年\d{2}月$/,
  },
];
