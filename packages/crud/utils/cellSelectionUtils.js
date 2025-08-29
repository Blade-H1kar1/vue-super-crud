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

// 获取单元格文本内容
export function getCellText(element) {
  if (!element) return "";

  // 处理 el-select 多选
  const selectTags = element.querySelector(".el-select__tags");
  if (selectTags) {
    const tagTexts = selectTags.querySelectorAll(".el-select__tags-text");
    if (tagTexts.length > 0) {
      const texts = [];
      for (let i = 0; i < tagTexts.length; i++) {
        const text = tagTexts[i].textContent?.trim();
        if (text) texts.push(text);
      }
      return texts.join(",");
    }
    return selectTags.textContent?.trim() || "";
  }

  // 处理 el-switch
  const switchElement = element.querySelector(".el-switch");
  if (switchElement) {
    return switchElement.classList.contains("is-checked") ? "是" : "否";
  }

  // 处理 el-radio
  const checkedRadio = element.querySelector(".el-radio.is-checked");
  if (checkedRadio) {
    const label = checkedRadio.querySelector(".el-radio__label");
    if (label) {
      const text = label.textContent?.trim();
      if (text) return text;
    }
  }

  // 处理 el-checkbox
  const checkedCheckboxes = element.querySelectorAll(".el-checkbox.is-checked");
  if (checkedCheckboxes.length > 0) {
    const checkedTexts = [];
    for (let i = 0; i < checkedCheckboxes.length; i++) {
      const label = checkedCheckboxes[i].querySelector(".el-checkbox__label");
      if (label) {
        const text = label.textContent?.trim();
        if (text) checkedTexts.push(text);
      }
    }
    if (checkedTexts.length > 0) {
      return checkedTexts.join(", ");
    }
  }

  // 获取输入组件的值
  const inputs = element.querySelectorAll("input, textarea");
  if (inputs.length > 0) {
    const inputValues = [];
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value) {
        inputValues.push(inputs[i].value);
      }
    }
    if (inputValues.length > 0) {
      return inputValues.join(" ");
    }
  }

  // 处理 el-cascader
  const cascader = element.querySelector(".el-cascader");
  if (cascader) return;

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

// 区域边界结果缓存
const boundsCache = new WeakMap();

/**
 * 计算选中区域的边界
 * @param {Array} selectedCells - 选中的单元格键值数组
 * @param {Element} tableEl - 表格DOM元素
 * @returns {object|null} 边界信息 {left, top, width, height}
 */
export function calculateSelectionBounds(selectedCells, tableEl) {
  if (selectedCells.length === 0 || !tableEl) return null;

  // 简单缓存检查
  const cacheKey = selectedCells.slice().sort().join(",");
  let tableCache = boundsCache.get(tableEl);
  if (!tableCache) {
    tableCache = new Map();
    boundsCache.set(tableEl, tableCache);
  }

  const cachedResult = tableCache.get(cacheKey);
  const now = Date.now();
  if (cachedResult && now - cachedResult.timestamp < 100) {
    return cachedResult.bounds;
  }

  const tableBodyWrapper = tableEl.querySelector(".el-table__body-wrapper");
  if (!tableBodyWrapper) return null;

  const wrapperRect = tableBodyWrapper.getBoundingClientRect();
  // 获取滚动偏移量
  const scrollLeft = tableBodyWrapper.scrollLeft;
  const scrollTop = tableBodyWrapper.scrollTop;

  let minLeft = Infinity;
  let minTop = Infinity;
  let maxRight = -Infinity;
  let maxBottom = -Infinity;

  // 遍历所有选中的单元格，计算边界
  for (const cellKey of selectedCells) {
    const { rowIndex, columnIndex } = parseCellKey(cellKey);
    const cellElement = getCellElement(tableEl, rowIndex, columnIndex);

    if (cellElement) {
      const cellRect = cellElement.getBoundingClientRect();
      // 计算相对于容器的位置，考虑滚动偏移量
      const left = cellRect.left - wrapperRect.left + scrollLeft;
      const top = cellRect.top - wrapperRect.top + scrollTop;
      const right = left + cellRect.width;
      const bottom = top + cellRect.height;

      minLeft = Math.min(minLeft, left);
      minTop = Math.min(minTop, top);
      maxRight = Math.max(maxRight, right);
      maxBottom = Math.max(maxBottom, bottom);
    }
  }

  if (minLeft === Infinity) return null;

  const bounds = {
    left: minLeft,
    top: minTop,
    width: maxRight - minLeft,
    height: maxBottom - minTop,
  };

  // 缓存结果（保留少量缓存）
  tableCache.set(cacheKey, {
    bounds,
    timestamp: now,
  });

  // 限制缓存大小
  if (tableCache.size > 20) {
    const oldestKey = tableCache.keys().next().value;
    tableCache.delete(oldestKey);
  }

  return bounds;
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
