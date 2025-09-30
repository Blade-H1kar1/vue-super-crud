import { omit, pick, cloneDeep } from "lodash-es";
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
      const detail = item.detail;
      if (detail) {
        // 详情存在渲染配置时，不继承原有渲染配置
        const hasRenderConfig =
          detail.formatter || detail.comp || detail.render;
        item.detail = extendsOption(
          item,
          detail,
          hasRenderConfig
            ? pick(item, ["label", "prop", "required", "regular", "rules"])
            : omit(item, ["detail"])
        );
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
