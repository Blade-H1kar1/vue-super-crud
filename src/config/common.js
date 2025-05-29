export const renderItem = {
  show: [Boolean, Function],
  hidden: [Boolean, Function], // 是否隐藏
  prop: String, // 绑定字段
  label: String, // 列标题
  presetType: {
    // 预设类型
    type: String,
  },
  dict: {
    strict: true,
    type: [String, Object, Function],
    properties: {
      request: Function,
      label: String, // 数据字典中label字段的属性名
      value: String, // 数据字典中value字段的属性名
      color: String, // 数据字典中color字段的属性名
      children: String, // 数据字典中children字段的属性名
      params: [Object, Function], // 请求参数，支持函数形式监听响应式数据变化
      immediate: Boolean, // 是否立即加载，默认为懒加载，即使用时才加载
      cache: Boolean, // 是否启用缓存
      dataPath: String, // 字典数组的路径
      transform: Function, // 数据转换函数
      otherPath: [String, Array], // 需要额外获取的数据路径
      debounceTime: Number, // 防抖时间（毫秒）
      enhanceDict: Object, // 自定义增强方法
      local: Boolean, // 是否启用局部字典
    },
  }, // 字典配置
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
  required: [Boolean, Object, Function], // 是否必填
  rules: {
    type: [Array, Function],
    arrayOf: {
      strict: true,
      type: [Object, String],
      properties: {
        validator: Function,
        message: String,
        trigger: String,
        regular: RegExp,
        msg: String,
      },
    },
  }, // 验证规则
  position: Boolean, // 是否开启位置渲染
  formatData: [Object, String], // 响应式数据格式化
};

export const buttonItem = {
  type: [Object, String, Boolean],
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
    confirm: [String, Function], // 操作确认
    successBack: Function, // 操作成功回调
  },
};

export const presetButtonType = [Object, Boolean];
