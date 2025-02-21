const renderColumns = [
  // 输入框类型
  {
    label: "用户名",
    prop: "username",
  },
  {
    label: "描述",
    prop: "description",
    comp: {
      type: "textarea",
      rows: 3,
    },
  },

  // 数字输入框
  {
    label: "年龄",
    prop: "age",
    comp: {
      name: "el-input-number",
      min: 0,
      max: 100,
    },
  },

  // 选择器
  {
    label: "状态",
    prop: "status1111",
    comp: {
      name: "el-select",
      options: [
        { label: "启用", value: 1 },
        { label: "禁用", value: 0 },
      ],
    },
  },

  // 日期选择器
  {
    label: "出生日期",
    prop: "birthday",
    comp: {
      name: "el-date-picker",
      type: "date",
      valueFormat: "yyyy-MM-dd",
    },
  },
  {
    label: "时间范围",
    prop: "timeRange",
    comp: {
      name: "el-date-picker",
      type: "datetimerange",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
    },
  },

  // 时间选择器
  {
    label: "上班时间",
    prop: "workTime",
    comp: {
      name: "el-time-picker",
      isRange: false,
      valueFormat: "HH:mm:ss",
    },
  },

  // 单选框
  {
    label: "性别",
    prop: "gender",
    comp: {
      name: "el-radio-group",
      options: [
        { label: "男", value: 1 },
        { label: "女", value: 2 },
      ],
    },
  },

  // 多选框
  {
    label: "爱好",
    prop: "hobbies",
    comp: {
      name: "el-checkbox-group",
      options: [
        { label: "阅读", value: "reading" },
        { label: "运动", value: "sports" },
        { label: "音乐", value: "music" },
      ],
    },
  },

  // 开关
  {
    label: "是否启用",
    prop: "enabled111",
    comp: {
      name: "el-switch",
      activeValue: true,
      inactiveValue: false,
    },
  },

  // 滑块
  {
    label: "进度",
    prop: "progress",
    comp: {
      name: "el-slider",
      min: 0,
      max: 100,
      step: 10,
    },
  },

  // 评分
  {
    label: "评分",
    prop: "rate",
    comp: {
      name: "el-rate",
      max: 5,
      allowHalf: true,
    },
  },

  // 级联选择器
  {
    label: "地区",
    prop: "area",
    comp: {
      name: "el-cascader",
      props: { checkStrictly: true, multiple: true },
      options: [
        {
          value: "zhejiang",
          label: "浙江",
          children: [
            {
              value: "hangzhou",
              label: "杭州",
            },
            {
              value: "ningbo",
              label: "宁波",
            },
          ],
        },
        {
          value: "jiangsu",
          label: "江苏",
          children: [
            {
              value: "nanjing",
              label: "南京",
              children: [
                {
                  value: "nanjing",
                  label: "南京",
                },
                {
                  value: "suzhou",
                  label: "苏州",
                },
              ],
            },
            {
              value: "suzhou",
              label: "苏州",
            },
          ],
        },
      ],
    },
  },

  // 穿梭框
  {
    label: "权限",
    prop: "permissions",
    comp: {
      name: "el-transfer",
      data: [
        { key: 1, label: "查看" },
        { key: 2, label: "编辑" },
        { key: 3, label: "删除" },
      ],
    },
  },
];
