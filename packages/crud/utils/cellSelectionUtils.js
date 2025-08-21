/**
 * 单元格选择相关的工具函数
 */

// 解析单元格键值
export function parseCellKey(cellKey) {
  const [rowIndex, columnIndex] = cellKey.split("-").map(Number);
  return { rowIndex, columnIndex };
}

// 生成单元格键值
export function createCellKey(rowIndex, columnIndex) {
  return `${rowIndex}-${columnIndex}`;
}

// 检查是否为表单元素
export function isFormElement(element) {
  return element.matches(
    'input, textarea, select, button, [contenteditable="true"]'
  );
}

// 获取单元格文本内容
export function getCellText(element) {
  if (!element) return "";

  // 优先处理 Element UI 组件
  const input = element.querySelector(".el-input__inner");
  if (input) return input.value || "";

  const textarea = element.querySelector(".el-textarea__inner");
  if (textarea) return textarea.value || "";

  const selectInput = element.querySelector(".el-select .el-input__inner");
  if (selectInput) return selectInput.value || "";

  // 回退到纯文本内容
  return element.textContent?.trim() || "";
}

// 通过class名称获取列索引
export function getColumnIndexByClass(cellElement, tableEl) {
  if (!cellElement || !tableEl) return -1;

  // 从单元格class中提取列标识符
  const classList = Array.from(cellElement.classList);
  const columnClass = classList.find((cls) =>
    cls.match(/^el-table_\d+_column_\d+$/)
  );

  if (!columnClass) {
    // 回退到DOM位置索引
    const tr = cellElement.parentElement;
    return Array.from(tr.children).indexOf(cellElement);
  }

  // 在表头中查找对应的列索引
  const thead = tableEl.querySelector(".el-table__header thead");
  if (thead) {
    const headerRow = thead.querySelector("tr");
    if (headerRow) {
      const headerCells = Array.from(headerRow.children);
      const columnIndex = headerCells.findIndex((cell) =>
        cell.classList.contains(columnClass)
      );
      if (columnIndex !== -1) return columnIndex;
    }
  }

  return -1;
}

// 获取单元格DOM元素
export function getCellElement(tableEl, rowIndex, columnIndex) {
  if (!tableEl) return null;

  const tbody = tableEl.querySelector(".el-table__body tbody");
  if (!tbody) return null;

  const tr = tbody.children[rowIndex];
  if (!tr) return null;

  // 首先尝试通过class名称查找单元格（兼容合并单元格）
  const thead = tableEl.querySelector(".el-table__header thead");
  if (thead) {
    const headerRow = thead.querySelector("tr");
    if (headerRow && headerRow.children[columnIndex]) {
      const headerCell = headerRow.children[columnIndex];
      const columnClass = Array.from(headerCell.classList).find((cls) =>
        cls.match(/^el-table_\d+_column_\d+$/)
      );

      if (columnClass) {
        const cellWithClass = tr.querySelector(`.${columnClass}`);
        if (cellWithClass) return cellWithClass;
      }
    }
  }

  // 回退到索引方法
  return tr.children[columnIndex];
}

/**
 * 计算选中区域的边界
 * @param {Array} selectedCells - 选中的单元格键值数组
 * @param {Element} tableEl - 表格DOM元素
 * @returns {object|null} 边界信息 {left, top, width, height}
 */
export function calculateSelectionBounds(selectedCells, tableEl) {
  if (selectedCells.length === 0 || !tableEl) return null;

  const tableBodyWrapper = tableEl.querySelector(".el-table__body-wrapper");
  if (!tableBodyWrapper) return null;

  const wrapperRect = tableBodyWrapper.getBoundingClientRect();
  let minLeft = Infinity;
  let minTop = Infinity;
  let maxRight = -Infinity;
  let maxBottom = -Infinity;

  // 遍历所有选中的单元格，计算边界
  selectedCells.forEach((cellKey) => {
    const { rowIndex, columnIndex } = parseCellKey(cellKey);
    const cell = getCellElement(tableEl, rowIndex, columnIndex);
    if (cell) {
      const cellRect = cell.getBoundingClientRect();
      const relativeLeft = cellRect.left - wrapperRect.left;
      const relativeTop = cellRect.top - wrapperRect.top;
      const relativeRight = relativeLeft + cellRect.width;
      const relativeBottom = relativeTop + cellRect.height;

      minLeft = Math.min(minLeft, relativeLeft);
      minTop = Math.min(minTop, relativeTop);
      maxRight = Math.max(maxRight, relativeRight);
      maxBottom = Math.max(maxBottom, relativeBottom);
    }
  });

  if (minLeft === Infinity) return null;

  return {
    left: minLeft,
    top: minTop,
    width: maxRight - minLeft,
    height: maxBottom - minTop,
  };
}

/**
 * 复制文本到剪贴板（回退方案）
 * @param {string} text - 要复制的文本
 * @returns {boolean} 是否成功
 */
export function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    document.body.removeChild(textArea);
    return false;
  }
}

/**
 * 根据鼠标位置计算边界单元格
 * @param {MouseEvent} event - 鼠标事件
 * @param {Element} tableEl - 表格DOM元素
 * @returns {object|null} 边界单元格信息
 */
export function getBoundaryCellFromMousePosition(event, tableEl) {
  if (!tableEl) return null;

  const tableRect = tableEl.getBoundingClientRect();
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const tbody = tableEl.querySelector(".el-table__body tbody");
  if (!tbody) return null;

  const rows = tbody.querySelectorAll("tr");
  if (rows.length === 0) return null;

  // 计算目标行索引
  let targetRowIndex;
  if (mouseY < tableRect.top) {
    targetRowIndex = 0;
  } else if (mouseY > tableRect.bottom) {
    targetRowIndex = rows.length - 1;
  } else {
    targetRowIndex = 0;
    const thead = tableEl.querySelector(".el-table__header");
    let accumulatedHeight = tableRect.top;
    if (thead) {
      accumulatedHeight += thead.getBoundingClientRect().height;
    }

    for (let i = 0; i < rows.length; i++) {
      const rowRect = rows[i].getBoundingClientRect();
      if (mouseY <= rowRect.bottom) {
        targetRowIndex = i;
        break;
      }
      targetRowIndex = i;
    }
    targetRowIndex = Math.max(0, Math.min(targetRowIndex, rows.length - 1));
  }

  // 获取目标行的所有单元格
  const targetRow = rows[targetRowIndex];
  const cells = targetRow.querySelectorAll("td");
  if (cells.length === 0) return null;

  // 计算目标列索引
  let targetColumnIndex;
  if (mouseX < tableRect.left) {
    targetColumnIndex = 0;
  } else if (mouseX > tableRect.right) {
    targetColumnIndex = cells.length - 1;
  } else {
    let accumulatedWidth = tableRect.left;
    targetColumnIndex = 0;
    for (let i = 0; i < cells.length; i++) {
      const cellRect = cells[i].getBoundingClientRect();
      accumulatedWidth += cellRect.width;
      if (mouseX <= accumulatedWidth) {
        targetColumnIndex = i;
        break;
      }
      targetColumnIndex = i;
    }
  }

  const targetCell = cells[targetColumnIndex];
  const accurateColumnIndex = getColumnIndexByClass(targetCell, tableEl);

  return {
    rowIndex: targetRowIndex,
    columnIndex:
      accurateColumnIndex !== -1 ? accurateColumnIndex : targetColumnIndex,
    element: targetCell,
    cellText: getCellText(targetCell),
  };
}
