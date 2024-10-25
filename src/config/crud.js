export default () => ({
  normal: {
    size: "small",
    local: true,
    refreshAfterOperation: true, // 操作后刷新表格
    editOpacity: true, // 是否开启编辑透明主题
    allColumn: {}, // 所有列配置统一设置的属性
    calcHeight: 0,
    gap: 20,
    addForm: {},
    editForm: {},
    viewForm: {
      viewType: "form", // 查看表单使用哪种组件展示 form | table
    },
    formOptions: {}, //表单配置
    dialog: {}, //弹窗配置
    permission: {
      // rowEdit: "111",
    },
    props: {
      pageNum: "pageNum",
      pageSize: "pageSize",
      detailResult: "data", // 详情数据
      listResult: "data", // 列表数据
      total: "total", // 列表条数
    },
    uniqueId: false,
    valueKey: "id",

    // 控制显隐
    toolbar: true,
    searchForm: true,
    searchHeader: true,
    pagination: true,
    successTip: false,
  },
  // 通过 true | false 控制显隐，为true时会转为对象，携带默认参数，类型为 boolean / object的配置
  showConfig: {
    //搜索表单配置
    searchForm: {
      initShow: false, // 初始是否折叠搜索表单
    },
    // 搜索头配置
    searchHeader: {
      width: 236,
    },
    rowEdit: {},
    cellEdit: {},
    selection: {
      width: 50,
      align: "center",
    },
    index: {
      label: "序号",
      width: 50,
      align: "center",
    },
    expand: {
      width: 50,
      align: "center",
    },
    handleRow: {
      handles: [],
    },
    toolbar: {
      batchEdit: false,
      batchSave: false,
      batchCancel: false,
      zoom: true,
      search: true,
      refresh: true,
      reset: true,
      column: true,
      handles: [],
    },
    action: {
      prop: "action",
      width: "auto",
      label: "操作",
      align: "center",
      calcWidth: 20,
      defaultMinWidth: 50,
      // widthIconGap: 5,
      // widthBtnGap: 10,
      handles: [],
    },
    pagination: {
      align: "right",
      pageSizes: [10, 20, 30, 50, 100, 200],
      layout: "total, sizes, prev, pager, next, jumper",
      background: true,
      pagerCount: 5,
    },
    contextMenu: {
      quickEdit: true,
      actionBtn: true,
      handles: [],
    },
    // 列宽度自动计算规则
    calcColumnWidth: {
      widthType: "first", //计算类型
      widthFont: "12px Arial", //字体大小、类型
      calcWidth: 20, //内容边距
    },
    empty: {
      image: "",
      size: 100,
      text: "暂无数据",
    },
  },
});
