import { toTreeArray } from "utils";
import { get } from "lodash-es";

export default {
  methods: {
    // 根据columnIndex获取对应的列配置
    getColumnByIndex(columnIndex) {
      const allColumns = [...this.defaultColumns, ...this.trueRenderColumns];
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
     * 获取树形数据中选中区域的完整节点信息
     * @param {Array} selectedCells - 选中的单元格数组
     * @returns {Array} 包含树形信息的选中数据
     */
    getSelectedInfo(selectedCells) {
      return selectedCells.map((cell) => {
        const { rowIndex, columnIndex } = cell;
        const row = this.getRowDataByIndex(rowIndex);
        const column = this.getColumnByIndex(columnIndex);
        return {
          row,
          column,
          value: get(row, column.form.prop || column.prop),
        };
      });
    },
  },
};
