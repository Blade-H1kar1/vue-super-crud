import {
  set,
  get,
  isPlainObject,
  cloneDeep,
  merge,
  omit,
  pick,
} from "lodash-es";
import { mergeTemp } from "utils/mergeTemp";
import { toCamelCase } from "utils";
import formProps from "../props";

// 表单初始化队列
export const formInitQueue = {
  promise: Promise.resolve(),
  isProcessing: false,

  add(callback) {
    this.isProcessing = true;
    const currentPromise = this.promise.then(async () => {
      try {
        await callback();
      } catch (error) {
        console.error("Form init error:", error);
      } finally {
        if (this.promise === currentPromise) {
          this.isProcessing = false;
        }
      }
    });
    this.promise = currentPromise;
    return currentPromise;
  },
};

// 获取表单组件的初始值
export function getInitValue(col) {
  if (col.initValue !== undefined) {
    return col.initValue;
  }
  if (isArrayValueComponent(col)) {
    return [];
  }
  return "";
}

// 判断组件是否需要数组类型的值
export function isArrayValueComponent(col) {
  const comp = col.comp || {};
  const compName = comp.name;

  if (["el-checkbox-group", "sc-checkbox"].includes(compName)) {
    return true;
  }
  if ((compName === "el-select" || compName === "sc-select") && comp.multiple) {
    return true;
  }
  if (compName === "el-cascader") {
    return comp.emitPath !== false;
  }
  if (comp.options && comp.multiple) {
    return true;
  }
  return false;
}

// 根据类型获取重置值
export function getResetValueByType(value, column = {}) {
  if (isArrayValueComponent(column)) {
    return [];
  }
  if (value === null || value === undefined) {
    return "";
  }
  if (Array.isArray(value)) {
    return [];
  }
  if (typeof value === "object") {
    return {};
  }
  if (typeof value === "number") {
    return 0;
  }
  if (typeof value === "boolean") {
    return false;
  }
  return "";
}

// 扩展选项配置
export function extendsOption(item, current, extendsObj) {
  if (current === false) return;
  current = isPlainObject(current) ? current : {};
  current = mergeTemp("render", current.presetType, current);
  extendsObj = cloneDeep(extendsObj);
  if (current.hidden !== true) {
    return merge(
      {
        label: item.label,
        prop: item.prop,
        ...extendsObj,
      },
      current
    );
  }
}

// 根据分组配置对列进行分组
export function groupBy(column, group) {
  if (group && Array.isArray(group)) {
    return group.map((item) => {
      return {
        label: item.label,
        children: item.children.map((i) => {
          return column.find((c) => c.prop === i);
        }),
      };
    });
  }
  return column;
}

// 计算第一行最后一个单元格的索引
export function getFirstRowLastCellIndex(columns = [], columnsNumber = 1) {
  let widthSize = 0;
  const lastIndex = columns.findIndex((item, idx) => {
    widthSize += item.widthSize || 1;
    return widthSize === columnsNumber;
  });
  return lastIndex === -1 ? columns.length - 1 : lastIndex;
}

// 计算空单元格数量
export function calcEmptyCount(trueRenderColumns, getGridColumnCount) {
  const total = trueRenderColumns.length;
  const col = getGridColumnCount();
  const remain = total % col;
  if (remain === col - 1 || col === 1) return 0;
  return remain === 0 ? col - 1 : col - remain - 1;
}

// 转换表单属性为驼峰格式并筛选
export function getFormProps(formOptions) {
  const obj = {};
  Object.keys(formOptions).forEach((key) => {
    obj[toCamelCase(key)] = formOptions[key];
  });
  return pick(obj, formProps);
}

// 滚动到第一个验证错误的字段
export function scrollToFirstError(errorObj, refs) {
  const key = Object.keys(errorObj)[0];
  const itemRef = refs[key] && refs[key][0].$refs.formItem;
  if (Object.keys(errorObj).length && itemRef) {
    itemRef.$el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

// 属性路径操作工具
export const propUtils = {
  get: (obj, prop) => get(obj, prop),
  set: (obj, prop, value) => set(obj, prop, value),
};
