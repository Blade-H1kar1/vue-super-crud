import { createCellInfo, getCellElement } from "./utils";

/**
 * 通用选择引擎 - 处理所有类型的单元格选择逻辑
 * @param {Object} options 选择配置
 * @param {HTMLElement} tableEl 表格DOM元素
 * @param {Array} selectedCells 当前选中的单元格数组
 * @param {number} rowCount 表格行数
 * @param {number} columnCount 表格列数
 * @returns {Array} 新选中的单元格数组
 */
export function selectCells(
  options = {},
  tableEl,
  selectedCells = [],
  rowCount = 0,
  columnCount = 0
) {
  const {
    type = "cell", // 'cell', 'range', 'row', 'column', 'all'
    rowIndex = null,
    columnIndex = null,
    startCell = null,
    endCell = null,
    rowIndices = [],
    columnIndices = [],
  } = options;
  // 创建新的选中单元格数组
  let newSelectedCells = [...selectedCells];

  // 添加单个单元格到选择列表的辅助函数
  const addCellToSelection = (row, col) => {
    const cellInfo = createCellInfo(row, col);
    // 检查是否已存在相同的单元格
    const exists = newSelectedCells.some(
      (cell) => cell.rowIndex === row && cell.columnIndex === col
    );
    if (!exists) {
      newSelectedCells.push(cellInfo);
    }
  };

  switch (type) {
    case "cell":
      // 选中单个单元格
      if (rowIndex !== null && columnIndex !== null) {
        addCellToSelection(rowIndex, columnIndex);
      }
      break;

    case "range":
      // 选中单元格范围
      if (startCell && endCell) {
        const startRow = Math.min(startCell.rowIndex, endCell.rowIndex);
        const endRow = Math.max(startCell.rowIndex, endCell.rowIndex);
        const startCol = Math.min(startCell.columnIndex, endCell.columnIndex);
        const endCol = Math.max(startCell.columnIndex, endCell.columnIndex);

        for (let row = startRow; row <= endRow; row++) {
          for (let col = startCol; col <= endCol; col++) {
            const cellElement = getCellElement(tableEl, row, col);
            if (cellElement) {
              addCellToSelection(row, col);
            }
          }
        }
      }
      break;

    case "row":
      // 选中整行
      const targetRowIndices = rowIndices.length ? rowIndices : [rowIndex];
      if (columnCount > 0) {
        targetRowIndices.forEach((targetRowIndex) => {
          if (targetRowIndex !== null) {
            for (let col = 0; col < columnCount; col++) {
              const cellElement = getCellElement(tableEl, targetRowIndex, col);
              if (cellElement) {
                addCellToSelection(targetRowIndex, col);
              }
            }
          }
        });
      }
      break;

    case "column":
      // 选中整列
      const targetColumnIndices = columnIndices.length
        ? columnIndices
        : [columnIndex];
      if (rowCount > 0) {
        targetColumnIndices.forEach((targetColumnIndex) => {
          if (targetColumnIndex !== null) {
            for (let row = 0; row < rowCount; row++) {
              const cellElement = getCellElement(
                tableEl,
                row,
                targetColumnIndex
              );
              if (cellElement) {
                addCellToSelection(row, targetColumnIndex);
              }
            }
          }
        });
      }
      break;

    case "all":
      // 选中所有单元格
      if (rowCount > 0 && columnCount > 0) {
        for (let row = 0; row < rowCount; row++) {
          for (let col = 0; col < columnCount; col++) {
            const cellElement = getCellElement(tableEl, row, col);
            if (cellElement) {
              addCellToSelection(row, col);
            }
          }
        }
      }
      break;

    default:
      console.warn(`未知的选择类型: ${type}`);
  }

  return newSelectedCells;
}
