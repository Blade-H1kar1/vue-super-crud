/**
 * 查找并触发表单元素的聚焦
 * @param {HTMLElement} dom - 要搜索的DOM元素
 * @returns {Boolean} - 是否成功触发了聚焦
 */
export function focusFormElement(dom, isSelect = false) {
  if (!dom) return false;

  // 处理需要点击的组件
  const clickSelectors = [
    ".el-cascader .el-cascader__label, .el-cascader .el-input__inner",
    ".el-select .el-input__inner",
    ".el-date-editor.el-input__inner",
    ".el-time-picker.el-input__inner",
    ".el-color-picker .el-color-picker__trigger",
  ].join(",");

  const clickElement = dom.querySelector(clickSelectors);
  if (clickElement) {
    clickElement.click();
    return true;
  }

  // 处理需要focus的组件
  const focusElement = dom.querySelector(
    ".el-rate .el-rate__item:not(.is-disabled)"
  );
  if (focusElement) {
    focusElement.focus();
    return true;
  }

  // 处理基础表单元素
  const basicInput = dom.querySelector(`
    input:not([type="hidden"]):not([readonly]):not([disabled]),
    textarea:not([readonly]):not([disabled]),
    [tabindex]:not([tabindex="-1"]):not([disabled])
  `);

  if (basicInput) {
    basicInput.focus();
    const shouldSelect =
      isSelect &&
      basicInput.tagName.toLowerCase() === "input" &&
      ["text", "number", "password", "search", "email", "tel", "url"].includes(
        basicInput.type
      );

    if (shouldSelect) {
      basicInput.select();
    }
    return true;
  }

  return false;
}
