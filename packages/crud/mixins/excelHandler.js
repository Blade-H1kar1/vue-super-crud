// ... 现有代码 ...
import {
  parseExcel,
  getHeaderColumnMap,
  convertExcelDataToTableData,
  createFileInput,
} from "../utils/excelImport";
import { exportToExcel, formatExportData } from "../utils/excelExport";

export default {
  methods: {
    /**
     * 处理Excel导入
     * @param {File} file Excel文件
     */
    handleExcelImport(file) {
      if (!file) return;
      this.changeLoading(true);

      // 读取Excel文件
      parseExcel(file)
        .then((data) => {
          if (!data || !data.length) {
            this.$message.warning("导入的Excel文件不包含有效数据");
            this.changeLoading(false);
            return;
          }

          // 获取表头映射关系
          const headerMap = getHeaderColumnMap(this.trueRenderColumns);

          // 转换Excel数据为表格数据
          const importedRows = convertExcelDataToTableData(
            data,
            headerMap,
            this.valueKey,
            this.trueRenderColumns
          );

          // 处理导入数据
          this.processImportedData(importedRows);

          this.changeLoading(false);
        })
        .catch((error) => {
          console.error("Excel导入失败:", error);
          this.$message.error(
            "Excel导入失败: " + (error.message || "未知错误")
          );
          this.changeLoading(false);
        });
    },

    /**
     * 根据编辑模式处理导入的数据
     * @param {Array} importedRows 导入的行数据
     */
    processImportedData(importedRows) {
      if (!importedRows || !importedRows.length) return;

      this.runBefore(
        ["importExcel"],
        (data) => {
          const rows = data || importedRows;

          if (this.editConfig.mode === "row") {
            // 行编辑模式：添加所有行并设置为编辑状态
            rows.forEach((row) => {
              this.list.push(row);
              this.editState.setRowEditStatus(row, true, "add");
            });
            this.$message.success(`成功导入 ${rows.length} 条数据`);
          } else if (this.editConfig.mode === "cell") {
            // 单元格编辑模式：仅添加行
            rows.forEach((row) => {
              this.list.push(row);
            });
            this.$message.success(`成功导入 ${rows.length} 条数据`);
          } else if (this.editConfig.mode === "free") {
            // 自由编辑模式：直接添加行
            rows.forEach((row) => {
              this.list.push(row);
            });
            this.$message.success(`成功导入 ${rows.length} 条数据`);
          } else if (this.editConfig.mode === "dialog") {
            // 弹窗编辑模式：不直接添加，提示用户使用新增按钮
            this.$message.info("弹窗编辑模式下，请使用新增按钮添加数据");
          }

          setTimeout(() => {
            this.$refs.tableFormRef && this.$refs.tableFormRef.clearValidate();
          }, 0);
        },
        { rows: importedRows }
      );
    },

    /**
     * 显示Excel导入对话框
     */
    showExcelImportDialog() {
      createFileInput(this.handleExcelImport.bind(this));
    },

    /**
     * 导出表格数据到Excel
     * @param {Object} options 导出选项
     */
    exportToExcel(options = {}) {
      const defaultOptions = {
        filename: this.crudOptions.title || "表格数据",
        sheetName: "Sheet1",
        includeHidden: false,
        onlySelected: false,
        selectedData: this.selectionRow,
        formatter: null,
      };

      const exportOptions = { ...defaultOptions, ...options };

      // 运行前置钩子
      this.runBefore(
        ["exportExcel"],
        (data) => {
          const exportData = data || this.list;

          // 导出Excel
          exportToExcel(exportData, this.trueRenderColumns, exportOptions);

          // 触发导出成功事件
          this.$emit("exportSuccess", exportData);
        },
        { data: this.list, options: exportOptions }
      );
    },

    /**
     * 获取格式化后的导出数据
     * @param {Boolean} onlySelected 是否只导出选中数据
     * @returns {Array} 格式化后的数据
     */
    getExportData(onlySelected = false) {
      const data =
        onlySelected && this.selectionRow.length
          ? this.selectionRow
          : this.list;
      return formatExportData(data, this.trueRenderColumns);
    },
  },
};
