<template>
  <div
    :class="b()"
    :style="{
      ...mergeStyle,
      'column-gap': columnGap,
      'row-gap': rowGap,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
import create from "core/create";
import { setPx, setPxSaveSource } from "utils";
export default create({
  inheritAttrs: false,
  name: "grid",
  props: {
    columns: {
      type: Number,
      default: 1,
    },
    autoFill: [Boolean, String],
    fillCell: Boolean,
    minColumns: Number,
    maxColumns: Number,
    columnWidth: [String, Number],
    minColumnWidth: [String, Number],
    maxColumnWidth: [String, Number],
    gap: {},
    columnGap: {},
    rowGap: {},
    areas: {},
    minRowHeight: [String, Number],
    maxRowHeight: [String, Number],
    alignContent: {},
    rows: {},
    justifyContent: {},
    flow: {},
    children: {},
    height: { default: "auto" },
  },
  computed: {
    mergeStyle() {
      return {
        display: "grid", // 布局是grid布局
        height: this.height, // 设置容器高度
        gridAutoFlow: this.fillCell ? "row dense" : this.flow, // 设置容器内元素是从左往右（默认），还是从右往左
        gridAutoRows: this.autoRows(), // grid-auto-rows设置默认单元格高度
        gridTemplateRows: this.frGetter(this.rows), // 当传递一个数字时，它是指定行数的简写，平分高度，自适应。如果是例如100px，就是以这个数值为宽度
        gridTemplateColumns: this.gridTemplateColumns,
        areas: this.formatAreas(this.areas), // 传递一个字符串数组，例如 [“a a”，“b c”]。 默认不提供。
        justifyContent: this.justifyContent, // 决定整个内容区域在容器里面的水平位置(左中右)
        gap: this.gap, // 设置每个子元素之间的间距
        alignContent: this.alignContent, // 决定整个内容区域的垂直位置(上中下)
        ...this.$attrs,
      };
    },
    gridTemplateColumns() {
      // 处理自动填充模式
      if (this.autoFill) {
        const columnWidth = this.getAutoFillColumnWidth();
        const autoFill = this.autoFill === "autoFit" ? "auto-fit" : "auto-fill";
        return this.getAutoFillTemplate(autoFill, columnWidth);
      }

      // 处理固定列数模式
      return this.getFixedColumnsTemplate();
    },
  },
  methods: {
    getAutoFillColumnWidth() {
      if (this.autoFill === "fixedWidth") {
        return setPx(this.columnWidth || "300px");
      }
      return `minmax(${setPx(this.columnWidth || "300px")}, 1fr)`;
    },
    getAutoFillTemplate(autoFill, columnWidth) {
      if (this.minColumns && this.maxColumns) {
        return `repeat(max(${this.minColumns}, min(${this.maxColumns}, ${autoFill})), ${columnWidth})`;
      }
      if (this.minColumns) {
        return `repeat(max(${this.minColumns}, ${autoFill}), ${columnWidth})`;
      }
      if (this.maxColumns) {
        return `repeat(min(${this.maxColumns}, ${autoFill}), ${columnWidth})`;
      }
      return `repeat(${autoFill}, ${columnWidth})`;
    },

    getFixedColumnsTemplate() {
      if (this.columnWidth) {
        return `repeat(${this.columns}, ${setPx(this.columnWidth)})`;
      }
      if (this.minColumnWidth && this.maxColumnWidth) {
        return `repeat(${this.columns}, minmax(${setPx(
          this.minColumnWidth
        )}, ${setPx(this.maxColumnWidth)}))`;
      }
      if (this.minColumnWidth) {
        return `repeat(${this.columns}, minmax(${setPx(
          this.minColumnWidth
        )}, 1fr))`;
      }
      if (this.maxColumnWidth) {
        return `repeat(${this.columns}, minmax(200px, ${setPx(
          this.maxColumnWidth
        )}))`;
      }
      return `repeat(${this.columns}, 1fr)`;
    },
    autoRows() {
      return `minmax(${setPx(this.minRowHeight)}, ${setPxSaveSource(
        this.maxRowHeight || "auto"
      )})`;
    },
    frGetter(value) {
      if (!value) return;
      return typeof value === "number" ? `repeat(${value}, 1fr)` : value;
    },
    formatAreas(areas) {
      if (!areas) return;
      if (typeof areas === "string") return areas;
      return areas.map((area) => `"${area}"`).join(" ");
    },
  },
});
</script>

<style></style>
