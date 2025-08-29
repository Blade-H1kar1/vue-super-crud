import {
  parseCellKey,
  createCellKey,
  getCellText,
  getColumnIndexByClass,
  getCellElement,
  calculateSelectionBounds,
  getBoundaryCellFromMousePosition,
} from "../utils/cellSelectionUtils.js";
import { debounce } from "lodash-es";

const applicationType = "web application/super-crud-data";
export default {
  data() {
    return {
      // 单元格选中状态
      selectedCells: [], // 存储选中的单元格 "rowIndex-columnIndex"
      copiedCells: [], // 已复制的单元格索引信息

      // 拖拽状态
      dragState: {
        isMouseDown: false,
        isDragging: false,
        isFillDragging: false,
        justFinishedDragging: false,
        startCell: null,
        endCell: null,
        fillStartCell: null,
        fillEndCell: null,
        fillDirection: null, // 'horizontal', 'vertical', null
      },

      // 遮罩层管理
      overlays: {
        selection: { element: null, visible: false },
        copyDash: { element: null, visible: false },
        extended: { element: null, visible: false },
        fillHandle: { element: null, visible: false },
      },

      // DOM监听
      tableObserver: null,
      globalEventsAdded: false,

      // requestAnimationFrame防抖
      mouseMoveAnimationId: null,
    };
  },

  mounted() {
    this.initEvents();
    this.initOverlays();
    this.debouncedUpdateOverlays = debounce(this.updateOverlays, 50);
  },

  beforeDestroy() {
    this.cleanup();
  },

  computed: {
    // 获取选中的单元格数据
    selectedCellsData() {
      return this.selectedCells.map((cellKey) => {
        const { rowIndex, columnIndex } = parseCellKey(cellKey);
        return {
          rowIndex,
          columnIndex,
          cellKey,
        };
      });
    },

    // 获取表格容器元素
    tableWrapper() {
      const tableEl = this.getTableElement();
      return tableEl?.querySelector(".el-table__body-wrapper") || tableEl;
    },
  },

  methods: {
    // ========== 公共方法 ==========

    /**
     * 检查单元格操作权限
     * @param {String} operation - 操作类型 (copy, paste, cut, fill, select, pasteAll)
     * @returns {Boolean} 是否允许操作
     */
    checkCellOperationPermission(operation) {
      const cellOperations = this.crudOptions.cellOperations;
      
      // 如果没有配置cellOperations，使用默认值
      if (!cellOperations) {
        return operation !== 'pasteAll'; // pasteAll默认为false，其他操作默认为true
      }

      // 如果cellOperations为false，禁用所有操作
      if (cellOperations === false) {
        return false;
      }

      // 如果cellOperations为true，允许所有操作（除了pasteAll）
      if (cellOperations === true) {
        return operation !== 'pasteAll';
      }

      // 对象配置
      if (typeof cellOperations === 'object') {
        const operationConfig = cellOperations[operation];
        
        // 如果操作被明确禁用
        if (operationConfig === false) {
          return false;
        }
        
        // 如果操作被明确启用或未配置，默认允许（除了pasteAll）
        if (operationConfig === true || operationConfig === undefined) {
          return operation !== 'pasteAll';
        }
        
        // 函数配置
        if (typeof operationConfig === 'function') {
          try {
            return operationConfig({ operation });
          } catch (error) {
            console.warn(`${operation}操作权限验证函数执行错误:`, error);
            return false;
          }
        }
      }
      
      // 默认允许（除了pasteAll）
      return operation !== 'pasteAll';
    },

    // 获取表格元素
    getTableElement() {
      return this.$refs.tableRef?.$el;
    },

    // 初始化所有事件
    initEvents() {
      this.initCellSelectionEvents();
      this.initKeyboardEvents();
    },

    // 初始化所有遮罩层
    initOverlays() {
      this.createOverlay("selection");
      this.createOverlay("copyDash");
      this.createOverlay("extended");
      this.createOverlay("fillHandle");
    },

    // 清理所有资源
    cleanup() {
      this.removeAllEvents();
      this.destroyTableObserver();

      // 清理requestAnimationFrame
      if (this.mouseMoveAnimationId) {
        cancelAnimationFrame(this.mouseMoveAnimationId);
        this.mouseMoveAnimationId = null;
      }
    },

    // ========== 遮罩层管理 ==========

    // 创建遮罩层
    createOverlay(type) {
      if (this.overlays[type].element) return;
      const overlay = document.createElement("div");
      overlay.className = this.getOverlayClassName(type);

      const container = this.getOverlayContainer();
      if (container) {
        container.appendChild(overlay);
        this.overlays[type].element = overlay;

        if (type === "fillHandle") {
          this.initFillHandleEvents(overlay);
        }
      }
    },

    // 初始化填充手柄事件
    initFillHandleEvents(fillHandle) {
      if (!fillHandle) return;
      fillHandle.addEventListener("mousedown", this.handleFillHandleMouseDown);
    },

    // 获取遮罩层类名
    getOverlayClassName(type) {
      const classNames = {
        selection: "cell-selection-overlay",
        copyDash: "copy-dash-overlay",
        extended: "extended-selection-overlay",
        fillHandle: "fill-handle",
      };
      return classNames[type] || "";
    },

    // 获取遮罩层容器
    getOverlayContainer() {
      return this.tableWrapper;
    },

    // 显示遮罩层
    showOverlay(type, bounds = null) {
      const overlay = this.overlays[type];
      if (!overlay.element) return;

      if (bounds) {
        this.updateOverlayPosition(type, bounds);
      }

      overlay.element.style.display = "block";
      overlay.visible = true;
    },

    // 隐藏遮罩层
    hideOverlay(type) {
      const overlay = this.overlays[type];
      if (!overlay.element) return;

      overlay.element.style.display = "none";
      overlay.visible = false;
    },

    // 更新遮罩层位置
    updateOverlayPosition(type, bounds) {
      const overlay = this.overlays[type].element;
      if (!overlay) return;

      const { left, top, width, height } = bounds;
      overlay.style.left = left + "px";
      overlay.style.top = top + "px";
      overlay.style.width = width + "px";
      overlay.style.height = height + "px";
    },

    // ========== 事件管理 ==========

    // 移除所有事件
    removeAllEvents() {
      this.removeCellSelectionEvents();
      this.removeKeyboardEvents();
      this.removeGlobalEvents();
    },

    // 添加全局事件监听器
    addGlobalEvents() {
      if (this.globalEventsAdded) return;

      document.addEventListener("mousemove", this.handleGlobalMouseMove);
      document.addEventListener("mouseup", this.handleGlobalMouseUp);
      this.globalEventsAdded = true;
    },

    // 移除全局事件监听器
    removeGlobalEvents() {
      if (!this.globalEventsAdded) return;

      document.removeEventListener("mousemove", this.handleGlobalMouseMove);
      document.removeEventListener("mouseup", this.handleGlobalMouseUp);
      this.globalEventsAdded = false;
    },

    // 初始化单元格选中事件
    initCellSelectionEvents() {
      this.$nextTick(() => {
        const tableEl = this.$refs.tableRef?.$el;
        if (tableEl) {
          tableEl.addEventListener("mousedown", this.handleCellMouseDown);
          tableEl.style.userSelect = "none";
        }
      });
    },

    // 移除单元格选中事件
    removeCellSelectionEvents() {
      const tableEl = this.$refs.tableRef?.$el;
      if (tableEl) {
        tableEl.removeEventListener("mousedown", this.handleCellMouseDown);
        // 恢复文本选择
        tableEl.style.userSelect = "";
      }
      // 移除全局事件监听器
      this.removeGlobalEvents();
    },

    // 初始化键盘事件
    initKeyboardEvents() {
      document.addEventListener("keydown", this.handleKeyDown);
      document.addEventListener("click", this.handleDocumentClick);
    },

    // 移除键盘事件
    removeKeyboardEvents() {
      document.removeEventListener("keydown", this.handleKeyDown);
      document.removeEventListener("click", this.handleDocumentClick);
    },

    // 键盘事件处理
    handleKeyDown(event) {
      if (this.selectedCells.length === 0) return;
      // Ctrl+C 复制
      if (event.ctrlKey && event.key === "c") {
        event.preventDefault();
        this.copyCellsValues();
      }

      // Ctrl+V 粘贴
      if (event.ctrlKey && event.key === "v") {
        event.preventDefault();
        this.pasteCellsValues();
      }

      // Escape 清除选择
      if (event.key === "Escape") {
        event.preventDefault();
        this.clearCellSelection();
      }
    },

    // 文档点击事件处理
    handleDocumentClick(event) {
      // 如果正在拖拽，不处理点击事件
      if (this.dragState.isDragging || this.dragState.isMouseDown) {
        return;
      }

      // 如果是 mouseup 事件触发的点击，延迟处理以避免与拖拽结束冲突
      if (event.type === "click" && this.dragState.justFinishedDragging) {
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
        // 清除复制虚线框
        if (this.overlays.copyDash.visible) {
          this.hideOverlay("copyDash");
          this.copiedCells = [];
        }
      }
    },

    // 鼠标按下事件
    handleCellMouseDown(event) {
      // 只处理鼠标左键点击
      if (event.button !== 0) return;
      const cellInfo = this.getCellInfoFromEvent(event);
      if (!cellInfo) return;

      this.dragState.isMouseDown = true;
      this.dragState.startCell = cellInfo;

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
      const { isMouseDown, startCell } = this.dragState;
      if (!isMouseDown || !startCell) return;

      // 取消之前的动画帧
      if (this.mouseMoveAnimationId) {
        cancelAnimationFrame(this.mouseMoveAnimationId);
      }

      // 使用requestAnimationFrame进行防抖优化
      this.mouseMoveAnimationId = requestAnimationFrame(() => {
        console.log("handleGlobalMouseMove");

        const cellInfo =
          this.getCellInfoFromEvent(event) ||
          getBoundaryCellFromMousePosition(event, this.$refs.tableRef?.$el);

        if (cellInfo) {
          this.dragState.isDragging = true;
          this.dragState.endCell = cellInfo;
          this.selectCellRange(startCell, cellInfo);

          this.$emit("cell-selection-drag", {
            startCell,
            endCell: cellInfo,
            selectedCells: this.selectedCellsData,
          });
        }

        this.mouseMoveAnimationId = null;
      });
    },

    // 全局鼠标抬起事件
    handleGlobalMouseUp(event) {
      if (!this.dragState.isMouseDown) return;

      const wasDragging = this.dragState.isDragging;

      // 重置状态
      setTimeout(() => {
        this.dragState.isMouseDown = false;
        this.dragState.isDragging = false;
      }, 0);

      // 如果刚结束拖拽，设置标志防止立即触发清除逻辑
      if (wasDragging) {
        this.dragState.justFinishedDragging = true;
        // 延迟重置标志，给点击事件处理留出时间
        setTimeout(() => {
          this.dragState.justFinishedDragging = false;
        }, 10);

        this.$emit("cell-selection-end", {
          startCell: this.dragState.startCell,
          endCell: this.dragState.endCell,
          selectedCells: this.selectedCellsData,
        });
      }

      // 移除全局事件监听器
      this.removeGlobalEvents();

      // 清理拖拽状态
      this.dragState.startCell = null;
      this.dragState.endCell = null;
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

      // 提取表格元素，避免重复访问
      const tableEl = this.$refs.tableRef?.$el;

      // 获取列索引 - 通过class名称精确匹配，兼容合并单元格
      const columnIndex = getColumnIndexByClass(target, tableEl);

      return {
        rowIndex,
        columnIndex,
        element: target,
        cellKey: `${rowIndex}-${columnIndex}`,
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
      // 检查选择操作权限
      if (!this.checkCellOperationPermission('select')) {
        console.warn('选择操作被禁用');
        return;
      }

      if (!startCell || !endCell) return;

      const startRow = Math.min(startCell.rowIndex, endCell.rowIndex);
      const endRow = Math.max(startCell.rowIndex, endCell.rowIndex);
      const startCol = Math.min(startCell.columnIndex, endCell.columnIndex);
      const endCol = Math.max(startCell.columnIndex, endCell.columnIndex);

      // 清除之前的选择（如果不保持现有选择）
      if (!keepExisting) {
        this.clearCellSelection();
      }

      const tableEl = this.$refs.tableRef?.$el;

      // 选中范围内的所有单元格
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          // 通过DOM检查单元格是否存在
          const cellElement = getCellElement(tableEl, row, col);
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
      this.hideOverlay("selection");
      this.hideOverlay("fillHandle");
      this.hideOverlay("extended");

      // 触发清除选择事件
      this.$emit("cell-selection-clear");
    },

    // 更新单元格样式（使用遮罩层）
    updateCellStyles() {
      this.$nextTick(() => {
        if (this.selectedCells.length === 0) {
          this.hideOverlay("selection");
          this.hideOverlay("fillHandle");
        } else {
          this.updateOverlays();
        }

        // 检查是否需要DOM监听器
        this.checkObserverNeed();
      });
    },

    // 更新选中区域遮罩层
    updateSelectionOverlay() {
      if (this.selectedCells.length === 0) {
        this.hideOverlay("selection");
        return;
      }

      const tableEl = this.getTableElement();
      const bounds = calculateSelectionBounds(this.selectedCells, tableEl);
      if (!bounds) {
        this.hideOverlay("selection");
        return;
      }

      this.showOverlay("selection", bounds);
      this.updateFillHandle();
    },

    // 更新填充手柄位置
    updateFillHandle() {
      if (this.selectedCells.length === 0) {
        this.hideOverlay("fillHandle");
        return;
      }

      const tableEl = this.getTableElement();
      const bounds = calculateSelectionBounds(this.selectedCells, tableEl);
      if (!bounds) {
        this.hideOverlay("fillHandle");
        return;
      }

      const { left, top, width, height } = bounds;
      // 填充手柄位置在选中区域右下角
      const handleBounds = {
        left: left + width - 3,
        top: top + height - 3,
      };

      this.showOverlay("fillHandle", handleBounds);
    },

    // 将行数据转换为二维数组
    convertRowsToTableData(rows) {
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
    },

    // 复制选中单元格的值
    async copyCellsValues() {
      try {
        // 检查复制权限
        if (!this.checkCellOperationPermission('copy')) {
          console.warn('复制操作被禁用');
          return;
        }

        const cellsData = this.selectedCellsData.sort((a, b) => {
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
          const cellText = element ? getCellText(element) : "";
          textRows[rowIndex][columnIndex] = cellText;

          // 获取实际值（用于组件间复制）
          const cellValue =
            this.getCellValue(rowIndex, columnIndex) || cellText || "";

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
        const { textData } = this.convertRowsToTableData(textRows);
        const { textData: valueTextData } =
          this.convertRowsToTableData(valueTextRows);

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

        // 在复制时保存复制的单元格DOM
        this.copiedCells = [...this.selectedCells];

        // 显示复制虚线框
        const bounds = calculateSelectionBounds(this.copiedCells, tableEl);
        if (bounds) {
          this.showOverlay("copyDash", bounds);
        }

        // 检查是否需要DOM监听器
        this.checkObserverNeed();

        this.$emit("cells-copied", {
          cellsData,
          selectedCells: this.selectedCellsData,
        });
      } catch (error) {
        console.error("复制失败:", error);
      }
    },

    // 粘贴选中单元格的值
    async pasteCellsValues() {
      try {
        // 检查粘贴权限
        if (!this.checkCellOperationPermission('paste')) {
          console.warn('粘贴操作被禁用');
          return;
        }

        const { textData, isValueMode } = await this.readClipboardData();

        if (!textData) {
          console.warn("无法获取剪贴板数据");
          return;
        }

        const result = this.applyPasteData(textData, isValueMode);

        if (result?.success) {
          // 触发粘贴事件
          this.$emit("cells-pasted", {
            affectedCells: result.affectedCells,
            clipboardDimensions: result.clipboardDimensions,
            selectionBounds: result.selectionBounds,
            pasteDataCount: result.pasteDataCount,
            selectedCells: this.selectedCellsData,
          });

          // 清除复制状态
          this.hideOverlay("copyDash");
          this.copiedCells = [];

          // 更新选中区域到粘贴范围
          if (result.pasteBounds) {
            const { minRow, maxRow, minCol, maxCol } = result.pasteBounds;
            this.clearCellSelection();
            this.selectCellRange(
              { rowIndex: minRow, columnIndex: minCol },
              { rowIndex: maxRow, columnIndex: maxCol }
            );
          }
          this.$nextTick(() => {
            this.updateCellStyles();
            this.updateSelectionOverlay();
          });
        } else {
          console.error("粘贴失败:", result?.message);
        }
      } catch (error) {
        console.error("粘贴操作失败:", error);
      }
    },

    // 读取剪贴板数据
    async readClipboardData() {
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
    },

    // 初始化DOM变化监听器
    initTableObserver() {
      if (
        this.tableObserver ||
        (this.selectedCells.length === 0 && this.copiedCells.length === 0)
      ) {
        return;
      }

      this.tableObserver = new MutationObserver(() => {
        if (this.dragState.isDragging) return;
        this.$nextTick(() => {
          this.debouncedUpdateOverlays();
        });
      });

      this.$nextTick(() => {
        const tableEl = this.getTableElement();
        if (tableEl) {
          this.tableObserver.observe(tableEl, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["style", "class"],
          });
        }
      });
    },

    // 检查是否需要监听器
    checkObserverNeed() {
      const needObserver =
        this.selectedCells.length > 0 || this.copiedCells.length > 0;

      if (needObserver && !this.tableObserver) {
        // 创建监听器
        this.initTableObserver();
      } else if (!needObserver && this.tableObserver) {
        // 销毁监听器
        this.destroyTableObserver();
      }
    },

    // 销毁DOM变化监听器
    destroyTableObserver() {
      if (this.tableObserver) {
        this.tableObserver.disconnect();
        this.tableObserver = null;
      }
    },

    // 更新所有遮罩层
    updateOverlays() {
      // 更新选中框位置
      if (this.selectedCells.length > 0) {
        const tableEl = this.getTableElement();
        const bounds = calculateSelectionBounds(this.selectedCells, tableEl);
        if (bounds) {
          this.showOverlay("selection", bounds);
          this.updateFillHandle();
        }
      } else {
        this.hideOverlay("selection");
        this.hideOverlay("fillHandle");
      }

      // 更新复制框位置
      if (this.copiedCells.length > 0) {
        const tableEl = this.getTableElement();
        const bounds = calculateSelectionBounds(this.copiedCells, tableEl);
        if (bounds) {
          this.showOverlay("copyDash", bounds);
        }
      } else {
        this.hideOverlay("copyDash");
      }
    },

    // ==================== 扩展选中区域相关方法 ====================

    // 更新扩展选中区域遮罩层
    updateExtendedSelectionOverlay(originalSelectionBounds, dragEndCell) {
      if (!originalSelectionBounds || !dragEndCell) {
        this.hideOverlay("extended");
        return;
      }

      const tableEl = this.getTableElement();
      const tableWrapper = this.tableWrapper;
      const wrapperBounds = tableWrapper?.getBoundingClientRect();

      if (!wrapperBounds) {
        this.hideOverlay("extended");
        return;
      }

      // 提取常用变量
      const {
        minRow: origMinRow,
        maxRow: origMaxRow,
        minCol: origMinCol,
        maxCol: origMaxCol,
      } = originalSelectionBounds;
      const { rowIndex: dragRow, columnIndex: dragCol } = dragEndCell;

      // 计算扩展选中区域的行列范围（包含原始选中区域和拖拽结束位置）
      const extendedBounds = {
        minRow: Math.min(origMinRow, dragRow),
        maxRow: Math.max(origMaxRow, dragRow),
        minCol: Math.min(origMinCol, dragCol),
        maxCol: Math.max(origMaxCol, dragCol),
      };

      // 获取扩展区域左上角和右下角单元格的DOM元素
      const { minRow, maxRow, minCol, maxCol } = extendedBounds;
      const topLeftCell = getCellElement(tableEl, minRow, minCol);
      const bottomRightCell = getCellElement(tableEl, maxRow, maxCol);

      if (!topLeftCell || !bottomRightCell) {
        this.hideOverlay("extended");
        return;
      }

      // 获取单元格的边界信息
      const topLeftBounds = topLeftCell.getBoundingClientRect();
      const bottomRightBounds = bottomRightCell.getBoundingClientRect();
      const { left: wrapperLeft, top: wrapperTop } = wrapperBounds;

      // 获取滚动偏移量
      const scrollLeft = tableWrapper.scrollLeft;
      const scrollTop = tableWrapper.scrollTop;

      // 计算扩展选中区域的像素坐标（相对于表格容器，考虑滚动偏移量）
      const left = topLeftBounds.left - wrapperLeft + scrollLeft;
      const top = topLeftBounds.top - wrapperTop + scrollTop;
      const right = bottomRightBounds.right - wrapperLeft + scrollLeft;
      const bottom = bottomRightBounds.bottom - wrapperTop + scrollTop;

      const bounds = {
        left,
        top,
        width: right - left,
        height: bottom - top,
      };

      this.showOverlay("extended", bounds);
    },

    // ==================== 拖拽填充小方块相关方法 ====================

    // 拖拽填充小方块鼠标按下事件
    handleFillHandleMouseDown(event) {
      event.preventDefault();
      event.stopPropagation();

      // 检查填充操作权限
      if (!this.checkCellOperationPermission('fill')) {
        console.warn('填充操作被禁用');
        return;
      }

      if (this.selectedCells.length === 0) return;

      const dragState = this.dragState;

      // 设置拖拽状态
      Object.assign(dragState, {
        isFillDragging: true,
        fillStartCell: this.getSelectionBounds(),
        fillDirection: null, // 重置拖拽方向
      });

      // 确保在开始拖拽时隐藏扩展选中区域
      this.hideOverlay("extended");

      // 绑定全局事件
      document.addEventListener("mousemove", this.handleFillDragMove);
      document.addEventListener("mouseup", this.handleFillDragEnd);

      // 改变鼠标样式
      document.body.style.cursor = "crosshair";

      this.$emit("fill-drag-start", {
        startBounds: dragState.fillStartCell,
        selectedCells: this.selectedCells,
      });
    },

    // 拖拽填充移动事件
    handleFillDragMove(event) {
      const { isFillDragging, fillDirection } = this.dragState;
      if (!isFillDragging) return;

      const cellInfo =
        this.getCellInfoFromEvent(event) ||
        getBoundaryCellFromMousePosition(event, this.$refs.tableRef?.$el);

      if (cellInfo) {
        const originalSelectionBounds = this.getSelectionBounds();
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

        // 显示扩展选中区域（传入原始选中区域边界和约束后的拖拽结束单元格信息）
        this.updateExtendedSelectionOverlay(
          originalSelectionBounds,
          constrainedCellInfo
        );

        // 触发拖拽移动事件
        this.$emit("fill-drag-move", {
          startBounds: this.dragState.fillStartCell,
          endCell: constrainedCellInfo,
          selectedCells: this.selectedCells,
        });
      }
    },

    // 拖拽填充结束事件
    handleFillDragEnd(event) {
      const { isFillDragging, fillEndCell, fillDirection } = this.dragState;
      if (!isFillDragging) return;

      // 获取原始选中区域的边界
      const originalBounds = this.getSelectionBounds();
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
        const tableEl = this.$refs.tableRef?.$el;

        // 遍历填充区域内的所有单元格
        for (let row = fillStartRow; row <= fillEndRow; row++) {
          for (let col = fillStartCol; col <= fillEndCol; col++) {
            // 通过DOM检查单元格是否存在
            const cellElement = getCellElement(tableEl, row, col);
            if (cellElement) {
              const cellKey = createCellKey(row, col);
              fillCells.push({
                rowIndex: row,
                columnIndex: col,
                cellKey,
                element: cellElement,
              });
            }
          }
        }

        // 执行填充操作
        fillResult = this.performFillOperation(
          originalBounds,
          fillCells,
          fillDirection
        );

        // 输出填充结果日志
        if (!fillResult.success) {
          console.warn(`拖拽填充失败: ${fillResult.message}`);
        }
      }

      // 移除全局事件监听器
      document.removeEventListener("mousemove", this.handleFillDragMove);
      document.removeEventListener("mouseup", this.handleFillDragEnd);

      // 恢复鼠标样式
      document.body.style.cursor = "";

      // 重置拖拽状态
      Object.assign(this.dragState, {
        isFillDragging: false,
        fillStartCell: null,
        fillEndCell: null,
        fillDirection: null, // 重置拖拽方向
      });

      // 隐藏扩展选中区域
      this.hideOverlay("extended");

      // 如果填充成功，更新选中区域为整个填充区域
      if (fillResult && fillResult.success && fillCells.length > 0) {
        // 计算填充区域的边界
        const fillBounds = {
          minRow: Math.min(...fillCells.map((cell) => cell.rowIndex)),
          maxRow: Math.max(...fillCells.map((cell) => cell.rowIndex)),
          minCol: Math.min(...fillCells.map((cell) => cell.columnIndex)),
          maxCol: Math.max(...fillCells.map((cell) => cell.columnIndex)),
        };

        // 清除当前选中区域并选中整个填充区域
        this.clearCellSelection();
        this.selectCellRange(
          { rowIndex: fillBounds.minRow, columnIndex: fillBounds.minCol },
          { rowIndex: fillBounds.maxRow, columnIndex: fillBounds.maxCol }
        );

        // 更新遮罩层显示
        this.$nextTick(() => {
          this.updateCellStyles();
          this.updateSelectionOverlay();
        });
      }

      // 触发填充完成事件，包含所有填充区域的单元格信息
      this.$emit("fill-drag-end", {
        startBounds: originalBounds,
        endCell: fillEndCell,
        selectedCells: this.selectedCells,
        fillCells: fillCells,
        fillResult: fillResult,
      });
    },

    // 获取当前选中区域的边界信息
    getSelectionBounds() {
      if (this.selectedCells.length === 0) return null;

      const bounds = {
        minRow: Infinity,
        maxRow: -1,
        minCol: Infinity,
        maxCol: -1,
      };

      this.selectedCells.forEach((cellKey) => {
        const { rowIndex, columnIndex } = parseCellKey(cellKey);
        bounds.minRow = Math.min(bounds.minRow, rowIndex);
        bounds.maxRow = Math.max(bounds.maxRow, rowIndex);
        bounds.minCol = Math.min(bounds.minCol, columnIndex);
        bounds.maxCol = Math.max(bounds.maxCol, columnIndex);
      });

      return bounds;
    },

    // 执行填充操作
    performFillOperation(originalBounds, fillCells, fillDirection) {
      if (!originalBounds || !fillCells || fillCells.length === 0) {
        return { success: false, message: "填充参数无效" };
      }

      try {
        // 获取原始选中区域的数据
        const sourceData = this.getSourceDataForFill(originalBounds);
        if (!sourceData || sourceData.length === 0) {
          return { success: false, message: "源数据为空" };
        }

        // 简单值复制：生成填充数据
        const fillData = this.generateSimpleFillData(
          sourceData,
          originalBounds,
          fillCells
        );

        // 应用填充数据到目标单元格
        const applyResult = this.applyFillData(fillData);

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

    // 生成简单填充数据（值复制）
    generateSimpleFillData(sourceData, originalBounds, fillCells) {
      const fillData = [];
      const { minRow, maxRow, minCol, maxCol } = originalBounds;
      const sourceRows = maxRow - minRow + 1;
      const sourceCols = maxCol - minCol + 1;

      fillCells.forEach((cell) => {
        const { rowIndex, columnIndex } = cell;

        // 跳过原始选中区域内的单元格
        if (
          rowIndex >= minRow &&
          rowIndex <= maxRow &&
          columnIndex >= minCol &&
          columnIndex <= maxCol
        ) {
          return;
        }

        // 计算在源数据中的相对位置（循环复制）
        const sourceRowIndex = Math.abs(rowIndex - minRow) % sourceRows;
        const sourceColIndex = Math.abs(columnIndex - minCol) % sourceCols;

        // 查找对应的源数据
        const sourceCell = sourceData.find(
          (data) =>
            data.relativeRow === sourceRowIndex &&
            data.relativeCol === sourceColIndex
        );

        if (sourceCell) {
          fillData.push({
            rowIndex,
            columnIndex,
            value: sourceCell.value, // 直接复制值
            sourceValue: sourceCell.value,
            sourceRow: sourceCell.rowIndex,
            sourceCol: sourceCell.columnIndex,
          });
        }
      });

      return fillData;
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
  },
};
