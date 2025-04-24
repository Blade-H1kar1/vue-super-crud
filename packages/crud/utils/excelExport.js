import * as XLSX from "xlsx";

/**
 * 将数据导出为Excel文件
 * @param {Array} data 要导出的数据
 * @param {Array} columns 表格列配置
 * @param {Object} options 导出选项
 * @returns {void}
 */
export function exportToExcel(data, columns, options = {}) {
  if (!data || !data.length || !columns || !columns.length) {
    console.warn("导出数据或列配置为空");
    return;
  }

  const {
    filename = "表格数据",
    sheetName = "Sheet1",
    includeHidden = false,
    onlySelected = false,
    selectedData = [],
    formatter = null,
  } = options;

  // 过滤要导出的列
  const exportColumns = columns.filter((col) => {
    // 排除不需要导出的列
    if (col.type || col.export === false) return false;
    // 排除隐藏列（如果不包含隐藏列）
    if (!includeHidden && col.hide) return false;
    return col.prop && col.label;
  });

  // 确定要导出的数据
  const exportData = onlySelected && selectedData.length ? selectedData : data;

  // 准备表头行
  const headers = exportColumns.map((col) => col.label);

  // 准备数据行
  const rows = exportData.map((row) => {
    return exportColumns.map((col) => {
      let value = row[col.prop];

      // 使用格式化函数处理值
      if (formatter && typeof formatter === "function") {
        value = formatter(value, col, row);
      } else if (col.formatter && typeof col.formatter === "function") {
        value = col.formatter(row, row, value, null);
      }

      return value !== undefined && value !== null ? value : "";
    });
  });

  // 创建工作表数据
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // 设置列宽
  const colWidths = exportColumns.map((col) => ({
    wch: Math.max(
      (col.label || "").toString().length * 2,
      col.width ? parseInt(col.width) / 8 : 10
    ),
  }));
  worksheet["!cols"] = colWidths;

  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // 导出文件
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * 获取可导出的列
 * @param {Array} columns 表格列配置
 * @param {Boolean} includeHidden 是否包含隐藏列
 * @returns {Array} 可导出的列
 */
export function getExportableColumns(columns, includeHidden = false) {
  return columns.filter((col) => {
    if (col.type || col.export === false) return false;
    if (!includeHidden && col.hide) return false;
    return col.prop && col.label;
  });
}

/**
 * 格式化导出数据
 * @param {Array} data 原始数据
 * @param {Array} columns 列配置
 * @returns {Array} 格式化后的数据
 */
export function formatExportData(data, columns) {
  if (!data || !data.length) return [];

  const exportColumns = getExportableColumns(columns);

  return data.map((row) => {
    const exportRow = {};
    exportColumns.forEach((col) => {
      let value = row[col.prop];
      if (col.formatter && typeof col.formatter === "function") {
        value = col.formatter(row, row, value, null);
      }
      exportRow[col.label] = value !== undefined && value !== null ? value : "";
    });
    return exportRow;
  });
}
