import { renderItem, buttonItem, presetButtonType } from "./common";
import { isPlainObject, merge } from "lodash-es";

const tableColumnKeys = [
  "type",
  "className",
  "labelClassName",
  "width",
  "minWidth",
  "renderHeader",
  "sortable",
  "sortMethod",
  "sortBy",
  "resizable",
  "align",
  "headerAlign",
  "showOverflowTooltip",
  "fixed",
  "formatter",
  "selectable",
  "reserveSelection",
  "filterMethod",
  "filteredValue",
  "filters",
  "filterPlacement",
  "filterMultiple",
  "index",
  "sortOrders",
];

const tableKeys = [
  "key",
  "data",
  "size",
  "width",
  "height",
  "maxHeight",
  "fit",
  "stripe",
  "border",
  "rowKey",
  "context",
  "showHeader",
  "showSummary",
  "sumText",
  "summaryMethod",
  "rowClassName",
  "rowStyle",
  "cellClassName",
  "cellStyle",
  "headerRowClassName",
  "headerRowStyle",
  "headerCellClassName",
  "headerCellStyle",
  "highlightCurrentRow",
  "currentRowKey",
  "emptyText",
  "expandRowKeys",
  "defaultExpandAll",
  "defaultSort",
  "tooltipEffect",
  "spanMethod",
  "selectOnIndeterminate",
  "indent",
  "treeProps",
  "lazy",
  "load",
];
export default {
  ignoreKeys: tableKeys,
  // 配置结构
  schema: {
    // 表格标题
    title: String,
    // 表格尺寸
    size: {
      type: String,
      default: "small",
    },
    persistPageSize: Boolean, // 是否持久化拖动宽度
    persistWidth: Boolean, // 是否持久化拖动宽度
    delayRender: Boolean, // 是否启用延迟渲染
    delayRenderConfig: {
      // 延迟渲染配置
      type: [Boolean, Object],
      default: () => ({
        batchSize: 16,
        maxProcessTime: 16,
        frameDelay: 2,
        strategy: "cell",
      }),
      properties: {
        batchSize: Number, // 每批处理的元素数量，数值越大渲染越快，但可能导致卡顿
        maxProcessTime: Number, // 每帧最大处理时间（ms），防止单帧处理时间过长
        frameDelay: Number, // 批次间的帧间隔，数值越大越平滑，但渲染完成时间越长
      },
    }, // 是否启用延迟渲染
    virtualized: Boolean, // 是否启用虚拟列表
    itemSize: {
      // 延迟渲染、虚拟列表的固定行高
      type: Number,
      default: 40,
    },
    summaryData: Array, // 外部传入的统计数据
    // 是否禁用
    disabled: Boolean,
    // 是否开启初始化
    init: Boolean,
    // 是否开启表格底部追加行新增按钮
    footerAddBtn: Boolean,
    // 是否开启新增按钮
    addBtn: Boolean,
    // 是否开启删除按钮
    deleteBtn: Boolean,
    // 是否开启编辑按钮
    editBtn: Boolean,
    // 是否开启查看按钮
    viewBtn: Boolean,
    // 是否开启行新增按钮
    rowAddBtn: Boolean,
    // 行新增类型，first: 第一行，last: 最后一行
    rowAddType: {
      type: String,
      enum: ["first", "last"],
    },
    editConfig: {
      type: Object,
      strict: true,
      default: () => ({}),
      properties: {
        mode: {
          // 编辑模式
          type: String,
          enum: ["free", "cell", "row", "dialog"],
        },
        trigger: {
          // 触发方式
          type: String,
          enum: ["manual", "click", "dblclick"],
          default: "manual",
        },
        edit: buttonItem, // 编辑按钮配置
        batch: merge(buttonItem, {
          // 批量操作按钮配置，仅限`row`模式
          properties: {
            isSelect: Boolean,
          },
        }),
        add: merge(buttonItem, {
          // 新增按钮配置
          properties: {
            addType: {
              type: String,
              enum: ["first", "last"],
            },
          },
        }),
        lastAdd: merge(buttonItem, {
          // 底部新增行按钮配置
          properties: {
            addType: {
              type: String,
              enum: ["first", "last"],
            },
          },
        }),
        addChild: buttonItem, // 子级新增按钮配置
        batchDelete: buttonItem, // 批量删除按钮配置
        delete: buttonItem, // 删除按钮配置
        view: buttonItem, // 查看按钮配置，仅限`dialog`模式
        isRowEdit: Function, // 控制行是否可编辑
        autofocus: {
          // 是否自动聚焦，支持字符串(prop)
          type: [Boolean, String],
          default: true,
        },
        exclusive: Boolean, // 行编辑是否互斥(同时只能编辑一行)
      },
    },
    // 是否开启批量删除按钮
    batchDeleteBtn: Boolean,
    // 是否开启自由编辑
    freeEdit: Boolean,
    // 是否开启行编辑
    rowEdit: [Boolean, Object],
    // 是否开启单元格编辑
    cellEdit: [Boolean, Object],
    // 是否开启批量编辑
    batchEdit: [Boolean, Object],
    // 是否开启批量行编辑
    batchRowEdit: [Boolean, Object],
    // 控制行编辑状态
    isRowEdit: Function,
    // 操作后刷新表格
    refreshAfterOperation: {
      type: Boolean,
      default: true,
    },
    // 是否开启编辑主题
    editTheme: {
      type: Boolean,
      default: true,
    },
    // 校验信息是否提示
    validateMsg: Boolean,
    // 所有列配置统一设置的属性
    allColumn: Object,
    // 表格高度
    height: String,
    // 自动计算高度减去的偏差值
    calcHeight: {
      type: Number,
      default: 0,
    },
    // 表格外间距
    gap: {
      type: [Number, String],
      default: 20,
    },
    // 排序字段
    sortProps: Array,
    // 自定义排序方法
    sortMethod: Function,
    // 加载中文字
    loadingText: String,
    // 加载中图标
    loadingSpinner: String,
    // 加载中背景
    loadingBackground: String,
    // 是否禁用加载状态
    disableLoading: Boolean,
    // 是否开启本地分页
    localPagination: Boolean,
    // 是否开启本地搜索
    localSearch: Boolean,
    // 搜索弹窗是否打开
    showPopper: Boolean,
    // 搜索表单初始化是否展开
    expandSearch: Boolean,
    // 新增表单配置
    addForm: {
      type: Object,
      default: () => ({}),
    },
    // 编辑表单配置
    editForm: {
      type: Object,
      default: () => ({}),
    },
    // 查看表单配置
    viewForm: {
      type: Object,
      default: () => ({
        viewType: "form",
      }),
    },
    // 表单配置
    formOptions: {
      type: Object,
      default: () => ({}),
    },
    // 弹窗配置
    dialog: {
      type: Object,
      default: () => ({}),
    },
    // 权限配置
    permission: {
      type: Object,
      default: () => ({}),
    },
    // 属性配置
    props: {
      type: Object,
      default: () => ({
        pageNum: "pageNum",
        pageSize: "pageSize",
      }),
    },
    // 是否本地生成唯一标识
    uniqueId: {
      type: Boolean,
      default: false,
    },
    // 唯一值的Key
    valueKey: {
      type: String,
      default: "id",
    },
    // 搜索表单配置
    searchForm: {
      type: [Boolean, Object],
      default: () => ({
        initShow: false,
      }),
      properties: {
        show: Boolean,
        initShow: Boolean,
      },
    },
    // 搜索表头配置
    searchHeader: {
      type: [Boolean, Object],
      default: () => ({
        show: true,
        resetBtn: true,
      }),
      properties: {
        width: [Number, String], // popover宽度
        searchBtn: Boolean, // 是否开启搜索按钮
        resetBtn: Boolean, // 是否开启重置按钮
      },
    },
    singleSelection: {
      type: [Boolean, Object],
      default: () => ({
        width: 50,
        align: "center",
        clear: true,
        ctrlSelect: true,
      }),
    },
    // 选择列配置
    selection: {
      type: [Boolean, Object],
      default: () => ({
        width: 50,
        align: "center",
        maxDisplay: 3,
        clear: true,
        shiftSelect: true,
        ctrlSelect: true,
      }),
    },
    // 序号列配置
    index: {
      type: [Boolean, Object],
      default: () => ({
        label: "序号",
        width: 50,
        align: "center",
      }),
    },
    // 展开列配置
    expand: {
      type: [Boolean, Object],
      default: () => ({
        width: 50,
        align: "center",
      }),
    },
    // 分页配置
    pagination: {
      type: [Boolean, Object],
      default: () => ({
        align: "right",
        pageSizes: [10, 20, 30, 50, 100, 200],
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        pagerCount: 5,
        memorizeScroll: true, // 临时保存分页滚动位置
      }),
    },
    // 空状态配置
    empty: {
      type: [Boolean, Object],
      default: () => ({
        image: "",
        size: 100,
        text: "暂无数据",
      }),
      properties: {
        show: Boolean,
        hidden: Boolean,
        image: String,
        size: Number,
        text: String,
      },
    },
    // 行操作配置
    handleRow: {
      type: [Boolean, Object],
      properties: {
        show: Boolean,
        hidden: Boolean,
        add: presetButtonType,
        rowAdd: presetButtonType,
        batchDelete: presetButtonType,
        handles: {
          type: Array,
          arrayOf: buttonItem,
        },
      },
    },
    // 工具栏配置
    toolbar: {
      type: [Boolean, Object],
      strict: true,
      properties: {
        show: Boolean,
        hidden: Boolean,
        zoom: presetButtonType,
        search: presetButtonType,
        refresh: presetButtonType,
        reset: presetButtonType,
        column: presetButtonType,
        excelImport: presetButtonType,
        excelExport: presetButtonType,
        handles: {
          type: Array,
          arrayOf: buttonItem,
        },
      },
    },
    // 操作列配置
    action: {
      type: [Boolean, Object],
      strict: true,
      properties: {
        show: Boolean,
        hidden: Boolean,
        type: String, //废弃
        prop: String,
        width: [String, Number],
        label: String,
        align: String,
        calcWidth: Number,
        defaultWidth: Number,
        sameRowSpan: [String, Boolean],
        spanProp: [String, Boolean],
        fixed: [String, Boolean],
        handles: {
          type: Array,
          default: () => [],
          arrayOf: buttonItem,
        },
        delete: presetButtonType,
        view: presetButtonType,
        edit: presetButtonType,
        rowEdit: presetButtonType,
        rowSave: presetButtonType,
        rowCancel: presetButtonType,
      },
      default: () => ({
        prop: "action",
        width: "auto",
        label: "操作",
        align: "center",
        calcWidth: 20,
        defaultWidth: 50,
        handles: [],
      }),
    },
    // 右键菜单配置
    contextMenu: {
      type: [Boolean, Object],
      strict: true,
      properties: {
        show: Boolean,
        hidden: Boolean,
        actionBtn: Boolean,
        copy: presetButtonType,
        mock: presetButtonType,
        clearMock: presetButtonType,
        reset: presetButtonType,
        handles: {
          type: Array,
          default: () => [],
          arrayOf: buttonItem,
        },
      },
      default: () => ({
        copy: true,
        mock: true,
        clearMock: true,
        reset: true,
        actionBtn: true,
        handles: [],
      }),
    },
    // 渲染列配置
    renderColumns: {
      type: Array,
      required: true,
      default: () => [],
      arrayOf: {
        type: Object,
        properties: {
          ...renderItem,
          hiddenList: Boolean, // 是否只隐藏列表
          children: Array, // 嵌套列子列
          sameRowSpan: [String, Boolean], // 是否合并单元格
          spanProp: [String, Boolean], // 是否合并单元格
          spanMethod: Function, // 合并单元格方法
          isEdit: [Boolean, Function], // 是否允许编辑
          summary: {
            // 是否开启汇总
            type: Object,
            strict: true,
            properties: {
              type: String,
              enum: ["sum", "avg", "count", "max", "min", "custom"],
              path: String, // 汇总字段
              prefix: String, // 前缀
              suffix: String, // 后缀
              decimals: Number, // 小数位数
              ignoreZero: Boolean, // 忽略0值
              absolute: Boolean, // 取绝对值
              predicate: Function, // 条件
              method: Function, // 自定义方法
            },
          },
          add: {
            // 新增配置
            type: [Object, Boolean],
            properties: renderItem,
          },
          edit: {
            // 编辑配置
            type: [Object, Boolean],
            properties: renderItem,
          },
          view: {
            // 查看配置
            type: [Object, Boolean],
            properties: renderItem,
          },
          form: {
            // 通用表单配置
            type: [Object, Boolean],
            properties: renderItem,
          },
          search: {
            // 搜索配置
            type: [Object, Boolean],
            properties: renderItem,
          },
          searchHeader: {
            // 搜索表头配置
            type: [Object, Boolean],
            properties: renderItem,
          },
        },
        ignoreKeys: tableColumnKeys,
      },
    },
  },
  // 配置转换函数
  transforms: [
    (source, key, value) => {
      const showKeys = [
        "searchHeader",
        "singleSelection",
        "selection",
        "index",
        "expand",
        "empty",
        "handleRow",
        "toolbar",
        "action",
        "contextMenu",
      ];
      if (showKeys.includes(key)) {
        // 传入布尔值时，直接设置show
        if (typeof value === "boolean") {
          source[key] = {
            show: value,
          };
        } else if (
          // 传入对象时，默认show为true
          isPlainObject(value) &&
          value.show === undefined &&
          value.hidden === undefined
        ) {
          source[key] = {
            show: true,
            ...value,
          };
        }
      }
    },
    (source, key, value) => {
      const buttonKeys = ["handleRow", "toolbar", "action", "contextMenu"];
      if (buttonKeys.includes(key) && Array.isArray(value)) {
        source[key] = {
          show: true,
          handles: value,
        };
      }
    },
  ],
};
