import { isDom, isVNode, isComponent } from "./getType";
import { debounce, isFunction, omit } from "lodash-es";
import toTreeArray from "xe-utils/toTreeArray";
import findTree from "xe-utils/findTree";
import { mergeTemp, batchMerge, singleMerge } from "./mergeTemp";

export {
  isDom,
  isVNode,
  isComponent,
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

export function getSlotByNames(slots, names = [], scope) {
  if (!Array.isArray(names)) names = [names];
  let slotName = `${names[0]}`;
  names.shift();
  names.forEach((s) => {
    s && (slotName += `-${s}`);
  });
  if (slots[slotName]) {
    return slots[slotName](scope);
  } else {
    return false;
  }
}

export function getSlot(slots, names, scope) {
  if (!Array.isArray(names)) names = [names];
  while (names.length > 0) {
    let slotName = names.shift();
    if (slots[slotName]) {
      return slots[slotName](scope);
    }
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
