import { isDom, isVNode, isComponent, getObjectType } from "./getType";
import { debounce, isFunction, omit } from "lodash-es";
import toTreeArray from "xe-utils/toTreeArray";
import findTree from "xe-utils/findTree";
import { mergeTemp, batchMerge, singleMerge } from "./mergeTemp";

export {
  isDom,
  isVNode,
  isComponent,
  getObjectType,
  toTreeArray,
  findTree,
  mergeTemp,
  batchMerge,
  singleMerge,
};

/**
 * 判断是否为空
 */
export function isEmptyData(val) {
  if (
    val instanceof Date ||
    typeof val === "boolean" ||
    typeof val === "number"
  )
    return false;
  if (val instanceof Array) {
    if (val.length === 0) return true;
    return val.every((item) => isEmptyData(item));
  } else if (val instanceof Object) {
    for (var o in val) {
      return false;
    }
    return true;
  } else {
    if (
      val === "null" ||
      val == null ||
      val === "undefined" ||
      val === undefined ||
      val === ""
    ) {
      return true;
    }
    return false;
  }
  return false;
}

export function flatLastChildren(array) {
  let result = [];
  array.forEach((item) => {
    if (item.children && item.children.length > 0) {
      result.push(...flatLastChildren(item.children));
    } else {
      result.push(item);
    }
  });
  return result;
}

// 将cell-class-name转为驼峰
export function toCamelCase(str) {
  if (str.indexOf("-") < 0) {
    return str;
  } else {
    return str
      .split("-")
      .map((word, index) => {
        if (index === 0) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join("");
  }
}

export function executeFunctionByObject(obj = {}, param, omitKeys) {
  Object.keys(omitKeys ? omit(obj, omitKeys) : obj).forEach((key) => {
    if (isFunction(obj[key])) {
      obj[key] = obj[key](param);
    }
  });
  return obj;
}

export function executeFunction(func, param) {
  if (!func) return false;
  if (isFunction(func)) return func(param);
  return func;
}

export function filterColumns(columns, scope) {
  if (!Array.isArray(columns)) return columns;
  return columns
    .map((item) => {
      if (item.children) {
        item.children = filterColumns(item.children, scope);
      }
      return item;
    })
    .filter((item) => {
      return checkVisibility(item, scope, true);
    });
}

export const setPxSaveSource = (value) => {
  if (!value && value !== 0) return "0";
  // 如果是数字类型
  if (typeof value === "number") {
    return value === 0 ? "0" : `${value}px`;
  }
  // 如果已经是px结尾
  if (typeof value === "string" && value.endsWith("px")) {
    return value;
  }
  // 判断是否为纯数字字符串
  if (typeof value === "string" && /^\d+$/.test(value)) {
    return `${value}px`;
  }
  // 其他情况直接返回原值
  return value;
};

export const setPx = (value) => {
  if (!value && value !== 0) return "0";
  if (typeof value === "string" && value.endsWith("px")) {
    return value;
  }
  const num = parseFloat(value);
  return num === 0 ? "0" : `${num}px`;
};

export const isPx = (value) => {
  if (typeof value === "string" && value.endsWith("px")) {
    return true;
  }
  if (typeof value === "number") {
    return true;
  }
  return false;
};

export function checkVisibility(item, scope, defaultShow) {
  const checkVisibility = (prop, invert = false) => {
    const value =
      typeof item[prop] === "function" ? item[prop](scope) : item[prop];
    return invert ? !value : value;
  };
  const result = [];
  if (item.hidden !== undefined) result.push(checkVisibility("hidden", true));
  if (item.innerHide !== undefined)
    result.push(checkVisibility("innerHide", true));
  if (item.show !== undefined) result.push(checkVisibility("show"));
  return result.length > 0 ? result.every((item) => item) : defaultShow;
}

export function resolveRender(render, h, scope) {
  if (!render) return null;
  const VNode = isFunction(render)
    ? render.length === 2
      ? render(h, scope)
      : render(scope)
    : render;
  if (VNode) {
    return isVNode(VNode) ? VNode : <span>{VNode}</span>;
  }
}

export function filterButtons(
  buttons,
  options = {},
  scope = null,
  position = ""
) {
  if (!Array.isArray(buttons)) return [];

  return buttons
    .map((button) => {
      // 检查显示/隐藏条件
      if (!checkVisibility(button, scope, true)) return null;

      // 检查权限
      const permission =
        button.per ||
        button.hasPermi ||
        (button.key && options.permission?.[button.key]);

      if (
        permission &&
        options.checkPermission &&
        !options.checkPermission(permission)
      ) {
        return null;
      }

      // 处理子按钮
      if (button.children?.length) {
        const children = filterButtons(
          button.children,
          options,
          scope,
          position
        );
        if (children.length === 0) return null;
        button = { ...button, children };
      }

      // 应用自定义控制
      return options.controlButton?.(position, button, scope) || button;
    })
    .filter(Boolean);
}
