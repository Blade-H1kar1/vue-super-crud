export function isDom(obj) {
  return typeof HTMLElement === "object"
    ? (function () {
        return obj instanceof HTMLElement;
      })()
    : (function () {
        return (
          obj &&
          typeof obj === "object" &&
          obj.nodeType === 1 &&
          typeof obj.nodeName === "string"
        );
      })();
}
export function isVNode(element) {
  return (
    element &&
    typeof element === "object" &&
    "componentOptions" in element &&
    "context" in element &&
    element.tag !== undefined
  );
}
export function isComponent(options) {
  return (
    options &&
    (typeof options.template === "string" ||
      typeof options.render === "function")
  );
}
export function getObjectType(obj) {
  let type = Object.prototype.toString.call(obj).match(/\s([a-zA-Z]+)/)[1];
  return type;
}
