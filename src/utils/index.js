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
      if (item.hidden !== undefined) {
        if (typeof item.hidden === "function") {
          return !item.hidden(scope);
        } else {
          return !item.hidden;
        }
      }
      // innerHide内部专用，不被外部hidden影响
      if (item.innerHide !== undefined) {
        if (typeof item.innerHide === "function") {
          return !item.innerHide(scope);
        } else {
          return !item.innerHide;
        }
      }
      if (item.show !== undefined) {
        if (typeof item.show === "function") {
          return item.show(scope);
        } else {
          return item.show;
        }
      }
      return true;
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
    if (item[prop] === undefined) return;
    const value =
      typeof item[prop] === "function" ? item[prop](scope) : item[prop];
    return invert ? !value : value;
  };
  const isShow =
    checkVisibility("innerHide", true) ||
    checkVisibility("hidden", true) ||
    checkVisibility("show");
  if (isShow !== undefined) return isShow;
  return defaultShow;
}
