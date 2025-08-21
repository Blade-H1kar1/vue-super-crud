import {
  parseCellKey,
  createCellKey,
  isFormElement,
  getCellText,
  getColumnIndexByClass,
  getCellElement,
  calculateSelectionBounds,
  fallbackCopyToClipboard,
  getBoundaryCellFromMousePosition,
} from "../utils/cellSelectionUtils.js";

export default {
  data() {
    return {
      // 单元格选中状态
      selectedCells: [], // 存储选中的单元格 "rowIndex-columnIndex"
      isDragging: false, // 是否正在拖拽
      dragStartCell: null, // 拖拽开始的单元格
      dragEndCell: null, // 拖拽结束的单元格
      isMouseDown: false, // 鼠标是否按下
      _cellSelectionHandlers: null, // 事件处理器
      _globalHandlers: null, // 全局事件处理器
      _globalEventsAdded: false, // 全局事件是否已添加
      _justFinishedDragging: false, // 刚刚结束拖拽标志
      // 遮罩层相关
      selectionOverlay: null, // 选中区域遮罩层DOM元素
      overlayVisible: false, // 遮罩层是否可见
    };
  },

  mounted() {
    this.initCellSelectionEvents();
    this.initKeyboardEvents();
    this.createSelectionOverlay();
  },

  beforeDestroy() {
    this.removeCellSelectionEvents();
    this.removeKeyboardEvents();
    // 确保清理全局事件监听器
    this.removeGlobalEvents();
    // 清理遮罩层
    this.removeSelectionOverlay();
  },

  computed: {
    // 获取选中的单元格数据
    selectedCellsData() {
      const tableEl = this.$refs.tableRef?.$el;
      if (!tableEl) return [];

      return this.selectedCells
        .map((cellKey) => {
          const { rowIndex, columnIndex } = parseCellKey(cellKey);
          const element = getCellElement(tableEl, rowIndex, columnIndex);
          if (!element) return null;

          const cellText = getCellText(element);
          return {
            rowIndex,
            columnIndex,
            element,
            cellText,
            value: cellText,
            cellKey,
          };
        })
        .filter(Boolean);
    },
  },

  methods: {
    // 添加全局事件监听器
    addGlobalEvents() {
      if (this._globalEventsAdded || !this._globalHandlers) return;

      document.addEventListener("mousemove", this._globalHandlers.mousemove);
      document.addEventListener("mouseup", this._globalHandlers.mouseup);
      this._globalEventsAdded = true;
    },

    // 移除全局事件监听器
    removeGlobalEvents() {
      if (!this._globalEventsAdded || !this._globalHandlers) return;

      document.removeEventListener("mousemove", this._globalHandlers.mousemove);
      document.removeEventListener("mouseup", this._globalHandlers.mouseup);
      this._globalEventsAdded = false;
    },

    // 初始化单元格选中事件
    initCellSelectionEvents() {
      if (this._cellSelectionHandlers) return;

      this._cellSelectionHandlers = {
        mousedown: this.handleCellMouseDown.bind(this),
        mouseleave: this.handleTableMouseLeave.bind(this),
      };

      // 全局事件处理器（用于拖拽时绑定到document）
      this._globalHandlers = {
        mousemove: this.handleGlobalMouseMove.bind(this),
        mouseup: this.handleGlobalMouseUp.bind(this),
      };

      this.$nextTick(() => {
        const tableEl = this.$refs.tableRef?.$el;
        if (tableEl) {
          // 只绑定mousedown和mouseleave到表格元素
          Object.keys(this._cellSelectionHandlers).forEach((event) => {
            tableEl.addEventListener(event, this._cellSelectionHandlers[event]);
          });

          // 阻止表格默认的文本选择
          tableEl.style.userSelect = "none";
        }
      });
    },

    // 移除单元格选中事件
    removeCellSelectionEvents() {
      if (!this._cellSelectionHandlers) return;

      const tableEl = this.$refs.tableRef?.$el;
      if (tableEl) {
        Object.keys(this._cellSelectionHandlers).forEach((event) => {
          tableEl.removeEventListener(
            event,
            this._cellSelectionHandlers[event]
          );
        });

        // 恢复文本选择
        tableEl.style.userSelect = "";
      }

      // 移除全局事件监听器
      this.removeGlobalEvents();

      this._cellSelectionHandlers = null;
      this._globalHandlers = null;
      this._globalEventsAdded = false;
    },

    // 初始化键盘事件
    initKeyboardEvents() {
      this._keyboardHandler = this.handleKeyDown.bind(this);
      this._documentClickHandler = this.handleDocumentClick.bind(this);
      document.addEventListener("keydown", this._keyboardHandler);
      document.addEventListener("click", this._documentClickHandler);
    },

    // 移除键盘事件
    removeKeyboardEvents() {
      if (this._keyboardHandler) {
        document.removeEventListener("keydown", this._keyboardHandler);
        this._keyboardHandler = null;
      }
      if (this._documentClickHandler) {
        document.removeEventListener("click", this._documentClickHandler);
        this._documentClickHandler = null;
      }
    },

    // 键盘事件处理
    handleKeyDown(event) {
      // 只在表格获得焦点时处理键盘事件
      const tableEl = this.$refs.tableRef?.$el;
      if (!tableEl) {
        return;
      }

      // Ctrl+C 复制
      if (event.ctrlKey && event.key === "c") {
        if (this.selectedCells.length > 0) {
          event.preventDefault();
          this.copyCellsValues();
        }
      }

      // Escape 清除选择
      if (event.key === "Escape") {
        if (this.selectedCells.length > 0) {
          event.preventDefault();
          this.clearCellSelection();
        }
      }
    },

    // 文档点击事件处理
    handleDocumentClick(event) {
      // 如果正在拖拽，不处理点击事件
      if (this.isDragging || this.isMouseDown) {
        return;
      }

      // 如果是 mouseup 事件触发的点击，延迟处理以避免与拖拽结束冲突
      if (event.type === "click" && this._justFinishedDragging) {
        return;
      }

      const tableEl = this.$refs.tableRef?.$el;
      if (!tableEl) {
        return;
      }

      // 检查点击是否在表格内部
      if (!tableEl.contains(event.target)) {
        // 点击在表格外部，清除所有选中
        if (this.selectedCells.length > 0) {
          this.clearCellSelection();
        }
      }
    },

    // 鼠标按下事件
    handleCellMouseDown(event) {
      const cellInfo = this.getCellInfoFromEvent(event);
      if (!cellInfo) return;

      this.isMouseDown = true;
      this.dragStartCell = cellInfo;

      // 如果没有按住Ctrl键，清除之前的选择
      if (!event.ctrlKey && !event.metaKey) {
        this.clearCellSelection();
      }

      this.selectCell(cellInfo.rowIndex, cellInfo.columnIndex);
      this.addGlobalEvents();

      this.$emit("cell-selection-start", {
        cellInfo,
        selectedCells: this.selectedCellsData,
      });
    },

    // 全局鼠标移动事件（支持拖拽到表格外）
    handleGlobalMouseMove(event) {
      if (!this.isMouseDown || !this.dragStartCell) return;

      const cellInfo =
        this.getCellInfoFromEvent(event) ||
        getBoundaryCellFromMousePosition(event, this.$refs.tableRef?.$el);

      if (cellInfo) {
        this.isDragging = true;
        this.dragEndCell = cellInfo;
        this.selectCellRange(this.dragStartCell, cellInfo);

        this.$emit("cell-selection-drag", {
          startCell: this.dragStartCell,
          endCell: cellInfo,
          selectedCells: this.selectedCellsData,
        });
      }
    },

    // 全局鼠标抬起事件
    handleGlobalMouseUp(event) {
      if (!this.isMouseDown) return;

      const wasDragging = this.isDragging;

      // 重置状态
      this.isMouseDown = false;
      this.isDragging = false;

      // 如果刚结束拖拽，设置标志防止立即触发清除逻辑
      if (wasDragging) {
        this._justFinishedDragging = true;
        // 延迟重置标志，给点击事件处理留出时间
        setTimeout(() => {
          this._justFinishedDragging = false;
        }, 10);

        this.$emit("cell-selection-end", {
          startCell: this.dragStartCell,
          endCell: this.dragEndCell,
          selectedCells: this.selectedCellsData,
        });
      }

      // 移除全局事件监听器
      this.removeGlobalEvents();

      // 清理拖拽状态
      this.dragStartCell = null;
      this.dragEndCell = null;
    },

    // 鼠标离开表格事件
    handleTableMouseLeave(event) {
      // 如果没有在拖拽且鼠标已按下，结束选择
      if (!this.isDragging && this.isMouseDown) {
        this.handleGlobalMouseUp(event);
      }
      // 如果正在拖拽，继续让全局事件处理
    },

    // 从事件中获取单元格信息
    getCellInfoFromEvent(event) {
      let target = event.target.classList.contains("el-table__cell")
        ? event.target
        : event.target.closest(".el-table__cell");

      if (!target) return null;

      // 获取行索引
      const tr = target.parentElement;
      const tbody = tr.parentElement;
      const rowIndex = Array.from(tbody.children).indexOf(tr);

      // 获取列索引 - 通过class名称精确匹配，兼容合并单元格
      const columnIndex = getColumnIndexByClass(
        target,
        this.$refs.tableRef?.$el
      );

      // 获取单元格文本内容
      const cellText = getCellText(target);

      return {
        rowIndex,
        columnIndex,
        element: target,
        cellKey: `${rowIndex}-${columnIndex}`,
        cellText,
      };
    },

    // 选中单个单元格
    selectCell(rowIndex, columnIndex) {
      const cellKey = createCellKey(rowIndex, columnIndex);

      if (!this.selectedCells.includes(cellKey)) {
        this.selectedCells.push(cellKey);
      }
      this.updateCellStyles();
    },

    // 取消选中单个单元格
    unselectCell(rowIndex, columnIndex) {
      const cellKey = `${rowIndex}-${columnIndex}`;
      const index = this.selectedCells.indexOf(cellKey);
      if (index > -1) {
        this.selectedCells.splice(index, 1);
      }
      this.updateCellStyles();
    },

    // 选中单元格范围
    selectCellRange(startCell, endCell, keepExisting = false) {
      if (!startCell || !endCell) return;

      const startRow = Math.min(startCell.rowIndex, endCell.rowIndex);
      const endRow = Math.max(startCell.rowIndex, endCell.rowIndex);
      const startCol = Math.min(startCell.columnIndex, endCell.columnIndex);
      const endCol = Math.max(startCell.columnIndex, endCell.columnIndex);

      // 清除之前的选择（如果不保持现有选择）
      if (!keepExisting) {
        this.clearCellSelection();
      }

      // 选中范围内的所有单元格
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          // 通过DOM检查单元格是否存在
          const cellElement = getCellElement(
            this.$refs.tableRef?.$el,
            row,
            col
          );
          if (cellElement) {
            this.selectCell(row, col);
          }
        }
      }
    },

    // 清除所有单元格选择
    clearCellSelection() {
      this.selectedCells.splice(0, this.selectedCells.length);
      this.updateCellStyles();

      // 触发清除选择事件
      this.$emit("cell-selection-clear");
    },

    // 更新单元格样式（使用遮罩层）
    updateCellStyles() {
      this.$nextTick(() => {
        if (this.selectedCells.length === 0) {
          this.hideSelectionOverlay();
          return;
        }

        this.updateSelectionOverlay();
      });
    },

    // 创建选中区域遮罩层
    createSelectionOverlay() {
      if (this.selectionOverlay) return;

      const overlay = document.createElement("div");
      overlay.className = "cell-selection-overlay";
      overlay.style.cssText = `
        position: absolute;
        pointer-events: none;
        z-index: 10;
        box-sizing: border-box;
        display: none;
      `;

      this.selectionOverlay = overlay;

      // 将遮罩层添加到表格容器中
      this.$nextTick(() => {
        const tableEl = this.$refs.tableRef?.$el;
        if (tableEl) {
          const tableWrapper =
            tableEl.querySelector(".el-table__body-wrapper") || tableEl;
          tableWrapper.style.position = "relative";
          tableWrapper.appendChild(overlay);
        }
      });
    },

    // 移除选中区域遮罩层
    removeSelectionOverlay() {
      if (this.selectionOverlay && this.selectionOverlay.parentNode) {
        this.selectionOverlay.parentNode.removeChild(this.selectionOverlay);
        this.selectionOverlay = null;
      }
    },

    // 更新选中区域遮罩层
    updateSelectionOverlay() {
      if (!this.selectionOverlay || this.selectedCells.length === 0) {
        this.hideSelectionOverlay();
        return;
      }

      const tableEl = this.$refs.tableRef?.$el;
      const bounds = calculateSelectionBounds(this.selectedCells, tableEl);
      if (!bounds) {
        this.hideSelectionOverlay();
        return;
      }

      Object.assign(this.selectionOverlay.style, {
        position: "absolute",
        pointerEvents: "none",
        zIndex: "10",
        backgroundColor: "rgba(24, 144, 255, 0.1)",
        border: "2px solid #1890ff",
        boxSizing: "border-box",
        display: "block",
        left: `${bounds.left}px`,
        top: `${bounds.top}px`,
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
      });

      this.overlayVisible = true;
    },

    // 隐藏选中区域遮罩层
    hideSelectionOverlay() {
      if (this.selectionOverlay) {
        this.selectionOverlay.style.display = "none";
        this.overlayVisible = false;
      }
    },

    // 复制选中单元格的值
    async copyCellsValues() {
      if (this.selectedCells.length === 0) return;

      try {
        const cellsData = this.selectedCellsData.sort((a, b) => {
          if (a.rowIndex !== b.rowIndex) return a.rowIndex - b.rowIndex;
          return a.columnIndex - b.columnIndex;
        });

        // 构建表格数据
        const rows = {};
        cellsData.forEach((cell) => {
          if (!rows[cell.rowIndex]) rows[cell.rowIndex] = {};
          rows[cell.rowIndex][cell.columnIndex] = cell.cellText || "";
        });

        // 转换为二维数组
        const tableData = [];
        const rowIndices = Object.keys(rows)
          .map(Number)
          .sort((a, b) => a - b);

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

        // 使用 Clipboard API 或降级方法
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textData);
        } else {
          fallbackCopyToClipboard(textData);
        }

        this.$emit("cells-copied", {
          cellsData,
          textData,
          selectedCells: this.selectedCells,
        });
      } catch (error) {
        console.error("复制失败:", error);
      }
    },
  },
};
