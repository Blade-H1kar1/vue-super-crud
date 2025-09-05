import { toTreeArray } from "utils";
import { get } from "lodash-es";
import { getComponentConfig } from "core/mock/genConfig";
import { findComponentInstance } from "utils";
import { getCellElement } from "./utils.js";

export default {
  data() {
    return {
      componentConfigs: {},
    };
  },
  methods: {
    // 根据columnIndex获取对应的列配置
    getColumnByIndex(columnIndex) {
      const allColumns = this.trueRenderColumns.filter(
        (i) => !(i.hidden || this.setOptions.hidden.includes(i.prop))
      );
      return allColumns[columnIndex];
    },

    // 根据索引获取对应的数据行
    getRowDataByIndex(rowIndex) {
      if (this.isTree) {
        const flatData = toTreeArray(this.list);
        if (rowIndex < 0 || rowIndex >= flatData.length) {
          return null;
        }
        return flatData[rowIndex];
      }
      return this.list[rowIndex];
    },

    /**
     * 获取单元格的值
     * @param {number} rowIndex - 行索引
     * @param {number} columnIndex - 列索引
     * @returns {any} 单元格的值
     */
    getCellValue(rowIndex, columnIndex) {
      try {
        const row = this.getRowDataByIndex(rowIndex);
        const column = this.getColumnByIndex(columnIndex);

        if (!row || !column) {
          return null;
        }

        // 获取列的属性路径
        const prop = column?.form?.prop || column?.prop;
        if (!prop) {
          return null;
        }

        return get(row, prop);
      } catch (error) {
        console.warn(`获取单元格值失败 (${rowIndex}, ${columnIndex}):`, error);
        return null;
      }
    },

    // 设置单元格的值
    setCellValue(row, column, prop, rowIndex, columnIndex, value) {
      const tableEl = this.getTableElement();
      if (!row || !column || !prop) return false;
      const cellElement = getCellElement(tableEl, rowIndex, columnIndex);
      const componentInfo = this.analyzeComponentConfigs(cellElement);

      // 根据组件配置格式化值
      const formattedValue = this.formatValueByComponentConfig(
        value,
        componentInfo?.config
      );

      if (componentInfo?.setFormatValue) {
        this.setByProp(
          row,
          prop,
          componentInfo.setFormatValue(formattedValue, true)
        );
      } else {
        this.setByProp(row, prop, formattedValue);
      }
      return true;
    },

    // 检查粘贴权限
    checkPastePermission(row, column) {
      if (this.areaSelection?.operationType === "all") return true;
      const scope = { row, $index: row.$index };
      const { mode, disabled, isRowEdit } = this.editConfig;
      const canEdit =
        typeof column.isEdit === "function"
          ? column.isEdit(scope)
          : column.isEdit;
      if (mode === "row") {
        if (
          (isRowEdit ? isRowEdit(scope) !== false : true) &&
          canEdit !== false &&
          !disabled
        ) {
          this.setRowEdit(row);
          return true;
        } else {
          return false;
        }
      }
      if (["cell", "free"].includes(mode)) {
        if (canEdit !== false && !disabled) {
          return true;
        } else {
          return false;
        }
      }
      return canEdit && !disabled ? true : false;
    },

    // 直接设置单元格的值（不进行格式化处理，用于值模式粘贴）
    setCellValueDirect(row, column, prop, value) {
      try {
        if (!row || !column || !prop) return false;

        // 解析 JSON
        let finalValue = value;
        if (typeof value === "string" && value.trim()) {
          try {
            // 检查是否为 JSON 格式（以 { 或 [ 开头）
            const trimmedValue = value.trim();
            if (trimmedValue.startsWith("{") || trimmedValue.startsWith("[")) {
              finalValue = JSON.parse(trimmedValue);
            }
          } catch (parseError) {
            // 如果解析失败，保持原始字符串值
            finalValue = value;
          }
        }

        // 直接设置值，不进行任何格式化处理
        this.setByProp(row, prop, finalValue);
        return true;
      } catch (error) {
        console.warn(`设置单元格值失败 (${row}, ${column}):`, error);
        return false;
      }
    },

    // 根据组件配置格式化值
    formatValueByComponentConfig(value, config) {
      if (!config || value === null || value === undefined) {
        return value;
      }

      const { type, options, valueKey = "value", multiple = false } = config;

      // 如果存在 options，使用 options 进行映射
      if (options && Array.isArray(options) && options.length > 0) {
        return this.formatValueWithOptions(value, options, valueKey, multiple);
      }
      if (["input", "textarea"].includes(type)) {
        return this.formatInputValue(value, config);
      }
      return value;
    },

    // 使用 options 格式化值
    formatValueWithOptions(
      value,
      options,
      valueKey = "value",
      multiple = false
    ) {
      if (!options || !Array.isArray(options)) {
        return value;
      }

      // 处理多值情况
      if (multiple || this.isMultipleValue(value)) {
        const values = this.parseMultipleValue(value);
        const mappedValues = values.map((v) =>
          this.mapSingleValueWithOptions(v, options, valueKey)
        );
        return mappedValues;
      }

      // 处理单值情况
      return this.mapSingleValueWithOptions(value, options, valueKey);
    },

    /**
     * 判断是否为多值
     * @param {any} value - 值
     * @returns {boolean} 是否为多值
     */
    isMultipleValue(value) {
      if (Array.isArray(value)) {
        return true;
      }

      if (typeof value === "string") {
        // 检查是否包含分隔符（逗号、分号、竖线等）
        return /[,;|]/.test(value.trim());
      }

      return false;
    },

    /**
     * 解析多值字符串为数组
     * @param {any} value - 值
     * @returns {Array} 值数组
     */
    parseMultipleValue(value) {
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === "string") {
        // 支持多种分隔符：逗号、分号、竖线
        return value
          .split(/[,;|]/)
          .map((v) => v.trim())
          .filter((v) => v !== "");
      }
      return [value];
    },

    /**
     * 使用 options 映射单个值
     * @param {any} value - 单个值
     * @param {Array} options - 选项数组
     * @param {string} valueKey - 值字段名
     * @returns {any} 映射后的值，如果未找到则返回原值
     */
    mapSingleValueWithOptions(value, options, valueKey = "value") {
      if (!value && value !== 0 && value !== false) {
        return value;
      }

      const strValue = String(value).trim();

      // 查找匹配的 label
      const option = options.find((opt) => {
        const label = String(opt.label || opt.text || opt.name || "");
        return label === strValue;
      });

      // 如果找到匹配的 label，返回对应的 value，否则返回原值
      return option ? option[valueKey] : value;
    },

    /**
     * 格式化 Input 组件的值
     */
    formatInputValue(value, config) {
      const strValue = String(value).trim();
      const maxlength = config.maxlength || config.maxLength || 0;
      // 根据 maxlength 限制长度
      if (maxlength && strValue.length > maxlength) {
        return strValue.substring(0, maxlength);
      }

      return strValue;
    },

    // 分析组件配置
    analyzeComponentConfigs(element) {
      // 获取组件配置的通用方法
      const getComponentInfo = (vnode) => {
        if (!vnode) return null;

        const renderInstance = findComponentInstance(
          vnode.parent?.componentInstance,
          "render"
        );
        if (!renderInstance) return null;

        return {
          config: getComponentConfig(vnode.parent),
          setFormatValue: renderInstance.setFormatValue,
        };
      };
      const cellElement = element.querySelector("[data-prop]");

      const prop = cellElement?.getAttribute("data-prop");
      if (!prop) return;

      const vnode = cellElement.__vue__?.$vnode;
      if (!vnode) return;
      if (this.componentConfigs[prop]) return this.componentConfigs[prop];
      const info = getComponentInfo(vnode);
      if (info?.config) {
        this.componentConfigs[prop] = info;
      }
      return info;
    },

    // ==================== 复制粘贴功能 ====================

    /**
     * 解析剪贴板文本数据为结构化数据
     * @param {string} clipboardText - 剪贴板文本（制表符分隔的表格数据）
     * @param {number} startRowIndex - 粘贴起始行索引
     * @param {number} startColumnIndex - 粘贴起始列索引
     * @returns {Array} 解析后的单元格数据数组
     */
    parseClipboardData(clipboardText, startRowIndex = 0, startColumnIndex = 0) {
      if (!clipboardText || typeof clipboardText !== "string") {
        return [];
      }
      const lines = clipboardText
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "");
      const parsedData = [];

      lines.forEach((line, rowOffset) => {
        const cells = line.split("\t");
        cells.forEach((cellValue, colOffset) => {
          parsedData.push({
            value: cellValue,
            rowIndex: startRowIndex + rowOffset,
            columnIndex: startColumnIndex + colOffset,
            originalRowOffset: rowOffset,
            originalColumnOffset: colOffset,
          });
        });
      });

      return parsedData;
    },

    /**
     * 计算粘贴数据的维度信息
     * @param {string} clipboardText - 剪贴板文本
     * @returns {Object} 包含行数和列数的对象
     */
    getClipboardDataDimensions(clipboardText) {
      if (!clipboardText || typeof clipboardText !== "string") {
        return { rows: 0, columns: 0 };
      }

      const lines = clipboardText
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "");
      const rows = lines.length;
      const columns =
        lines.length > 0
          ? Math.max(...lines.map((line) => line.split("\t").length))
          : 0;

      return { rows, columns };
    },

    /**
     * 根据Excel规则计算粘贴数据的重复填充
     * @param {Array} clipboardData - 解析后的剪贴板数据
     * @param {Object} clipboardDimensions - 剪贴板数据维度
     * @param {Object} selectionBounds - 选中区域边界
     * @returns {Array} 填充后的完整数据数组
     */
    calculatePasteDataWithFill(
      clipboardData,
      clipboardDimensions,
      selectionBounds
    ) {
      const { rows: clipRows, columns: clipCols } = clipboardDimensions;
      const { minRow, maxRow, minCol, maxCol } = selectionBounds;

      const selectionRows = maxRow - minRow + 1;
      const selectionCols = maxCol - minCol + 1;

      // 特殊情况：当选中区域为单格时，默认粘贴一次所有数据
      if (selectionRows === 1 && selectionCols === 1) {
        return clipboardData.map((cell) => ({
          ...cell,
          rowIndex: minRow + cell.originalRowOffset,
          columnIndex: minCol + cell.originalColumnOffset,
        }));
      }

      // 如果选中区域刚好是剪贴板数据的倍数，则进行重复填充
      const rowMultiplier =
        selectionRows % clipRows === 0 ? selectionRows / clipRows : 1;
      const colMultiplier =
        selectionCols % clipCols === 0 ? selectionCols / clipCols : 1;

      const filledData = [];

      for (let rowRepeat = 0; rowRepeat < rowMultiplier; rowRepeat++) {
        for (let colRepeat = 0; colRepeat < colMultiplier; colRepeat++) {
          clipboardData.forEach((cell) => {
            const newRowIndex =
              minRow + rowRepeat * clipRows + cell.originalRowOffset;
            const newColumnIndex =
              minCol + colRepeat * clipCols + cell.originalColumnOffset;

            // 确保不超出选中区域边界
            if (newRowIndex <= maxRow && newColumnIndex <= maxCol) {
              filledData.push({
                ...cell,
                rowIndex: newRowIndex,
                columnIndex: newColumnIndex,
              });
            }
          });
        }
      }

      return filledData;
    },

    /**
     * 获取选中区域的边界信息
     * @param {Array} selectedCells - 选中的单元格数组
     * @returns {Object|null} 边界信息对象
     */
    getSelectedCellsBounds(selectedCells) {
      if (!selectedCells || selectedCells.length === 0) {
        return null;
      }

      const rowIndices = [];
      const columnIndices = [];
      selectedCells.forEach((cell) => {
        rowIndices.push(cell.rowIndex);
        columnIndices.push(cell.columnIndex);
      });

      if (rowIndices.length === 0 || columnIndices.length === 0) {
        return {
          success: false,
          message: "无法确定选中区域边界：未找到有效的单元格索引",
        };
      }

      return {
        minRow: Math.min(...rowIndices),
        maxRow: Math.max(...rowIndices),
        minCol: Math.min(...columnIndices),
        maxCol: Math.max(...columnIndices),
      };
    },

    /**
     * 应用粘贴数据到表格
     * @param {string|Array} pasteData - 要粘贴的数据（字符串或数组）
     * @param {boolean} isValueMode - 是否为值模式（跳过格式化）
     * @returns {Object} 粘贴结果信息
     */
    applyPasteData(pasteData, isValueMode = false) {
      // 如果传入的是字符串，先解析为数组
      if (typeof pasteData === "string") {
        const selectedCells = this.selectedCells;
        const selectionBounds = this.getSelectedCellsBounds(selectedCells);

        // 解析剪贴板数据
        const clipboardData = this.parseClipboardData(
          pasteData,
          selectionBounds.minRow,
          selectionBounds.minCol
        );

        if (clipboardData.length === 0) {
          return {
            success: false,
            message: "剪贴板数据为空",
            affectedCells: [],
          };
        }

        // 计算剪贴板数据维度
        const clipboardDimensions = this.getClipboardDataDimensions(pasteData);

        // 根据Excel规则计算填充数据
        pasteData = this.calculatePasteDataWithFill(
          clipboardData,
          clipboardDimensions,
          selectionBounds
        );
      }

      const affectedCells = [];
      const errors = [];

      pasteData.forEach((cell) => {
        try {
          const { rowIndex, columnIndex, value } = cell;

          // 检查目标单元格是否在有效范围内
          if (rowIndex < 0 || columnIndex < 0) return;
          // 检查是否超出数据范围
          const row = this.getRowDataByIndex(rowIndex);
          const column = this.getColumnByIndex(columnIndex);

          const prop = column?.form?.prop || column?.prop;
          if (!column || !row) return;

          // 检查粘贴权限
          if (!this.checkPastePermission(row, column)) return;

          // 记录旧值用于撤销
          const oldValue = this.getCellValue(rowIndex, columnIndex);

          // 设置单元格值（值模式下跳过格式化）
          const success = isValueMode
            ? this.setCellValueDirect(row, column, prop, value)
            : this.setCellValue(
                row,
                column,
                prop,
                rowIndex,
                columnIndex,
                value
              );
          if (success) {
            affectedCells.push({
              rowIndex,
              columnIndex,
              oldValue,
              newValue: value,
            });
          } else {
            errors.push(`设置单元格 (${rowIndex}, ${columnIndex}) 值失败`);
          }
        } catch (error) {
          errors.push(
            `处理单元格 (${cell.rowIndex}, ${cell.columnIndex}) 时出错: ${error.message}`
          );
        }
      });

      // 计算粘贴区域的边界
      let pasteBounds = null;
      if (affectedCells.length > 0) {
        const rowIndices = affectedCells.map((cell) => cell.rowIndex);
        const columnIndices = affectedCells.map((cell) => cell.columnIndex);
        pasteBounds = {
          minRow: Math.min(...rowIndices),
          maxRow: Math.max(...rowIndices),
          minCol: Math.min(...columnIndices),
          maxCol: Math.max(...columnIndices),
        };
      }

      return {
        success: errors.length === 0,
        message: errors.length > 0 ? errors.join("; ") : "粘贴成功",
        affectedCells,
        errors,
        pasteBounds,
      };
    },

    /**
     * 从剪贴板读取数据
     * @returns {Promise<string>} 剪贴板文本内容
     */
    async readFromClipboard() {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          return await navigator.clipboard.readText();
        } else {
          // 降级方案：提示用户手动粘贴
          throw new Error(
            "当前环境不支持自动读取剪贴板，请使用 Ctrl+V 手动粘贴"
          );
        }
      } catch (error) {
        console.warn("读取剪贴板失败:", error);
        throw error;
      }
    },

    /**
     * 完整的粘贴处理流程
     * @param {string} clipboardText - 剪贴板文本（可选，如果不提供则自动读取）
     * @param {Array} selectedCells - 当前选中的单元格
     * @returns {Promise<Object>} 粘贴结果
     */
    async processPaste(clipboardText = null, selectedCells = null) {
      try {
        // 如果没有提供剪贴板文本，则尝试读取
        if (!clipboardText) {
          clipboardText = await this.readFromClipboard();
        }

        // 使用当前选中的单元格或传入的选中单元格
        const targetCells = selectedCells || this.selectedCells || [];
        if (targetCells.length === 0) {
          return {
            success: false,
            message: "请先选择要粘贴的目标区域",
          };
        }

        // 获取选中区域边界
        const selectionBounds = this.getSelectedCellsBounds(targetCells);
        if (!selectionBounds || selectionBounds.success === false) {
          return {
            success: false,
            message: selectionBounds?.message || "无法确定选中区域边界",
          };
        }
        // 解析剪贴板数据
        const clipboardData = this.parseClipboardData(
          clipboardText,
          selectionBounds.minRow,
          selectionBounds.minCol
        );

        if (clipboardData.length === 0) {
          return {
            success: false,
            message: "剪贴板数据为空或格式无效",
          };
        }

        // 获取剪贴板数据维度
        const clipboardDimensions =
          this.getClipboardDataDimensions(clipboardText);

        // 根据Excel规则计算填充数据
        const pasteData = this.calculatePasteDataWithFill(
          clipboardData,
          clipboardDimensions,
          selectionBounds
        );
        // 应用粘贴数据
        const result = this.applyPasteData(pasteData);

        return {
          ...result,
          clipboardDimensions,
          selectionBounds,
          pasteDataCount: pasteData.length,
        };
      } catch (error) {
        return {
          success: false,
          message: `粘贴失败: ${error.message}`,
          error,
        };
      }
    },
  },
};
