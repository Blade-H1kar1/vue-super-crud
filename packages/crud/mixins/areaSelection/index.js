import {
  createCellInfo,
  getCellText,
  getCellElement,
  getBoundaryCellFromMousePosition,
  getHeaderText,
  detectScrollDirection,
  getCellsBounds,
  convertRowsToTableData,
  readClipboardData,
  getColumnCount,
  isInnerCell,
} from "./utils.js";

import { analyzePattern, generateSmartFillData } from "./smartFillEngine";
import { UndoRedoManager } from "./undoRedoManager.js";
import { debounce } from "lodash-es";
import { OverlayManager } from "./overlayManager.js";
import { CellObserver } from "./cellObserver.js";
import { checkVisibility } from "utils";

const applicationType = "web application/super-crud-data";
let focusedTable = null;

export default {
  data() {
    return {
      // 单元格选中状态
      selectedCells: [], // 存储选中的单元格 "rowIndex-columnIndex"
      copiedCells: [], // 已复制的单元格索引信息
      extendedCells: [], // 扩展选中的单元格
      isCutMode: false, // 是否为剪切模式

      // 拖拽状态
      dragState: {
        type: null, // 'select','headerSelect', 'fill'
        startCell: null,
        endCell: null,
        headerStartColumnIndex: null,
        fillEndCell: null,
        fillDirection: null, // 'horizontal', 'vertical', null
      },

      // 遮罩层管理器
      overlayManager: null,

      // DOM监听
      cellObserver: null,
      globalEventsAdded: false,

      // requestAnimationFrame防抖
      mouseMoveAnimationId: null,

      // 自动滚动状态
      autoScroll: {
        isScrolling: false,
        scrollSpeed: 10, // 滚动速度
        currentScrollDirection: null, // 当前滚动方向
      },

      // 撤销重做管理器
      undoRedoManager: null,

      // 拖拽缓存优化
      lastCellInfo: null,
    };
  },

  mounted() {
    if (!this.enabledAreaSelection) return;
    this.initEvents();
    this.initOverlayManager();
    this.initUndoRedoManager();
  },

  beforeDestroy() {
    this.cleanup();
  },

  computed: {
    enabledAreaSelection() {
      return checkVisibility(this.areaSelection);
    },
    // 区域选取配置
    areaSelection() {
      return this.crudOptions.areaSelection || {};
    },
  },

  methods: {
    // ========== 公共方法 ==========

    // 获取表格元素
    getTableElement() {
      return this.$el;
    },
    // 获取表格容器元素
    tableWrapper() {
      const tableEl = this.getTableElement();
      return tableEl?.querySelector(".el-table__body-wrapper") || tableEl;
    },
    // 清理所有资源
    cleanup() {
      this.removeAllEvents();
      this.destroyTableObserver();
      this.destroyCellObserver();
      if (this.overlayManager) {
        this.overlayManager.destroy();
        this.overlayManager = null;
      }
    },

    // ========== 自动滚动相关方法 ==========
    // 开始自动滚动
    startAutoScroll(scrollDirection) {
      if (this.autoScroll.isScrolling) {
        // 如果已经在滚动，更新滚动方向
        this.autoScroll.currentScrollDirection = scrollDirection;
        return;
      }

      const tableWrapper = this.tableWrapper();
      if (!tableWrapper) return;

      // 检查表格是否可以滚动
      const canScrollHorizontally =
        !tableWrapper.classList.contains("is-scrolling-none") &&
        tableWrapper.scrollWidth > tableWrapper.clientWidth + 10;
      const canScrollVertically =
        tableWrapper.scrollHeight > tableWrapper.clientHeight + 10;

      if (!canScrollHorizontally && !canScrollVertically) return;

      this.autoScroll.isScrolling = true;
      this.autoScroll.currentScrollDirection = scrollDirection;

      const scrollThreshold = 5; // 边界阈值，避免精确比较
      const { scrollSpeed } = this.autoScroll;

      const scrollAnimation = () => {
        if (!this.autoScroll.isScrolling) return;

        const currentDirection = this.autoScroll.currentScrollDirection;
        let scrolled = false;

        // 垂直滚动处理
        if (currentDirection.up && tableWrapper.scrollTop > scrollThreshold) {
          tableWrapper.scrollTop = Math.max(
            0,
            tableWrapper.scrollTop - scrollSpeed
          );
          scrolled = true;
        }
        if (
          currentDirection.down &&
          tableWrapper.scrollTop <
            tableWrapper.scrollHeight -
              tableWrapper.clientHeight -
              scrollThreshold
        ) {
          tableWrapper.scrollTop = Math.min(
            tableWrapper.scrollHeight - tableWrapper.clientHeight,
            tableWrapper.scrollTop + scrollSpeed
          );
          scrolled = true;
        }

        // 水平滚动处理
        if (
          currentDirection.left &&
          tableWrapper.scrollLeft > scrollThreshold
        ) {
          tableWrapper.scrollLeft = Math.max(
            0,
            tableWrapper.scrollLeft - scrollSpeed
          );
          scrolled = true;
        }
        if (
          currentDirection.right &&
          tableWrapper.scrollLeft <
            tableWrapper.scrollWidth -
              tableWrapper.clientWidth -
              scrollThreshold
        ) {
          tableWrapper.scrollLeft = Math.min(
            tableWrapper.scrollWidth - tableWrapper.clientWidth,
            tableWrapper.scrollLeft + scrollSpeed
          );
          scrolled = true;
        }

        // 继续滚动或停止
        if (this.autoScroll.isScrolling && scrolled) {
          requestAnimationFrame(scrollAnimation);
        } else {
          this.stopAutoScroll();
        }
      };

      requestAnimationFrame(scrollAnimation);
    },

    // 停止自动滚动
    stopAutoScroll() {
      this.autoScroll.isScrolling = false;
      this.autoScroll.currentScrollDirection = null;
    },

    // 创建全选角标
    createSelectAllCorner() {
      const corner = document.createElement("div");
      corner.className = "table-select-all-corner";
      corner.title = "全选/取消全选";

      const container = this.getTableElement().querySelector(".el-table");
      if (container) {
        container.appendChild(corner);

        // 添加点击事件
        corner.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          const tableEl = this.getTableElement();
          if (!tableEl) return;

          // 全选
          const columnCount = getColumnCount(this.getTableElement());
          if (this.rowCount > 0 && columnCount > 0) {
            this.selectCells({
              startCell: { rowIndex: 0, columnIndex: 0 },
              endCell: {
                rowIndex: this.rowCount - 1,
                columnIndex: columnCount - 1,
              },
            });
          }
        });
      }
    },

    // ========== 遮罩层管理 ==========

    // 初始化遮罩层管理器
    initOverlayManager() {
      this.$nextTick(() => {
        this.overlayManager = new OverlayManager({
          tableEl: this.getTableElement(),
          initCallback: () => {
            this.createSelectAllCorner();
          },
        });

        // 初始化顶行监听器
        this.cellObserver = new CellObserver({
          tableEl: this.getTableElement(),
          updated: () => {
            this.updateOverlays();
          },
        });
      });
    },
    // 更新所有遮罩层
    updateOverlays(d) {
      if (!this.overlayManager) return;

      this.$nextTick(() => {
        // 更新选中遮罩层
        this.overlayManager.updateOverlayForType(
          "selection",
          this.selectedCells
        );

        // 更新复制虚线遮罩层
        this.overlayManager.updateOverlayForType("copyDash", this.copiedCells);

        // 更新扩展选择遮罩层
        this.overlayManager.updateOverlayForType(
          "extended",
          this.extendedCells
        );
      });
    },

    // ========== 事件管理 ==========

    // 移除所有事件
    removeAllEvents() {
      this.removeEvents();
      this.removeTempGlobalEvents();
    },

    // 添加临时全局事件监听器
    addTempGlobalEvents() {
      if (this.globalEventsAdded) return;
      document.addEventListener("mousemove", this.handleGlobalMouseMove);
      document.addEventListener("mouseup", this.handleGlobalMouseUp);
      this.globalEventsAdded = true;
    },

    // 移除全局事件监听器
    removeTempGlobalEvents() {
      if (!this.globalEventsAdded) return;

      document.removeEventListener("mousemove", this.handleGlobalMouseMove);
      document.removeEventListener("mouseup", this.handleGlobalMouseUp);
      this.globalEventsAdded = false;
    },

    // 初始化事件
    initEvents() {
      document.addEventListener("keydown", this.handleKeyDown);
      document.addEventListener("mousedown", this.handleGlobalMouseDown);
    },

    // 移除事件
    removeEvents() {
      document.removeEventListener("keydown", this.handleKeyDown);
      document.removeEventListener("mousedown", this.handleGlobalMouseDown);
    },

    // 键盘事件处理
    handleKeyDown(event) {
      const tableEl = this.getTableElement();
      if (!tableEl || focusedTable !== tableEl) return;

      // Ctrl+A 全选
      if (event.ctrlKey && event.key === "a") {
        // 检查全选权限
        if (!this.areaSelection.selectAll) {
          console.warn("全选操作被禁用");
          return;
        }
        event.preventDefault();
        // 全选
        const columnCount = getColumnCount(this.getTableElement());
        if (this.rowCount > 0 && columnCount > 0) {
          this.selectCells({
            startCell: { rowIndex: 0, columnIndex: 0 },
            endCell: {
              rowIndex: this.rowCount - 1,
              columnIndex: columnCount - 1,
            },
          });
        }
        return;
      }

      // Ctrl+Shift+C 复制带表头
      if (event.ctrlKey && event.shiftKey && event.key === "C") {
        // 检查复制权限
        if (!this.areaSelection.copy) {
          console.warn("复制操作被禁用");
          return;
        }
        event.preventDefault();
        this.copyCellsValues(false, true);
        return;
      }

      // Ctrl+C 复制
      if (event.ctrlKey && event.key === "c") {
        // 检查复制权限
        if (!this.areaSelection.copy) {
          console.warn("复制操作被禁用");
          return;
        }
        event.preventDefault();
        this.copyCellsValues();
      }

      // Ctrl+X 剪切
      if (event.ctrlKey && event.key === "x") {
        // 检查剪切权限（需要复制和粘贴权限）
        if (!this.areaSelection.cut) {
          console.warn("剪切操作被禁用");
          return;
        }
        event.preventDefault();
        this.copyCellsValues(true);
      }

      // Ctrl+V 粘贴
      if (event.ctrlKey && event.key === "v") {
        // 检查粘贴权限
        if (!this.areaSelection.paste) {
          console.warn("粘贴操作被禁用");
          return;
        }
        event.preventDefault();
        this.pasteCellsValues();
      }

      // Ctrl+Shift+Z 重做
      if (
        (event.ctrlKey && event.shiftKey && event.key === "Z") ||
        (event.ctrlKey && event.key === "y")
      ) {
        // 检查重做权限
        if (!this.areaSelection.redo) {
          console.warn("重做操作被禁用");
          return;
        }
        event.preventDefault();
        this.executeRedo();
        return;
      }

      // Ctrl+Z 撤销
      if (event.ctrlKey && event.key === "z") {
        // 检查撤销权限
        if (!this.areaSelection.undo) {
          console.warn("撤销操作被禁用");
          return;
        }
        event.preventDefault();
        this.executeUndo();
      }

      // Escape 清除选择
      if (event.key === "Escape") {
        event.preventDefault();
        this.clearCellSelection();
      }
    },

    // 检测点击事件类型
    detectClickType(event, tableEl) {
      const target = event.target;

      // 检查是否点击填充手柄
      if (target.classList.contains("fill-handle")) {
        return { type: "fillHandle", target };
      }

      // 检查是否点击表头
      if (target.closest(".el-table__header")) {
        const cellInfo = getBoundaryCellFromMousePosition(event, tableEl);
        return { type: "header", target, cellInfo };
      }

      // 检查是否点击单元格
      if (target.closest(".el-table__body")) {
        const cellInfo = getBoundaryCellFromMousePosition(event, tableEl);
        if (cellInfo) {
          return { type: "cell", target, cellInfo };
        }
      }

      return { type: "unknown", target };
    },

    // 统一的文档点击事件处理
    handleGlobalMouseDown(event) {
      const tableEl = this.getTableElement();
      if (!tableEl) {
        return;
      }
      if (tableEl.contains(event.target)) {
        focusedTable = tableEl;
      }
      // 检查点击是否在表格内
      if (!isInnerCell(event, tableEl)) {
        // 点击在表格外部，清除所有选中
        this.clearCellSelection();
        this.copiedCells = [];
        return;
      }

      // 只处理鼠标左键点击
      if (event.button !== 0) return;

      // 检查当前鼠标样式
      const cursor = window.getComputedStyle(event.target).cursor;
      if (
        cursor === "col-resize" ||
        cursor === "row-resize" ||
        cursor === "pointer"
      ) {
        return;
      }

      // 检测点击类型并分发处理
      const clickInfo = this.detectClickType(event, tableEl);
      this.handleUnifiedMouseDown(event, clickInfo);

      tableEl.style.userSelect = "none";
    },

    // 统一的鼠标按下事件处理器
    handleUnifiedMouseDown(event, clickInfo) {
      const { type, cellInfo } = clickInfo;

      // 使用统一的全局事件处理器
      this.addTempGlobalEvents();

      switch (type) {
        case "fillHandle":
          this.handleFillHandleMouseDown(event);
          break;

        case "header":
          if (!this.areaSelection.selection) {
            console.warn("区域选择操作被禁用");
            return;
          }
          this.clearCellSelection();
          this.handleHeaderMouseDown(event, cellInfo);
          break;

        case "cell":
          if (!this.areaSelection.selection) {
            console.warn("区域选择操作被禁用");
            return;
          }
          this.clearCellSelection();
          this.handleCellMouseDown(event, cellInfo);
          break;

        default:
          // 未知类型，不处理
          break;
      }
    },

    // 处理表头点击逻辑
    handleHeaderMouseDown(event, cellInfo) {
      this.dragState.type = "headerSelect";
      this.dragState.headerStartColumnIndex = cellInfo.columnIndex;

      // 选择整列

      if (this.rowCount > 0) {
        this.selectCells({
          startCell: { rowIndex: 0, columnIndex: cellInfo.columnIndex },
          endCell: {
            rowIndex: this.rowCount - 1,
            columnIndex: cellInfo.columnIndex,
          },
        });
      }
    },

    // 处理单元格点击逻辑
    handleCellMouseDown(event, cellInfo) {
      if (!cellInfo) return;

      this.dragState.type = "select";
      this.dragState.startCell = cellInfo;

      // 获取列配置信息
      const columnConfig = this.getColumnByIndexFromTable(cellInfo.columnIndex);

      // 检查列配置是否存在type属性，如果存在则选择整行
      if (
        columnConfig &&
        columnConfig.type !== "default" &&
        columnConfig.type !== "action"
      ) {
        // 获取rowspan属性，默认为1
        let rowspan = 1;
        if (cellInfo.element) {
          const rowspanAttr = cellInfo.element.getAttribute("rowspan");
          if (rowspanAttr) {
            rowspan = parseInt(rowspanAttr, 10) || 1;
          }
        }

        const columnCount = getColumnCount(this.getTableElement());

        if (columnCount > 0) {
          this.selectCells({
            startCell: { rowIndex: cellInfo.rowIndex, columnIndex: 0 },
            endCell: {
              rowIndex: cellInfo.rowIndex + rowspan - 1, // 根据rowspan选择多行
              columnIndex: columnCount - 1,
            },
          });
        }
      } else {
        this.selectCells({
          startCell: {
            rowIndex: cellInfo.rowIndex,
            columnIndex: cellInfo.columnIndex,
          },
          endCell: {
            rowIndex: cellInfo.rowIndex,
            columnIndex: cellInfo.columnIndex,
          },
        });
      }
    },

    // 统一的全局鼠标移动事件处理器
    handleGlobalMouseMove(event) {
      const { type } = this.dragState;
      if (!type) return;

      // 检测边界并处理自动滚动
      const scrollDirection = detectScrollDirection(event, this.tableWrapper());
      if (scrollDirection) {
        this.startAutoScroll(scrollDirection);
      } else {
        this.stopAutoScroll();
      }

      // 根据拖拽类型分发处理
      if (type === "fill") {
        this.handleFillDragMove(event);
      } else if (type === "headerSelect") {
        this.handleHeaderDragMove(event);
      } else if (type === "select") {
        this.handleCellDragMove(event);
      }
    },

    // 处理表头拖拽移动
    handleHeaderDragMove(event) {
      const columnIndex = getBoundaryCellFromMousePosition(
        event,
        this.getTableElement()
      )?.columnIndex;

      if (columnIndex === null || columnIndex === undefined) return;

      const { headerStartColumnIndex } = this.dragState;
      const minCol = Math.min(headerStartColumnIndex, columnIndex);
      const maxCol = Math.max(headerStartColumnIndex, columnIndex);

      // 整列选择
      if (this.rowCount > 0) {
        this.selectCells({
          startCell: { rowIndex: 0, columnIndex: minCol },
          endCell: { rowIndex: this.rowCount - 1, columnIndex: maxCol },
        });
      }
    },

    // 处理单元格拖拽移动
    handleCellDragMove(event) {
      if (this.mouseMoveAnimationId) {
        cancelAnimationFrame(this.mouseMoveAnimationId);
      }

      this.mouseMoveAnimationId = requestAnimationFrame(() => {
        const cellInfo = getBoundaryCellFromMousePosition(
          event,
          this.getTableElement()
        );

        // 检查cellInfo是否与上次相同
        if (
          this.lastCellInfo &&
          cellInfo &&
          this.lastCellInfo.rowIndex === cellInfo.rowIndex &&
          this.lastCellInfo.columnIndex === cellInfo.columnIndex
        ) {
          return;
        }

        // 更新缓存
        this.lastCellInfo = cellInfo;

        if (cellInfo) {
          const { startCell } = this.dragState;
          this.dragState.endCell = cellInfo;

          // 检查起始列是否具有type属性
          const startColumnConfig = this.getColumnByIndexFromTable(
            cellInfo.columnIndex
          );

          if (
            startColumnConfig &&
            startColumnConfig.type !== "default" &&
            startColumnConfig.type !== "action"
          ) {
            // 如果起始列具有type属性，则按行选择
            const startRowIndex = Math.min(
              startCell.rowIndex,
              cellInfo.rowIndex
            );
            const endRowIndex = Math.max(startCell.rowIndex, cellInfo.rowIndex);

            // 获取起始单元格的rowspan以确定实际的结束行
            let startRowspan = 1;
            if (this.dragState.startCell.element) {
              const rowspanAttr =
                this.dragState.startCell.element.getAttribute("rowspan");
              if (rowspanAttr) {
                startRowspan = parseInt(rowspanAttr, 10) || 1;
              }
            }

            // 获取结束单元格的rowspan
            let endRowspan = 1;
            if (cellInfo.element) {
              const rowspanAttr = cellInfo.element.getAttribute("rowspan");
              if (rowspanAttr) {
                endRowspan = parseInt(rowspanAttr, 10) || 1;
              }
            }

            // 计算实际的结束行索引，考虑rowspan
            const actualEndRowIndex = Math.max(
              startRowIndex + startRowspan - 1,
              endRowIndex + endRowspan - 1
            );

            // 整行选择
            const columnCount = getColumnCount(this.getTableElement());
            if (columnCount > 0) {
              this.selectCells({
                startCell: { rowIndex: startRowIndex, columnIndex: 0 },
                endCell: {
                  rowIndex: actualEndRowIndex,
                  columnIndex: columnCount - 1,
                },
              });
            }
          } else {
            // 普通列按范围选择
            this.selectCells({
              startCell,
              endCell: cellInfo,
            });
          }
        }

        this.mouseMoveAnimationId = null;
      });
    },

    // 统一的全局鼠标抬起事件处理器
    handleGlobalMouseUp(event) {
      const { type } = this.dragState;
      if (!type) return;
      this.dragState.type = null;
      // 根据拖拽类型分发处理
      if (type === "fill") {
        this.handleFillDragEnd(event);
      } else if (type === "headerSelect") {
        // 清理表头拖拽状态
        this.dragState.headerStartColumnIndex = null;
        // 移除全局事件监听
        this.removeTempGlobalEvents();
      } else if (type === "select") {
        // 清理普通单元格拖拽状态
        this.dragState.endCell = null;
        // 清空拖拽缓存
        this.lastCellInfo = null;
        // 停止自动滚动
        this.stopAutoScroll();
        // 移除全局事件监听
        this.removeTempGlobalEvents();
      }
    },

    // 简化的选择函数
    selectCells({ startCell, endCell }) {
      const tableEl = this.getTableElement();
      if (!tableEl) return;

      this.clearCellSelection();

      // 选择引擎核心逻辑
      if (startCell && endCell) {
        // 创建新的选中单元格数组
        let newSelectedCells = [...this.selectedCells];

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

        // 统一的范围选择逻辑
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

        // 更新响应式数据
        this.selectedCells = newSelectedCells;
      }

      // 更新覆盖层
      this.updateOverlays();

      // 启动顶行监听器
      this.cellObserver.startObserving(this.selectedCells, "selected");

      this.$emit("area-selection-change", {
        startCell,
        endCell,
        selectedCells: this.selectedCells,
      });
    },

    // 清除所有单元格选择
    clearCellSelection() {
      this.selectedCells = [];

      // 统一更新所有遮罩层状态
      this.updateOverlays();

      this.cellObserver.stopObserving();
    },

    // 销毁顶行监听器
    destroyCellObserver() {
      if (this.cellObserver) {
        this.cellObserver.stopObserving();
        this.cellObserver = null;
      }
    },

    // ==================== 复制黏贴相关方法 ====================

    // 复制选中单元格的值
    async copyCellsValues(isCut = false, includeHeaders = false) {
      try {
        this.isCutMode = isCut;
        this.copiedCells = [...this.selectedCells];
        const cellsData = this.copiedCells.sort((a, b) => {
          if (a.rowIndex !== b.rowIndex) return a.rowIndex - b.rowIndex;
          return a.columnIndex - b.columnIndex;
        });

        const tableEl = this.getTableElement();
        const textRows = {}; // 存储文本值
        const valueTextRows = {}; // 存储转换后的实际值

        // 统一处理单元格数据收集
        cellsData.forEach((cell) => {
          const { rowIndex, columnIndex } = cell;
          if (!textRows[rowIndex]) textRows[rowIndex] = {};
          if (!valueTextRows[rowIndex]) valueTextRows[rowIndex] = {};

          // 获取文本（用于剪贴板）
          const element = getCellElement(tableEl, rowIndex, columnIndex);
          const cellText = getCellText(element) || "";

          textRows[rowIndex][columnIndex] = cellText;

          // 获取实际值（用于组件间复制）
          const cellValue =
            this.getCellValue(rowIndex, columnIndex) || cellText;
          let valueText = "";
          if (
            Array.isArray(cellValue) ||
            (typeof cellValue === "object" && cellValue !== null)
          ) {
            // 数组或对象直接保存为 JSON 字符串
            valueText = JSON.stringify(cellValue);
          } else {
            valueText = String(cellValue);
          }

          valueTextRows[rowIndex][columnIndex] = valueText;
        });

        // 使用通用方法转换数据
        let { textData } = convertRowsToTableData(textRows);
        const { textData: valueTextData } =
          convertRowsToTableData(valueTextRows);

        // 如果需要包含表头，在textData前面插入表头行
        if (includeHeaders) {
          const columnIndices = [
            ...new Set(cellsData.map((cell) => cell.columnIndex)),
          ].sort((a, b) => a - b);
          const headerTexts = columnIndices.map((columnIndex) =>
            getHeaderText(tableEl, columnIndex)
          );
          const headerLine = headerTexts.join("\t");
          textData = headerLine + "\n" + textData;
        }

        try {
          // 创建 JSON 数据
          const jsonData = {
            type: "super-crud-data",
            data: {
              valueTextRows: valueTextRows,
              textData: valueTextData,
              originalTextData: textData,
              timestamp: Date.now(),
            },
          };

          // 同时存储 text/plain 和 JSON 格式
          const clipboardItem = new ClipboardItem({
            "text/plain": new Blob([textData], { type: "text/plain" }),
            [applicationType]: new Blob([JSON.stringify(jsonData)], {
              type: applicationType,
            }),
          });

          await navigator.clipboard.write([clipboardItem]);
        } catch (error) {
          console.warn("使用多格式剪贴板失败，降级到文本模式:", error);
          await navigator.clipboard.writeText(textData);
        }

        // 统一更新所有遮罩层状态
        this.updateOverlays();

        // 启动顶行监听器（针对复制的单元格）
        this.cellObserver.startObserving(this.copiedCells, "copied");

        this.$emit("area-copy", {
          valueRows: valueTextRows,
          textRows: valueTextData,
          copiedCells: this.copiedCells,
          isCut: isCut,
          includeHeaders: includeHeaders,
        });
      } catch (error) {
        console.error("复制失败:", error);
      }
    },

    // 粘贴选中单元格的值
    async pasteCellsValues() {
      try {
        const { textData, isValueMode } = await readClipboardData();

        if (!textData) {
          console.warn("无法获取剪贴板数据");
          return;
        }

        const result = this.applyPasteData(textData, isValueMode);

        if (result?.success) {
          // 记录撤销历史
          if (result.affectedCells && result.affectedCells.length > 0) {
            this.recordUndoHistory("paste", result.affectedCells);
          }

          // 如果是剪切模式，清空原始单元格的值
          if (this.isCutMode) {
            await this.clearCutCells();
          }

          // 触发粘贴操作事件
          this.$emit("area-paste", {
            pastedCells: result.affectedCells,
            isCutMode: this.isCutMode,
          });

          // 清除复制状态
          this.copiedCells = [];

          // 更新选中区域到粘贴范围
          if (result.pasteBounds) {
            const { minRow, maxRow, minCol, maxCol } = result.pasteBounds;
            this.selectCells({
              startCell: { rowIndex: minRow, columnIndex: minCol },
              endCell: { rowIndex: maxRow, columnIndex: maxCol },
            });
          }
          this.updateOverlays();
        } else {
          console.error("粘贴失败:", result?.message);
        }
      } catch (error) {
        console.error("粘贴操作失败:", error);
      }
    },

    // 清空剪切的原始单元格值
    async clearCutCells() {
      try {
        const affectedCells = [];

        for (const cell of this.copiedCells) {
          const { rowIndex, columnIndex } = cell;
          const row = this.getRowDataByIndex(rowIndex);
          const column = this.getColumnByIndex(columnIndex);

          if (row && column && column.prop) {
            // 检查是否有编辑权限
            if (this.checkPastePermission(row, column)) {
              // 记录原始值用于撤销
              const oldValue = this.getCellValue(rowIndex, columnIndex);

              // 设置单元格值为空
              this.setCellValue(
                row,
                column,
                column.prop,
                rowIndex,
                columnIndex,
                ""
              );

              // 记录受影响的单元格
              affectedCells.push({
                rowIndex,
                columnIndex,
                oldValue,
                newValue: "",
              });
            }
          }
        }

        // 记录撤销历史
        if (affectedCells.length > 0) {
          this.recordUndoHistory("cut", affectedCells);
        }
      } catch (error) {
        console.error("清空剪切单元格失败:", error);
      }
    },

    // ==================== 扩展选中区域相关方法 ====================

    // 拖拽填充小方块鼠标按下事件
    handleFillHandleMouseDown(event) {
      if (!this.areaSelection.fill) {
        console.warn("填充操作被禁用");
        return;
      }
      const dragState = this.dragState;
      // 设置拖拽状态
      Object.assign(dragState, {
        type: "fill",
        fillDirection: null, // 重置拖拽方向
      });
      // 改变鼠标样式
      document.body.style.cursor = "crosshair";
    },

    // 拖拽填充移动事件
    handleFillDragMove(event) {
      const { fillDirection } = this.dragState;

      const cellInfo = getBoundaryCellFromMousePosition(
        event,
        this.getTableElement()
      );

      if (cellInfo) {
        const originalSelectionBounds = getCellsBounds(this.selectedCells);
        if (!originalSelectionBounds) return;

        const { rowIndex: currentRow, columnIndex: currentCol } = cellInfo;
        const { minRow, maxRow, minCol, maxCol } = originalSelectionBounds;

        // 确定拖拽方向（只在第一次移动时确定）
        if (fillDirection === null) {
          // 计算当前位置相对于选中区域边界的偏移
          const isOutsideRight = currentCol > maxCol;
          const isOutsideLeft = currentCol < minCol;
          const isOutsideBottom = currentRow > maxRow;
          const isOutsideTop = currentRow < minRow;

          // 计算水平和垂直方向的移动距离
          let horizontalDistance = 0;
          let verticalDistance = 0;

          if (isOutsideRight) {
            horizontalDistance = currentCol - maxCol;
          } else if (isOutsideLeft) {
            horizontalDistance = minCol - currentCol;
          }

          if (isOutsideBottom) {
            verticalDistance = currentRow - maxRow;
          } else if (isOutsideTop) {
            verticalDistance = minRow - currentRow;
          }

          // 根据移动距离较大的方向确定拖拽方向
          if (verticalDistance > horizontalDistance && verticalDistance > 0) {
            this.dragState.fillDirection = "vertical";
          } else if (
            horizontalDistance > verticalDistance &&
            horizontalDistance > 0
          ) {
            this.dragState.fillDirection = "horizontal";
          } else {
            // 如果还在选中区域内或移动距离相等，暂时不确定方向
            return;
          }
        }

        // 根据确定的方向限制拖拽结束位置
        let constrainedCellInfo = { ...cellInfo };
        const currentFillDirection = this.dragState.fillDirection;

        if (currentFillDirection === "horizontal") {
          // 水平方向：保持在选中区域的行范围内，只允许列变化
          if (currentCol > maxCol) {
            // 向右扩展：使用选中区域的最后一行
            constrainedCellInfo.rowIndex = maxRow;
          } else if (currentCol < minCol) {
            // 向左扩展：使用选中区域的第一行
            constrainedCellInfo.rowIndex = minRow;
          }
        } else if (currentFillDirection === "vertical") {
          // 垂直方向：保持在选中区域的列范围内，只允许行变化
          if (currentRow > maxRow) {
            // 向下扩展：使用选中区域的最后一列
            constrainedCellInfo.columnIndex = maxCol;
          } else if (currentRow < minRow) {
            // 向上扩展：使用选中区域的第一列
            constrainedCellInfo.columnIndex = minCol;
          }
        }

        this.dragState.fillEndCell = constrainedCellInfo;

        const { rowIndex: dragRow, columnIndex: dragCol } = constrainedCellInfo;
        // 计算扩展区域边界
        const extendedBounds = {
          minRow: Math.min(minRow, dragRow),
          maxRow: Math.max(maxRow, dragRow),
          minCol: Math.min(minCol, dragCol),
          maxCol: Math.max(maxCol, dragCol),
        };
        // 生成扩展区域单元格列表
        const extendedCells = [];
        for (
          let row = extendedBounds.minRow;
          row <= extendedBounds.maxRow;
          row++
        ) {
          for (
            let col = extendedBounds.minCol;
            col <= extendedBounds.maxCol;
            col++
          ) {
            extendedCells.push(createCellInfo(row, col));
          }
        }
        this.extendedCells = extendedCells;
      }

      // 更新遮罩层显示
      this.updateOverlays();
    },

    // 拖拽填充结束事件
    handleFillDragEnd(event) {
      const { fillEndCell, fillDirection } = this.dragState;

      this.extendedCells = [];

      // 获取原始选中区域的边界
      const originalBounds = getCellsBounds(this.selectedCells);
      let fillCells = [];
      let fillResult = null;

      // 如果有填充结束单元格，计算填充区域的所有单元格
      if (fillEndCell && originalBounds) {
        // 计算填充区域的边界（包含原始选中区域和填充区域）
        const fillStartRow = Math.min(
          originalBounds.minRow,
          fillEndCell.rowIndex
        );
        const fillEndRow = Math.max(
          originalBounds.maxRow,
          fillEndCell.rowIndex
        );
        const fillStartCol = Math.min(
          originalBounds.minCol,
          fillEndCell.columnIndex
        );
        const fillEndCol = Math.max(
          originalBounds.maxCol,
          fillEndCell.columnIndex
        );

        // 提取表格元素，避免重复访问
        const tableEl = this.getTableElement();

        // 遍历填充区域内的所有单元格
        for (let row = fillStartRow; row <= fillEndRow; row++) {
          for (let col = fillStartCol; col <= fillEndCol; col++) {
            // 通过DOM检查单元格是否存在
            const cellElement = getCellElement(tableEl, row, col);
            if (cellElement) {
              fillCells.push({
                rowIndex: row,
                columnIndex: col,
                element: cellElement,
              });
            }
          }
        }

        // 检测是否按住Ctrl键（禁用智能填充）
        const disableSmartFill = event.ctrlKey || event.metaKey;

        // 执行填充操作
        fillResult = this.performFillOperation(
          originalBounds,
          fillCells,
          fillDirection,
          disableSmartFill
        );

        // 输出填充结果日志
        if (!fillResult.success) {
          console.warn(`拖拽填充失败: ${fillResult.message}`);
        }
      }

      // 移除全局事件监听器
      this.removeTempGlobalEvents();

      // 恢复鼠标样式
      document.body.style.cursor = "";

      // 重置拖拽状态
      Object.assign(this.dragState, {
        type: null,
        fillEndCell: null,
        fillDirection: null, // 重置拖拽方向
      });

      // 如果填充成功，更新选中区域为整个填充区域
      if (fillResult && fillResult.success && fillCells.length > 0) {
        // 计算填充区域的边界
        const fillBounds = getCellsBounds(fillCells);

        this.selectCells({
          startCell: {
            rowIndex: fillBounds.minRow,
            columnIndex: fillBounds.minCol,
          },
          endCell: {
            rowIndex: fillBounds.maxRow,
            columnIndex: fillBounds.maxCol,
          },
        });
      }

      // 统一更新所有遮罩层状态
      this.updateOverlays();

      // 触发填充操作事件
      this.$emit("area-fill", {
        startBounds: originalBounds,
        endCell: fillEndCell,
        selectedCells: this.selectedCells,
        fillCells: fillCells,
        fillResult: fillResult,
      });
    },

    // 执行填充操作
    performFillOperation(
      originalBounds,
      fillCells,
      fillDirection,
      disableSmartFill = false
    ) {
      if (!originalBounds || !fillCells || fillCells.length === 0) {
        return { success: false, message: "填充参数无效" };
      }
      try {
        // 获取原始选中区域的数据
        const sourceData = this.getSourceDataForFill(originalBounds);
        if (!sourceData || sourceData.length === 0) {
          return { success: false, message: "源数据为空" };
        }

        // 生成填充数据
        const fillData = this.generateSmartFillData(
          sourceData,
          originalBounds,
          fillCells,
          disableSmartFill
        );

        // 应用填充数据到目标单元格
        const applyResult = this.applyFillData(fillData);

        // 记录撤销历史
        if (
          applyResult.success &&
          applyResult.affectedCells &&
          applyResult.affectedCells.length > 0
        ) {
          this.recordUndoHistory("fill", applyResult.affectedCells);
        }

        return {
          success: applyResult.success,
          message: applyResult.message,
          affectedCells: applyResult.affectedCells,
          sourceData,
          fillData,
        };
      } catch (error) {
        console.error("填充操作失败:", error);
        return {
          success: false,
          message: `填充操作失败: ${error.message}`,
        };
      }
    },

    // 获取源数据用于填充
    getSourceDataForFill(originalBounds) {
      const sourceData = [];
      const { minRow, maxRow, minCol, maxCol } = originalBounds;

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const value = this.getCellValue(row, col);
          sourceData.push({
            rowIndex: row,
            columnIndex: col,
            value: value,
            relativeRow: row - minRow,
            relativeCol: col - minCol,
          });
        }
      }

      return sourceData;
    },

    // 生成智能填充数据
    generateSmartFillData(
      sourceData,
      originalBounds,
      fillCells,
      disableSmartFill = false
    ) {
      // 分析数据模式
      const pattern = analyzePattern(
        sourceData,
        this.areaSelection.fillCustomLists || {}
      );

      // 使用智能填充引擎生成数据
      return generateSmartFillData(
        pattern,
        sourceData,
        fillCells,
        originalBounds,
        disableSmartFill
      );
    },

    // 应用填充数据
    applyFillData(fillData) {
      if (!fillData || fillData.length === 0) {
        return {
          success: false,
          message: "没有要填充的数据",
          affectedCells: [],
        };
      }

      const affectedCells = [];
      const errors = [];

      fillData.forEach((data) => {
        try {
          const { rowIndex, columnIndex, value } = data;
          const oldValue = this.getCellValue(rowIndex, columnIndex);

          const row = this.getRowDataByIndex(rowIndex);
          const column = this.getColumnByIndex(columnIndex);
          const prop = column.form?.prop || column.prop;
          // 检查粘贴权限
          if (!this.checkPastePermission(row, column)) return;
          const success = this.setCellValueDirect(row, column, prop, value);
          if (success) {
            affectedCells.push({
              rowIndex,
              columnIndex,
              oldValue,
              newValue: value,
              originalValue: value,
              sourceValue: data.sourceValue,
            });
          } else {
            errors.push(`设置单元格 (${rowIndex}, ${columnIndex}) 值失败`);
          }
        } catch (error) {
          errors.push(
            `处理单元格 (${data.rowIndex}, ${data.columnIndex}) 时出错: ${error.message}`
          );
        }
      });

      return {
        success: errors.length === 0,
        message: errors.length > 0 ? errors.join("; ") : "填充成功",
        affectedCells,
        errors,
      };
    },

    // ========== 撤销重做功能相关方法 ==========

    /**
     * 初始化撤销重做管理器
     */
    initUndoRedoManager() {
      this.undoRedoManager = new UndoRedoManager({
        maxSize: 50,
      });
    },

    // 记录操作历史
    recordUndoHistory(operationType, affectedCells) {
      this.undoRedoManager.recordHistory(operationType, affectedCells);
    },

    // 应用单元格值到表格数据
    applyCellValues(affectedCells, valueType = "newValue") {
      for (const cellData of affectedCells) {
        const { rowIndex, columnIndex } = cellData;
        const value = cellData[valueType];

        const row = this.getRowDataByIndex(rowIndex);
        const column = this.getColumnByIndex(columnIndex);
        const prop = column?.form?.prop || column?.prop;

        if (row && prop) {
          this.setByProp(row, prop, value);
        }
      }

      // 更新选中区域到受影响的单元格
      if (affectedCells.length > 0) {
        const { minRow, maxRow, minCol, maxCol } =
          getCellsBounds(affectedCells);

        this.selectCells({
          startCell: { rowIndex: minRow, columnIndex: minCol },
          endCell: { rowIndex: maxRow, columnIndex: maxCol },
        });
      }
    },

    // 执行撤销操作
    async executeUndo() {
      const { affectedCells } = this.undoRedoManager.executeUndo();
      if (!affectedCells) return;
      this.applyCellValues(affectedCells, "oldValue");

      // 触发撤销操作事件
      this.$emit("area-undo", {
        affectedCells: affectedCells,
      });
    },

    // 执行重做操作
    async executeRedo() {
      const { affectedCells } = this.undoRedoManager.executeRedo();
      if (!affectedCells) return;
      this.applyCellValues(affectedCells, "newValue");

      // 触发重做操作事件
      this.$emit("area-redo", {
        affectedCells: affectedCells,
      });
    },
  },
};
