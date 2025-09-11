import { getCellElement } from "./utils.js";
import { debounce } from "lodash-es";

/**
 * 顶行单元格监听器
 * 监听选中区域和复制区域最顶层行的所有单元格，以优化性能
 */
export class CellObserver {
  constructor({ updated, tableEl }) {
    this.tableEl = tableEl;
    this.updated = updated;
    this.resizeObserver = null;
    this.observedElements = new Set();
    this.currentSelectedCells = [];
    this.currentCopiedCells = [];
  }

  /**
   * 开始监听单元格区域的顶行单元格
   * @param {Array} cells - 单元格数组
   * @param {string} type - 类型：'selected' 或 'copied'
   */
  startObserving(cells, type = "selected") {
    // 更新对应类型的单元格
    if (type === "selected") {
      this.currentSelectedCells = cells || [];
    } else if (type === "copied") {
      this.currentCopiedCells = cells || [];
    }

    this.updateObserverElements();
  }

  /**
   * 更新监听器元素
   */
  updateObserverElements() {
    // 合并所有单元格
    const allCells = [...this.currentSelectedCells, ...this.currentCopiedCells];

    if (allCells.length === 0) {
      this.stopObserving();
      return;
    }

    // 计算所有区域的顶行单元格
    const topRowCellsMap = new Map();

    // 按区域分组计算顶行
    const selectedTopRow = this.getTopRowCells(this.currentSelectedCells);
    const copiedTopRow = this.getTopRowCells(this.currentCopiedCells);

    // 合并顶行单元格（去重）
    [...selectedTopRow, ...copiedTopRow].forEach((cell) => {
      const key = `${cell.rowIndex}-${cell.columnIndex}`;
      topRowCellsMap.set(key, cell);
    });

    const topRowCells = Array.from(topRowCellsMap.values());

    // 限制最大监听数量，避免性能问题
    const maxObserveCount = 20;
    const cellsToObserve = topRowCells.slice(0, maxObserveCount);

    this.createResizeObserver(cellsToObserve);
  }

  /**
   * 获取单元格数组的顶行与最小列单元格
   * @param {Array} cells - 单元格数组
   * @returns {Array} 顶行与最小列单元格数组
   */
  getTopRowCells(cells) {
    if (!cells || cells.length === 0) return [];

    // 计算最小行索引和最小列索引
    const minRowIndex = Math.min(...cells.map((cell) => cell.rowIndex));
    const minColumnIndex = Math.min(...cells.map((cell) => cell.columnIndex));

    // 获取所有相关的行索引和列索引
    const rowIndexes = [...new Set(cells.map((cell) => cell.rowIndex))];
    const columnIndexes = [...new Set(cells.map((cell) => cell.columnIndex))];

    const resultCells = [];
    const cellMap = new Set();

    // 添加顶行的所有相关列单元格
    columnIndexes.forEach((colIndex) => {
      const key = `${minRowIndex}-${colIndex}`;
      if (!cellMap.has(key)) {
        resultCells.push({
          rowIndex: minRowIndex,
          columnIndex: colIndex,
        });
        cellMap.add(key);
      }
    });

    // 添加最小列的所有相关行单元格
    // rowIndexes.forEach((rowIndex) => {
    //   const key = `${rowIndex}-${minColumnIndex}`;
    //   if (!cellMap.has(key)) {
    //     resultCells.push({
    //       rowIndex: rowIndex,
    //       columnIndex: minColumnIndex,
    //     });
    //     cellMap.add(key);
    //   }
    // });

    return resultCells;
  }

  /**
   * 创建ResizeObserver监听指定单元格和tbody容器
   * @param {Array} cells - 要监听的单元格数组
   */
  createResizeObserver(cells) {
    // 先停止现有监听
    this.stopObserving();
    if (cells.length === 0) return;

    // 创建新的ResizeObserver
    this.resizeObserver = new ResizeObserver((entries) => {
      this.updated();
    });

    // 监听tbody容器
    const tbody = this.tableEl?.querySelector("tbody");
    if (tbody) {
      this.resizeObserver.observe(tbody);
      this.observedElements.add(tbody);
    }

    // 监听具体的单元格
    cells.forEach((cell) => {
      const element = getCellElement(
        this.tableEl,
        cell.rowIndex,
        cell.columnIndex
      );
      if (element) {
        this.resizeObserver.observe(element);
        this.observedElements.add(element);
      }
    });
  }

  /**
   * 检查是否需要更新监听器
   * @param {Array} newCells - 新的单元格数组
   * @param {string} type - 类型
   * @returns {boolean}
   */
  needsObserverUpdate(newCells, type = "selected") {
    const currentCells =
      type === "selected" ? this.currentSelectedCells : this.currentCopiedCells;

    if (!currentCells || currentCells.length !== (newCells?.length || 0)) {
      return true;
    }

    // 检查单元格是否相同
    const currentSet = new Set(
      currentCells.map((cell) => `${cell.rowIndex}-${cell.columnIndex}`)
    );
    const newSet = new Set(
      (newCells || []).map((cell) => `${cell.rowIndex}-${cell.columnIndex}`)
    );

    if (currentSet.size !== newSet.size) {
      return true;
    }

    for (const key of currentSet) {
      if (!newSet.has(key)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 停止监听
   */
  stopObserving() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    this.observedElements.clear();
    this.currentSelectedCells = [];
    this.currentCopiedCells = [];
  }

  /**
   * 销毁监听器
   */
  destroy() {
    this.stopObserving();
  }

  /**
   * 检查是否正在监听
   * @returns {boolean}
   */
  isObserving() {
    return this.resizeObserver !== null && this.observedElements.size > 0;
  }

  /**
   * 获取当前监听的元素数量
   * @returns {number}
   */
  getObservedCount() {
    return this.observedElements.size;
  }
}
