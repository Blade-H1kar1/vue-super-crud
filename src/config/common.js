export const renderItem = {
  show: Boolean,
  hidden: Boolean, // 是否隐藏
  prop: String, // 绑定字段
  label: String, // 列标题
  presetType: {
    // 预设类型
    type: String,
  },
  dict: [String, Object], // 字典配置
  comp: {
    type: [Object, Function],
    properties: {
      name: [String, Object], // 组件名称或组件对象
      on: Object, // 事件
      bind: [Object, Function], // 属性
    },
  },
  formatter: Function, // 格式化函数
  html: Boolean, // 是否开启HTML渲染
  render: Function, // 渲染函数
  required: [Boolean, Object], // 是否必填
  rules: {
    type: [Array, Function],
    arrayOf: {
      strict: true,
      type: [Object, String],
      properties: {
        validator: Function,
        message: String,
        trigger: String,
      },
    },
  }, // 验证规则
  position: Boolean, // 是否开启位置渲染
};

export const buttonItem = {
  type: [Object, String],
  strict: true,
  properties: {
    label: [String, Function],
    type: {
      type: String,
      enum: ["primary", "success", "warning", "danger", "info", "text"],
    },
    icon: [String, Function],
    disabled: [Boolean, Function],
    onClick: Function,
    size: {
      type: String,
      enum: ["medium", "small", "mini"],
    },
    loading: [Boolean, Function],
    plain: [Boolean, Function],
    round: [Boolean, Function],
    circle: [Boolean, Function],
    children: [Array, Function],
    hidden: [Boolean, Function],
    show: [Boolean, Function],
    hasPermi: Array,
    confirm: String, // 操作确认
    successBack: Function, // 操作成功回调
  },
};

export const presetButtonType = [Object, Boolean];
