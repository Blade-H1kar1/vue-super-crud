/**
 * 单元格选择相关的工具函数
 */

// 根据 fixedType 获取对应的容器
const containerSelectors = {
  body: ".el-table__body-wrapper",
  left: ".el-table__fixed .el-table__fixed-body-wrapper",
  right: ".el-table__fixed-right .el-table__fixed-body-wrapper",
};
// 创建单元格信息对象
export function createCellInfo(rowIndex, columnIndex) {
  return { rowIndex, columnIndex };
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

// 通过单元格获取索引
export function getCellIndexFromElement(
  cellElement,
  tableEl,
  fixedType = "body"
) {
  if (!cellElement || !tableEl) return null;
  const cellMap = getCachedCellMap(tableEl, fixedType);
  if (!cellMap) return null;

  // 遍历映射表找到匹配的单元格元素
  for (const [key, element] of cellMap.entries()) {
    if (element === cellElement) {
      const [rowIndex, columnIndex] = key.split("-").map(Number);
      return { rowIndex, columnIndex };
    }
  }

  return null;
}

// 单元格映射表缓存
const cellMapCache = new WeakMap();
const CELL_MAP_CACHE_DURATION = 200; // 200ms缓存时间

function buildCellMap(tbody) {
  const cellMap = new Map();
  const rows = Array.from(tbody.children);

  rows.forEach((tr, rowIndex) => {
    let columnIndex = 0;
    Array.from(tr.children).forEach((cell) => {
      const colspan = parseInt(cell.getAttribute("colspan") || "1");
      const rowspan = parseInt(cell.getAttribute("rowspan") || "1");

      // 跳过已被占用的位置
      while (cellMap.has(`${rowIndex}-${columnIndex}`)) {
        columnIndex++;
      }

      // 标记所有被此单元格占用的位置
      for (let r = rowIndex; r < rowIndex + rowspan; r++) {
        for (let c = columnIndex; c < columnIndex + colspan; c++) {
          cellMap.set(`${r}-${c}`, cell);
        }
      }

      columnIndex += colspan;
    });
  });

  return cellMap;
}

/**
 * 获取缓存的单元格映射表
 * @param {Element} tableEl - 表格DOM元素
 * @param {string} fixedType - 固定列类型
 * @returns {Map} 单元格映射表
 */
function getCachedCellMap(tableEl, fixedType) {
  const now = Date.now();
  const cacheKey = `${fixedType}`;
  const cached = cellMapCache.get(tableEl);

  if (
    cached &&
    cached[cacheKey] &&
    now - cached[cacheKey].timestamp < CELL_MAP_CACHE_DURATION
  ) {
    return cached[cacheKey].cellMap;
  }

  const tbody = tableEl
    .querySelector(containerSelectors[fixedType])
    .querySelector("tbody");

  if (!tbody) return null;

  const cellMap = buildCellMap(tbody);

  // 更新缓存
  const tableCache = cached || {};
  tableCache[cacheKey] = {
    cellMap,
    timestamp: now,
  };
  cellMapCache.set(tableEl, tableCache);

  return cellMap;
}

// 获取单元格DOM元素
export function getCellElement(
  tableEl,
  rowIndex,
  columnIndex,
  fixedType = "body"
) {
  if (!tableEl) return null;

  // 使用缓存的映射表
  const cellMap = getCachedCellMap(tableEl, fixedType);
  if (!cellMap) return null;

  return cellMap.get(`${rowIndex}-${columnIndex}`) || null;
}

// getBoundingClientRect 缓存
const rectCache = new WeakMap();
const RECT_CACHE_DURATION = 200; // 100ms缓存时间

/**
 * 获取缓存的 getBoundingClientRect 结果
 * @param {Element} element - DOM元素
 * @returns {DOMRect} 边界矩形信息
 */
function getCachedBoundingClientRect(element) {
  if (!element) return null;

  const now = Date.now();
  const cached = rectCache.get(element);

  if (cached && now - cached.timestamp < RECT_CACHE_DURATION) {
    return cached.rect;
  }

  const rect = element.getBoundingClientRect();
  rectCache.set(element, {
    rect,
    timestamp: now,
  });

  return rect;
}

/**
 * 计算选中区域的边界
 * @param {Array} selectedCells - 选中的单元格对象数组 [{rowIndex, columnIndex}]
 * @param {Element} tableEl - 表格DOM元素
 * @param {string} fixedType - 固定列类型 'body'(默认) | 'left' | 'right'
 * @returns {object|null} 边界信息 {left, top, width, height}
 */
export function calculateSelectionBounds(
  selectedCells,
  tableEl,
  fixedType = "body"
) {
  if (selectedCells.length === 0 || !tableEl) return null;

  const tableBodyWrapper = tableEl.querySelector(containerSelectors[fixedType]);
  if (!tableBodyWrapper) return null;

  const wrapperRect = getCachedBoundingClientRect(tableBodyWrapper);

  // 根据容器类型决定是否需要滚动偏移量
  let scrollLeft = tableBodyWrapper.scrollLeft;
  let scrollTop = tableBodyWrapper.scrollTop;

  // 找出边界单元格的行列索引
  let minRowIndex = Infinity;
  let maxRowIndex = -Infinity;
  let minColumnIndex = Infinity;
  let maxColumnIndex = -Infinity;

  // 只遍历一次找出边界索引
  for (const cellInfo of selectedCells) {
    const { rowIndex, columnIndex } = cellInfo;
    minRowIndex = Math.min(minRowIndex, rowIndex);
    maxRowIndex = Math.max(maxRowIndex, rowIndex);
    minColumnIndex = Math.min(minColumnIndex, columnIndex);
    maxColumnIndex = Math.max(maxColumnIndex, columnIndex);
  }

  // 获取四个边界单元格的位置信息，传递 fixedType 参数
  const topLeftCell = getCellElement(
    tableEl,
    minRowIndex,
    minColumnIndex,
    fixedType
  );
  const topRightCell = getCellElement(
    tableEl,
    minRowIndex,
    maxColumnIndex,
    fixedType
  );
  let bottomLeftCell = getCellElement(
    tableEl,
    maxRowIndex,
    minColumnIndex,
    fixedType
  );
  let bottomRightCell = getCellElement(
    tableEl,
    maxRowIndex,
    maxColumnIndex,
    fixedType
  );

  // 如果底部单元格不可见，一直向上查找直到找到可见的单元格
  let searchRowIndex = maxRowIndex;
  while (
    (!bottomLeftCell || bottomLeftCell.offsetParent === null) &&
    searchRowIndex > minRowIndex
  ) {
    searchRowIndex--;
    bottomLeftCell = getCellElement(
      tableEl,
      searchRowIndex,
      minColumnIndex,
      fixedType
    );
  }

  searchRowIndex = maxRowIndex;
  while (
    (!bottomRightCell || bottomRightCell.offsetParent === null) &&
    searchRowIndex > minRowIndex
  ) {
    searchRowIndex--;
    bottomRightCell = getCellElement(
      tableEl,
      searchRowIndex,
      maxColumnIndex,
      fixedType
    );
  }

  if (!topLeftCell || !bottomRightCell) return null;

  // 计算边界位置
  const topLeftRect = getCachedBoundingClientRect(topLeftCell);
  const bottomRightRect = getCachedBoundingClientRect(bottomRightCell);

  // 计算相对于容器的边界位置
  let leftBound = topLeftRect.left - wrapperRect.left + scrollLeft;
  let topBound = topLeftRect.top - wrapperRect.top + scrollTop;
  let rightBound = bottomRightRect.right - wrapperRect.left + scrollLeft;
  let bottomBound = bottomRightRect.bottom - wrapperRect.top + scrollTop;

  // 如果有不同的边界单元格，需要检查它们
  if (topRightCell && topRightCell !== topLeftCell) {
    const topRightRect = getCachedBoundingClientRect(topRightCell);
    rightBound = Math.max(
      rightBound,
      topRightRect.right - wrapperRect.left + scrollLeft
    );
  }

  if (bottomLeftCell && bottomLeftCell !== topLeftCell) {
    const bottomLeftRect = getCachedBoundingClientRect(bottomLeftCell);
    bottomBound = Math.max(
      bottomBound,
      bottomLeftRect.bottom - wrapperRect.top + scrollTop
    );
  }

  const bounds = {
    left: leftBound,
    top: topBound,
    width: rightBound - leftBound,
    height: bottomBound - topBound,
  };

  return bounds;
}

/**
 * 获取可视区域内的元素列表
 * @param {NodeList} elements - 元素列表
 * @param {DOMRect} wrapperRect - 容器边界矩形
 * @param {string} direction - 方向 'vertical' | 'horizontal'
 * @param {boolean} useBinarySearch - 是否使用二分查找（默认根据元素数量自动判断）
 * @returns {Array} 可视元素数组
 */
function getVisibleElements(
  elements,
  wrapperRect,
  direction,
  useBinarySearch = null
) {
  if (elements.length === 0) return [];

  const viewStart =
    direction === "vertical" ? wrapperRect.top : wrapperRect.left;
  const viewEnd =
    direction === "vertical" ? wrapperRect.bottom : wrapperRect.right;

  if (useBinarySearch) {
    // 二分查找第一个可见元素
    let left = 0,
      right = elements.length - 1,
      firstIndex = elements.length;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const rect = getCachedBoundingClientRect(elements[mid]);
      const end = direction === "vertical" ? rect.bottom : rect.right;

      if (end > viewStart) {
        firstIndex = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // 二分查找最后一个可见元素
    left = 0;
    right = elements.length - 1;
    let lastIndex = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const rect = getCachedBoundingClientRect(elements[mid]);
      const start = direction === "vertical" ? rect.top : rect.left;

      if (start < viewEnd) {
        lastIndex = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // 收集可视元素
    const visibleElements = [];
    for (let i = firstIndex; i <= lastIndex && i < elements.length; i++) {
      const rect = getCachedBoundingClientRect(elements[i]);
      const start = direction === "vertical" ? rect.top : rect.left;
      const end = direction === "vertical" ? rect.bottom : rect.right;

      if (end > viewStart && start < viewEnd) {
        visibleElements.push({ index: i, rect });
      }
    }

    return visibleElements;
  } else {
    // 线性查找（适用于元素较少的情况）
    const visibleElements = [];
    for (let i = 0; i < elements.length; i++) {
      const rect = getCachedBoundingClientRect(elements[i]);
      const start = direction === "vertical" ? rect.top : rect.left;
      const end = direction === "vertical" ? rect.bottom : rect.right;

      if (end > viewStart && start < viewEnd) {
        visibleElements.push({ index: i, rect });
      }
    }

    return visibleElements;
  }
}

/**
 * 根据鼠标位置和可视元素计算目标索引
 * @param {number} mousePosition - 鼠标位置（clientX 或 clientY）
 * @param {number} wrapperStart - 容器起始位置（left 或 top）
 * @param {number} wrapperEnd - 容器结束位置（right 或 bottom）
 * @param {Array} visibleElements - 可视元素数组
 * @param {NodeList} allElements - 所有元素
 * @param {number} relativePosition - 相对位置
 * @param {string} direction - 方向 'vertical' | 'horizontal'
 * @returns {number} 目标索引
 */
function calculateTargetIndex(
  mousePosition,
  wrapperStart,
  wrapperEnd,
  visibleElements,
  allElements,
  relativePosition,
  direction
) {
  // 如果没有可见元素，返回0或null
  if (visibleElements.length === 0) {
    return direction === "horizontal" ? 0 : null;
  }

  // 鼠标在容器外部的处理
  if (mousePosition < wrapperStart) {
    return visibleElements[0].index;
  } else if (mousePosition > wrapperEnd) {
    return visibleElements[visibleElements.length - 1].index;
  }

  // 鼠标在容器内部，按位置查找
  let targetIndex = 0;
  let currentPosition = 0;

  for (let i = 0; i < allElements.length; i++) {
    const elementRect = getCachedBoundingClientRect(allElements[i]);
    const elementSize =
      direction === "vertical" ? elementRect.height : elementRect.width;

    if (relativePosition <= currentPosition + elementSize) {
      targetIndex = i;
      break;
    }
    currentPosition += elementSize;
    targetIndex = i;
  }

  return Math.max(0, Math.min(targetIndex, allElements.length - 1));
}

export function getCellInfoFromEvent(event, tableEl, containerType) {
  let target = event.target?.classList?.contains("el-table__cell")
    ? event.target
    : event?.target?.closest(".el-table__cell");

  if (!target) return null;
  const { rowIndex, columnIndex } = getCellIndexFromElement(
    target,
    tableEl,
    containerType
  );
  return {
    rowIndex,
    columnIndex,
    element: target,
  };
}

// 检查鼠标是否在表格内部
export function isInnerCell(event, tableEl) {
  if (!tableEl) return false;
  const isInner = tableEl.querySelector(".el-table").contains(event.target);
  const isEmpty =
    event.target.classList.contains("el-table__body-wrapper") ||
    event.target.classList.contains("el-table__fixed-body-wrapper");
  return isInner && !isEmpty;
}

/**
 * 根据鼠标位置计算边界单元格
 * @param {MouseEvent} event - 鼠标事件
 * @param {Element} tableEl - 表格DOM元素
 * @returns {object|null} 边界单元格信息
 */
export function getBoundaryCellFromMousePosition(event, tableEl) {
  if (!tableEl) return null;

  // 检测鼠标所在的容器
  const containerInfo = detectContainerFromMousePosition(event, tableEl);
  if (!containerInfo.container) return null;

  if (
    isInnerCell(event, tableEl) &&
    !tableEl.querySelector(".el-table__header-wrapper").contains(event.target)
  ) {
    return getCellInfoFromEvent(event, tableEl, containerInfo.type);
  }

  // 获取容器内的表格体
  const tbody = containerInfo.container.querySelector("tbody");
  if (!tbody) return null;

  const rows = tbody.querySelectorAll("tr");
  if (rows.length === 0) return null;

  // 计算相对坐标
  const { relativeMouseX, relativeMouseY } = calculateRelativePosition(
    event,
    containerInfo
  );

  // 获取容器边界信息
  const wrapperRect = getCachedBoundingClientRect(containerInfo.container);
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // 计算目标行索引
  const visibleRows = getVisibleElements(
    rows,
    wrapperRect,
    "vertical",
    rows.length > 100
  );
  const targetRowIndex = calculateTargetIndex(
    mouseY,
    wrapperRect.top,
    wrapperRect.bottom,
    visibleRows,
    rows,
    relativeMouseY,
    "vertical"
  );

  if (targetRowIndex === null) {
    return null;
  }

  // 获取目标行的所有单元格
  const targetRow = rows[targetRowIndex];
  const cells = targetRow.querySelectorAll("td");
  if (cells.length === 0) return null;

  // 计算目标列索引
  const visibleCells = getVisibleElements(
    cells,
    wrapperRect,
    "horizontal",
    false
  );
  const targetColumnIndex = calculateTargetIndex(
    mouseX,
    wrapperRect.left,
    wrapperRect.right,
    visibleCells,
    cells,
    relativeMouseX,
    "horizontal"
  );

  const targetCell = cells[targetColumnIndex];

  return {
    rowIndex: targetRowIndex,
    columnIndex: targetColumnIndex,
    element: targetCell,
    containerType: containerInfo.type,
  };
}

/**
 * 检测鼠标所在的容器类型
 * @param {MouseEvent} event - 鼠标事件
 * @param {Element} tableEl - 表格DOM元素
 * @returns {object|null} 容器信息 {container, type}
 */
function detectContainerFromMousePosition(event, tableEl) {
  const fixedLeft = tableEl.querySelector(".el-table__fixed");
  const fixedRight = tableEl.querySelector(".el-table__fixed-right");
  const bodyWrapper = tableEl.querySelector(".el-table__body-wrapper");

  const mouseX = event.clientX;

  // 检测左固定列
  if (fixedLeft) {
    const leftRect = getCachedBoundingClientRect(fixedLeft);
    if (mouseX >= leftRect.left && mouseX <= leftRect.right) {
      const fixedBodyWrapper = fixedLeft.querySelector(
        ".el-table__fixed-body-wrapper"
      );
      return { container: fixedBodyWrapper, type: "left" };
    }
  }

  // 检测右固定列
  if (fixedRight) {
    const rightRect = getCachedBoundingClientRect(fixedRight);
    if (mouseX >= rightRect.left && mouseX <= rightRect.right) {
      const fixedBodyWrapper = fixedRight.querySelector(
        ".el-table__fixed-body-wrapper"
      );
      return { container: fixedBodyWrapper, type: "right" };
    }
  }

  // 默认主表格容器
  return { container: bodyWrapper, type: "body" };
}

/**
 * 根据容器类型计算相对坐标
 * @param {MouseEvent} event - 鼠标事件
 * @param {object} containerInfo - 容器信息
 * @returns {object} 相对坐标 {relativeMouseX, relativeMouseY}
 */
function calculateRelativePosition(event, containerInfo) {
  const { container, type } = containerInfo;
  if (!container) return { relativeMouseX: 0, relativeMouseY: 0 };

  const containerRect = getCachedBoundingClientRect(container);

  let relativeMouseX, relativeMouseY;

  if (type === "body") {
    // 主表格需要考虑滚动偏移
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;
    relativeMouseX = event.clientX - containerRect.left + scrollLeft;
    relativeMouseY = event.clientY - containerRect.top + scrollTop;
  } else {
    // 固定列不需要滚动偏移
    relativeMouseX = event.clientX - containerRect.left;
    relativeMouseY = event.clientY - containerRect.top;
  }

  return { relativeMouseX, relativeMouseY };
}

// 获取表头文本
export function getHeaderText(tableEl, columnIndex) {
  if (!tableEl) return "";

  const headerRow = tableEl.querySelector(
    ".el-table__header-wrapper .el-table__header thead tr"
  );
  if (!headerRow) return "";

  const headerCells = headerRow.querySelectorAll("th");

  if (columnIndex >= 0 && columnIndex < headerCells.length) {
    const headerCell = headerCells[columnIndex];
    const cellContent = headerCell.querySelector(".content");
    return cellContent ? cellContent.textContent?.trim() || "" : "";
  }
  return "";
}

// 检测鼠标是否在表格边界附近
export function detectScrollDirection(event, tableWrapper) {
  const rect = getCachedBoundingClientRect(tableWrapper);
  const { clientX, clientY } = event;
  const edgeThreshold = 20;

  const scrollDirection = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  // 检测垂直方向
  // 鼠标在表格上方或在表格内但靠近上边界
  if (
    (clientY < rect.top || clientY < rect.top + edgeThreshold) &&
    tableWrapper.scrollTop > 0
  ) {
    scrollDirection.up = true;
  }
  // 鼠标在表格下方或在表格内但靠近下边界
  else if (
    (clientY > rect.bottom || clientY > rect.bottom - edgeThreshold) &&
    tableWrapper.scrollTop <
      tableWrapper.scrollHeight - tableWrapper.clientHeight
  ) {
    scrollDirection.down = true;
  }

  // 检测水平方向
  // 鼠标在表格左侧或在表格内但靠近左边界
  if (
    (clientX < rect.left || clientX < rect.left + edgeThreshold) &&
    tableWrapper.scrollLeft > 0
  ) {
    scrollDirection.left = true;
  }
  // 鼠标在表格右侧或在表格内但靠近右边界
  else if (
    (clientX > rect.right || clientX > rect.right - edgeThreshold) &&
    tableWrapper.scrollLeft <
      tableWrapper.scrollWidth - tableWrapper.clientWidth
  ) {
    scrollDirection.right = true;
  }

  // 如果有任何方向需要滚动，返回滚动方向
  if (
    scrollDirection.up ||
    scrollDirection.down ||
    scrollDirection.left ||
    scrollDirection.right
  ) {
    return scrollDirection;
  }

  return null;
}

// 获取单元格数组的边界值
export function getCellsBounds(cells) {
  if (!cells || cells.length === 0) {
    return {
      minRow: 0,
      maxRow: 0,
      minCol: 0,
      maxCol: 0,
    };
  }

  const minRow = Math.min(...cells.map((cell) => cell.rowIndex));
  const maxRow = Math.max(...cells.map((cell) => cell.rowIndex));
  const minCol = Math.min(...cells.map((cell) => cell.columnIndex));
  const maxCol = Math.max(...cells.map((cell) => cell.columnIndex));

  return {
    minRow,
    maxRow,
    minCol,
    maxCol,
  };
}

// 将行数据转换为二维数组
export function convertRowsToTableData(rows) {
  const rowIndices = Object.keys(rows)
    .map(Number)
    .sort((a, b) => a - b);

  const tableData = [];
  rowIndices.forEach((rowIndex) => {
    const row = rows[rowIndex];
    const colIndices = Object.keys(row)
      .map(Number)
      .sort((a, b) => a - b);
    const minCol = Math.min(...colIndices);
    const maxCol = Math.max(...colIndices);

    const rowData = [];
    for (let col = minCol; col <= maxCol; col++) {
      rowData.push(row[col] || "");
    }
    tableData.push(rowData);
  });

  const textData = tableData.map((row) => row.join("\t")).join("\n");
  return { tableData, textData };
}

// 获取表格列数
export function getColumnCount(tableEl) {
  if (!tableEl) return 0;
  return tableEl.querySelector(".el-table__header thead").querySelectorAll("th")
    .length;
}

// 读取剪贴板数据
export async function readClipboardData() {
  try {
    const clipboardItems = await navigator.clipboard.read();

    // 优先查找 JSON 数据
    for (const item of clipboardItems) {
      if (item.types.includes(applicationType)) {
        const jsonData = JSON.parse(
          await (await item.getType(applicationType)).text()
        );
        if (jsonData.type === "super-crud-data" && jsonData.data) {
          return { textData: jsonData.data.textData, isValueMode: true };
        }
      }
    }

    // 查找文本数据
    for (const item of clipboardItems) {
      if (item.types.includes("text/plain")) {
        const textData = await (await item.getType("text/plain")).text();
        return { textData, isValueMode: false };
      }
    }

    return { textData: "", isValueMode: false };
  } catch (error) {
    console.warn("读取多格式剪贴板数据失败，尝试文本模式:", error);
    const textData = await navigator.clipboard.readText();
    return { textData, isValueMode: false };
  }
}
