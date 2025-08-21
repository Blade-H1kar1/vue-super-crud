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
    };
  },

  mounted() {
    this.initCellSelectionEvents();
    this.initKeyboardEvents();
  },

  beforeDestroy() {
    this.removeCellSelectionEvents();
    this.removeKeyboardEvents();
    // 确保清理全局事件监听器
    this.removeGlobalEvents();
  },

  computed: {
    // 获取选中的单元格数据
    selectedCellsData() {
      const result = [];
      this.selectedCells.forEach((cellKey) => {
        const [rowIndex, columnIndex] = cellKey.split("-").map(Number);
        const cellElement = this.getCellElement(rowIndex, columnIndex);
        if (cellElement) {
          // 获取单元格文本内容
          const cellText = this.getCellText(cellElement);
          result.push({
            rowIndex,
            columnIndex,
            element: cellElement,
            cellText,
            value: cellText,
            cellKey,
          });
        }
      });
      console.log(result, "selectedCellsData");
      return result;
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

          // // 阻止表格默认的文本选择，但允许表单元素正常交互
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

      // 选中当前单元格
      this.selectCell(cellInfo.rowIndex, cellInfo.columnIndex);

      // 绑定全局事件监听器以支持拖拽到表格外
      this.addGlobalEvents();

      // 触发单元格选中事件
      this.$emit("cell-selection-start", {
        cellInfo,
        selectedCells: this.selectedCellsData,
      });
    },

    // 全局鼠标移动事件（支持拖拽到表格外）
    handleGlobalMouseMove(event) {
      if (!this.isMouseDown || !this.dragStartCell) return;

      // 尝试从事件中获取单元格信息
      const cellInfo = this.getCellInfoFromEvent(event);

      // 如果鼠标在表格内，正常处理
      if (cellInfo) {
        this.isDragging = true;
        this.dragEndCell = cellInfo;

        // 选中拖拽范围内的所有单元格
        this.selectCellRange(this.dragStartCell, cellInfo);

        // 触发拖拽选中事件
        this.$emit("cell-selection-drag", {
          startCell: this.dragStartCell,
          endCell: cellInfo,
          selectedCells: this.selectedCellsData,
        });
      } else {
        // 如果鼠标在表格外，根据鼠标位置计算边界单元格
        const boundaryCell = this.getBoundaryCellFromMousePosition(event);
        if (boundaryCell) {
          this.isDragging = true;
          this.dragEndCell = boundaryCell;

          // 选中拖拽范围内的所有单元格
          this.selectCellRange(this.dragStartCell, boundaryCell);

          // 触发拖拽选中事件
          this.$emit("cell-selection-drag", {
            startCell: this.dragStartCell,
            endCell: boundaryCell,
            selectedCells: this.selectedCellsData,
          });
        }
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

    // 根据鼠标位置计算边界单元格（当鼠标在表格外时）
    getBoundaryCellFromMousePosition(event) {
      const tableEl = this.$refs.tableRef?.$el;
      if (!tableEl) return null;

      const tableRect = tableEl.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // 获取表格的tbody元素
      const tbody = tableEl.querySelector(".el-table__body tbody");
      if (!tbody) return null;

      const rows = tbody.querySelectorAll("tr");
      if (rows.length === 0) return null;

      // 计算目标行索引
      let targetRowIndex;
      if (mouseY < tableRect.top) {
        // 鼠标在表格上方，选择第一行
        targetRowIndex = 0;
      } else if (mouseY > tableRect.bottom) {
        // 鼠标在表格下方，选择最后一行
        targetRowIndex = rows.length - 1;
      } else {
        // 鼠标在表格垂直范围内，根据Y坐标计算行索引
        targetRowIndex = 0;
        let accumulatedHeight = tableRect.top;

        // 获取表头高度（如果存在）
        const thead = tableEl.querySelector(".el-table__header");
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
        // 鼠标在表格左侧，选择第一列
        targetColumnIndex = 0;
      } else if (mouseX > tableRect.right) {
        // 鼠标在表格右侧，选择最后一列
        targetColumnIndex = cells.length - 1;
      } else {
        // 鼠标在表格水平范围内，根据X坐标计算列索引
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

      // 使用getColumnIndexByClass获取准确的列索引
      const targetCell = cells[targetColumnIndex];
      const accurateColumnIndex = this.getColumnIndexByClass(targetCell);

      return {
        rowIndex: targetRowIndex,
        columnIndex:
          accurateColumnIndex !== -1 ? accurateColumnIndex : targetColumnIndex,
        element: targetCell,
        cellText: this.getCellText(targetCell),
      };
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
      const columnIndex = this.getColumnIndexByClass(target);

      // 获取单元格文本内容
      const cellText = this.getCellText(target);

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
      const cellKey = `${rowIndex}-${columnIndex}`;

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

      const minRow = Math.min(startCell.rowIndex, endCell.rowIndex);
      const maxRow = Math.max(startCell.rowIndex, endCell.rowIndex);
      const minCol = Math.min(startCell.columnIndex, endCell.columnIndex);
      const maxCol = Math.max(startCell.columnIndex, endCell.columnIndex);

      // 清除之前的选择（如果不保持现有选择）
      if (!keepExisting) {
        this.clearCellSelection();
      }

      // 选中范围内的所有单元格
      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          // 通过DOM检查单元格是否存在
          const cellElement = this.getCellElement(row, col);
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

    // 更新单元格样式
    updateCellStyles() {
      this.$nextTick(() => {
        const tableEl = this.$refs.tableRef?.$el;
        if (!tableEl) return;

        // 移除所有选中样式
        const allCells = tableEl.querySelectorAll(".el-table__cell");
        allCells.forEach((cell) => {
          cell.classList.remove("cell-selected");
        });

        // 添加选中样式
        this.selectedCells.forEach((cellKey) => {
          const [rowIndex, columnIndex] = cellKey.split("-").map(Number);
          const cell = this.getCellElement(rowIndex, columnIndex);
          if (cell) {
            cell.classList.add("cell-selected");
          }
        });
      });
    },

    // 获取单元格DOM元素
    getCellElement(rowIndex, columnIndex) {
      const tableEl = this.$refs.tableRef?.$el;
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
            // 在当前行中查找具有相同列class的单元格
            const cellWithClass = tr.querySelector(`.${columnClass}`);
            if (cellWithClass) {
              return cellWithClass;
            }
          }
        }
      }

      // 回退到原来的索引方法
      return tr.children[columnIndex];
    },

    // 通过class名称获取列索引，兼容合并单元格
    getColumnIndexByClass(cellElement) {
      if (!cellElement) return -1;

      // 从单元格class中提取列标识符（如 el-table_3_column_14）
      const classList = Array.from(cellElement.classList);
      const columnClass = classList.find((cls) =>
        cls.match(/^el-table_\d+_column_\d+$/)
      );

      if (!columnClass) {
        // 如果没有找到标准的列class，回退到原来的方法
        const tr = cellElement.parentElement;
        return Array.from(tr.children).indexOf(cellElement);
      }

      // 在表头中查找相同class的列，获取其索引
      const tableEl = this.$refs.tableRef?.$el;
      if (!tableEl) return -1;

      const thead = tableEl.querySelector(".el-table__header thead");
      if (!thead) return -1;

      const headerRow = thead.querySelector("tr");
      if (!headerRow) return -1;

      // 查找具有相同列class的表头单元格
      const headerCells = Array.from(headerRow.children);
      const columnIndex = headerCells.findIndex((th) =>
        th.classList.contains(columnClass)
      );

      return columnIndex >= 0 ? columnIndex : -1;
    },

    getCellText(element) {
      if (!element) return "";
      const inputs = element.querySelectorAll("input, textarea, select");

      if (inputs.length > 0) {
        const values = [];

        inputs.forEach((input) => {
          let value = "";
          if (input.type === "checkbox") {
            value = input.checked ? input.value || "✓" : "";
          } else if (input.type === "radio") {
            value = input.checked ? input.value || "已选中" : "";
          } else {
            value = input.value || "";
          }
          if (value) {
            values.push(value);
          }
        });

        if (values.length > 0) {
          return values.join("，");
        }
      }

      return (element.textContent || element.innerText || "").trim();
    },

    // 获取选中单元格的值（简化版）
    getSelectedCellsValues() {
      return this.selectedCellsData.map((cell) => ({
        row: cell.rowIndex,
        column: cell.columnIndex,
        value: cell.value,
        cellText: cell.cellText,
      }));
    },

    // 复制选中单元格的值
    copyCellsValues() {
      const values = this.getSelectedCellsValues();
      if (values.length === 0) return;

      // 创建表格格式的文本
      const rows = {};
      values.forEach((cell) => {
        if (!rows[cell.row]) rows[cell.row] = {};
        rows[cell.row][cell.column] = cell.value || "";
      });

      const sortedRows = Object.keys(rows).sort(
        (a, b) => Number(a) - Number(b)
      );
      const sortedCols = values
        .reduce((cols, cell) => {
          if (!cols.includes(cell.column)) cols.push(cell.column);
          return cols;
        }, [])
        .sort((a, b) => a - b);

      const textData = sortedRows
        .map((rowKey) => {
          return sortedCols
            .map((colKey) => rows[rowKey][colKey] || "")
            .join("\t");
        })
        .join("\n");

      // 复制到剪贴板
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(textData)
          .then(() => {
            this.$message.success("已复制到剪贴板");
          })
          .catch(() => {
            this.fallbackCopyToClipboard(textData);
          });
      } else {
        this.fallbackCopyToClipboard(textData);
      }

      // 触发复制事件
      this.$emit("cells-copied", {
        values,
        textData,
      });
    },

    // 降级复制方法
    fallbackCopyToClipboard(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        this.$message.success("已复制到剪贴板");
      } catch (err) {
        this.$message.error("复制失败");
      }

      document.body.removeChild(textArea);
    },
  },
};
