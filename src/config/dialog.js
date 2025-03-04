import { buttonItem, presetButtonType } from "./common";
export default {
  schema: {
    title: String,
    // 宽度
    width: {
      type: [Number, String],
      default: "",
    },
    // 尺寸
    size: {
      type: String,
      default: "small",
    },
    drag: {
      type: Boolean,
      default: true,
    },
    dragSize: {
      type: Boolean,
      default: true,
    },
    // 挂载后回调
    mounted: {
      type: Function,
      default: () => {},
    },
    // 确认回调
    confirm: {
      type: Function,
      default: () => {},
    },
    // 取消回调
    cancel: {
      type: Function,
      default: () => {},
    },
    // 关闭回调
    closed: {
      type: Function,
      default: () => {},
    },
    // 底部按钮配置
    footer: {
      type: Object,
      default: () => ({
        align: "right",
        confirm: {},
        cancel: {},
        handles: [],
      }),
      properties: {
        show: Boolean,
        hidden: Boolean,
        align: String, // 对齐方式
        confirm: presetButtonType, // 确认按钮配置
        cancel: presetButtonType, // 取消按钮配置
        handles: {
          type: Array,
          arrayOf: buttonItem,
        }, // 按钮配置
      },
    },
  },
  transforms: [
    (source, key, value) => {
      const showKeys = ["footer"];
      if (showKeys.includes(key)) {
        if (typeof value === "boolean") {
          source[key] = {
            show: value,
          };
        }
      }
    },
    (source, key, value) => {
      const buttonKeys = ["footer"];
      if (Array.isArray(value) && buttonKeys.includes(key)) {
        source[key] = {
          confirm: false,
          cancel: false,
          handles: value,
        };
      }
    },
  ],
};
