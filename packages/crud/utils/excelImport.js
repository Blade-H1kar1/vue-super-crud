import * as XLSX from "xlsx";
import { uniqueId } from "lodash-es";

/**
 * 解析Excel文件
 * @param {File} file Excel文件
 * @returns {Promise<Array>} 解析后的数据
 */
export function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          // 至少需要表头和一行数据
          reject(new Error("Excel文件格式不正确或没有数据"));
          return;
        }

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 获取表头与列的映射关系
 * @param {Array} columns 表格列配置
 * @returns {Object} 表头与列属性的映射
 */
export function getHeaderColumnMap(columns) {
  const headerMap = {};
  columns.forEach((column) => {
    if (column.label && column.prop) {
      headerMap[column.label] = column.prop;
    }
  });
  return headerMap;
}

/**
 * 将Excel数据转换为表格数据
 * @param {Array} excelData Excel解析后的数据
 * @param {Object} headerMap 表头映射
 * @param {String} valueKey 行唯一标识字段
 * @param {Array} columns 表格列配置
 * @returns {Array} 转换后的表格数据
 */
export function convertExcelDataToTableData(
  excelData,
  headerMap,
  valueKey,
  columns
) {
  const headers = excelData[0]; // 第一行是表头
  const rows = excelData.slice(1); // 剩余行是数据

  return rows.map((row) => {
    const rowData = {
      [valueKey]: "temp_" + uniqueId(),
    };

    // 根据表头映射设置属性值
    headers.forEach((header, index) => {
      const prop = headerMap[header];
      if (prop) {
        rowData[prop] = row[index] !== undefined ? row[index] : "";
      }
    });

    // 设置未匹配到的列为默认值
    columns.forEach((column) => {
      if (rowData[column.prop] === undefined && column.prop) {
        rowData[column.prop] = column.initValue ?? "";
      }
    });

    return rowData;
  });
}

/**
 * 创建文件选择器并处理文件选择
 * @param {Function} callback 文件选择后的回调
 */
export function createFileInput(callback) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xlsx,.xls";
  input.style.display = "none";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      callback(file);
    }
    document.body.removeChild(input);
  };

  document.body.appendChild(input);
  input.click();
}
