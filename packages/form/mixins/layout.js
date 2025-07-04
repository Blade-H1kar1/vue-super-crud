import { omit, cloneDeep } from "lodash-es";
import {
  extendsOption,
  groupBy,
  getFirstRowLastCellIndex,
  calcEmptyCount,
} from "../utils/formHelpers";

export default {
  methods: {
    // 初始化列配置
    initColumn(item, index) {
      if (item.detail) {
        item.detail = extendsOption(item, item.detail, omit(item, ["detail"]));
      }
    },

    // 根据分组配置对列进行分组
    groupBy(column) {
      return groupBy(column, this.formOptions.group);
    },

    // 刷新表单
    refreshForm() {
      const tempValue = cloneDeep(this.value);
      this.$emit("input", {});
      this.key = Math.random();
      setTimeout(() => {
        this.$emit("input", tempValue);
      }, 100);
    },

    // 计算第一行最后一个单元格的索引
    getFirstRowLastCellIndex(columns = [], columnsNumber = 1) {
      return getFirstRowLastCellIndex(columns, columnsNumber);
    },

    // 计算空单元格数量
    calcEmptyCount() {
      const getGridColumnCount = () => {
        const grid = this.$refs.gridRef.$el;
        if (!grid) return 1;
        const style = window.getComputedStyle(grid);
        const columns = style.gridTemplateColumns;
        return columns.split(" ").length;
      };

      return calcEmptyCount(this.trueRenderColumns, getGridColumnCount);
    },
  },
};
