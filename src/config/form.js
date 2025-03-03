import { renderItem, buttonItem, presetButtonType } from "./common";
import { isPlainObject } from "lodash-es";

const gridSchema = {
  columns: {
    // 布局列数
    type: Number,
    default: 1,
  },
  autoFill: [Boolean, String], // 是否自动填充
  fillCell: Boolean, // 是否填充满单元格
  minColumns: Number, // 最小列数
  maxColumns: Number, // 最大列数
  columnWidth: [String, Number], // 列宽
  minColumnWidth: [String, Number], // 最小列宽
  maxColumnWidth: [String, Number], // 最大列宽
  gap: {}, // 间距
  columnGap: {}, // 列间距
  rowGap: {}, // 行间距
  areas: {}, // 区域
  minRowHeight: [String, Number], // 最小行高
  maxRowHeight: [String, Number], // 最大行高
  alignContent: {}, // 对齐方式
  rows: {}, // 行
  justifyContent: {}, // 水平对齐
  flow: {}, // 布局流向
  height: { default: "auto" }, // 高度
  gridStyle: {
    // 自定义grid样式
    type: Object,
    default: () => ({}),
  },
};

const ignoreKeys = [
  "model",
  "rules",
  "labelPosition",
  "labelWidth",
  "labelSuffix",
  "inline",
  "inlineMessage",
  "statusIcon",
  "showMessage",
  "size",
  "disabled",
  "validateOnRuleChange",
  "hideRequiredAsterisk",

  "slots",
  "mode",
  "defaultRender",
  "initShow",
];

export default {
  ignoreKeys: ignoreKeys,
  schema: {
    ...gridSchema,
    title: String,
    size: {
      type: String,
      default: "small",
    },
    // 是否开启详情模式
    detail: Boolean,
    // 是否开启边框模式
    border: Boolean,
    // 是否分组
    group: Boolean,
    // 标签宽度
    labelWidth: {
      type: String,
      default: "100px",
    },
    // 标签位置
    labelPosition: {
      type: String,
      default: "right",
    },
    // 布局类型
    layout: {
      type: String,
      default: "grid",
    },
    // 是否收缩标签
    shrinkLabel: {
      type: Boolean,
      default: true,
    },
    // 是否滚动至错误信息
    scrollError: {
      type: Boolean,
      default: true,
    },
    // 是否隐藏标签
    hiddenLabel: Boolean,
    // 标签超出一行是否隐藏并显示隐藏内容
    labelOverTip: Boolean,
    // 右键菜单配置
    contextMenu: {
      type: [Boolean, Object],
      strict: true,
      properties: {
        show: Boolean,
        hidden: Boolean,
        mock: presetButtonType,
        copy: presetButtonType,
        reset: presetButtonType,
        paste: presetButtonType,
        saveDraft: presetButtonType,
        loadDraft: presetButtonType,
        draft: presetButtonType,
        handles: {
          type: Array,
          default: () => [],
          arrayOf: buttonItem,
        },
      },
      default: () => ({
        copy: true,
        mock: true,
        reset: true,
        paste: true,
        saveDraft: true,
        loadDraft: true,
        draft: true,
        handles: [],
      }),
    },
    // 操作按钮配置
    action: {
      type: Object,
      properties: {
        show: Boolean,
        hidden: Boolean,
        submit: presetButtonType,
        reset: presetButtonType,
        handles: {
          type: Array,
          default: () => [],
          arrayOf: buttonItem,
        },
      },
      default: () => ({
        align: "center",
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
          tooltip: String, // tooltip内容
          tooltipRender: Function, // tooltip渲染
          labelRender: Function, // 标签渲染
          widthSize: [Number, String], // 跨列数
          heightSize: [Number, String], // 跨行数
          labelOverTip: Boolean, // 标签超出一行是否隐藏并显示隐藏内容
          hiddenLabel: Boolean, // 是否隐藏标签
          deepProp: String, // 深度绑定属性
          formatData: {
            // 数据格式化
            type: [String, Object],
            properties: {
              type: String,
              formatValue: Boolean, // 是否获取格式化值
              input: Function, // 输入格式化
              output: Function, // 输出格式化
            },
          },
          children: Array,
          ...renderItem,
          detail: {
            // 详情配置
            type: [Boolean, Object],
            properties: renderItem,
          },
        },
      },
    },
  },
  transforms: [
    (source, key, value) => {
      const showKeys = ["action", "contextMenu"];
      if (showKeys.includes(key)) {
        if (typeof value === "boolean") {
          source[key] = {
            show: value,
          };
        } else if (
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
      const buttonKeys = ["action", "contextMenu"];
      if (Array.isArray(value) && buttonKeys.includes(key)) {
        source[key] = {
          handles: value,
        };
      }
    },
  ],
};
