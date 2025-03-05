import resolveTemp from "src/template";
import {
  merge,
  isEmpty,
  get,
  isPlainObject,
  isFunction,
  isArray,
  cloneDeep,
} from "lodash-es";

// swapMerge 是否交换合并顺序
export function mergeTemp(
  prefix,
  key,
  item,
  scope,
  templates = {},
  swapMerge = false
) {
  if (key) {
    let mergeItem;
    delete item.presetType;
    if (typeof key === "string") {
      templates = Object.assign(templates, get(resolveTemp, prefix));
      mergeItem = templates && templates[key];
      if (mergeItem) {
        if (isFunction(mergeItem)) {
          mergeItem = mergeItem(item, scope);
        } else {
          mergeItem = cloneDeep(mergeItem);
        }
        const raw = cloneDeep(mergeItem);
        mergeItem.key = typeof key === "string" ? key : "";
        item = swapMerge ? merge(item, mergeItem) : merge(mergeItem, item);
        if (item.raw) {
          item.raw = merge(item.raw, raw);
        } else {
          item.raw = raw;
        }
        if (item.presetType) {
          item = mergeTemp(prefix, item.presetType, item, scope, templates, swapMerge);
        }
      }
    } else {
      mergeItem = key;
    }
  }
  if (Array.isArray(item.children) && item.children.length) {
    item.children = batchMerge(prefix, item.children, scope, templates, swapMerge);
  }
  return item;
}

export function batchMerge(prefix, item, scope, templates, swapMerge) {
  const items = [];
  if (isPlainObject(item)) {
    Object.keys(item).forEach((key) => {
      if (key === "handles") {
        items.push(...batchMerge(prefix, item[key], scope, templates));
      } else if (isPlainObject(item[key]) || item[key] === true) {
        if (item[key] === true) item[key] = {};
        const mergeItem = mergeTemp(prefix, key, item[key], scope, templates, swapMerge);
        if (!isEmpty(mergeItem)) items.push(mergeItem);
      }
    });
  }
  if (isArray(item)) {
    item.forEach((i) => {
      if (isPlainObject(i)) {
        const mergeItem = mergeTemp(prefix, i.presetType, i, scope, templates, swapMerge);
        if (!isEmpty(mergeItem)) items.push(mergeItem);
      } else if (typeof i === "string") {
        const mergeItem = mergeTemp(prefix, i, {}, scope, templates, swapMerge);
        if (!isEmpty(mergeItem)) items.push(mergeItem);
        else items.push(i);
      } else {
        if (!isEmpty(i)) items.push(i);
      }
    });
  }
  return items.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function singleMerge(prefix, key, item) {
  if (typeof key === "string") {
    let temp = get(resolveTemp, prefix);
    temp = temp && temp[key];
    if (temp) {
      if (isFunction(temp)) {
        temp = temp(item);
      }
      return temp;
    }
  }
  return key;
}
