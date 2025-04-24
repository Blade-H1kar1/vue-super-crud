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

/**
 * 查找树形数据中指定节点的路径
 * @param {Array} tree - 树形数据
 * @param {Function} predicate - 判断条件函数
 * @param {string} childrenKey - 子节点的键名，默认为 'children'
 * @param {string} parentPath - 父节点路径（递归用）
 * @returns {string|null} - 返回找到的路径或 null
 */
export function findTreeNodePath(
  tree,
  predicate,
  childrenKey = "children",
  parentPath = ""
) {
  if (!Array.isArray(tree)) return null;

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    const currentPath = parentPath ? `${parentPath}.${i}` : `${i}`;

    // 判断当前节点是否符合条件
    if (predicate(node)) {
      return currentPath;
    }

    // 如果有子节点，递归查找
    if (node[childrenKey] && Array.isArray(node[childrenKey])) {
      const childPath = findTreeNodePath(
        node[childrenKey],
        predicate,
        childrenKey,
        `${currentPath}.${childrenKey}`
      );
      if (childPath) {
        return childPath;
      }
    }
  }

  return null;
}
