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
export default create({
  inheritAttrs: false,
  name: "grid",
  props: {
    columns: {
      type: Number,
      default: 1,
    },
    columnWidth: {
      type: String,
    },
    gap: {},
    columnGap: {},
    rowGap: {},
    areas: {},
    minRowHeight: {},
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
        gridAutoFlow: this.flow, // 设置容器内元素是从左往右（默认），还是从右往左
        gridAutoRows: this.autoRows(this.minRowHeight), // grid-auto-rows设置默认单元格高度
        gridTemplateRows: this.frGetter(this.rows), // 当传递一个数字时，它是指定行数的简写，平分高度，自适应。如果是例如100px，就是以这个数值为宽度
        gridTemplateColumns: this.columnWidth
          ? `repeat(auto-fill, ${this.columnWidth})`
          : this.frGetter(this.columns), // 当传递一个数字时，它是指定列数的简写，平分宽度，自适应。 默认值为 12，如果是例如100px，就是以这个数值为宽度
        areas: this.formatAreas(this.areas), // 传递一个字符串数组，例如 [“a a”，“b c”]。 默认不提供。
        justifyContent: this.justifyContent, // 决定整个内容区域在容器里面的水平位置(左中右)
        gap: this.gap, // 设置每个子元素之间的间距
        alignContent: this.alignContent, // 决定整个内容区域的垂直位置(上中下)
      };
    },
  },
  methods: {
    autoRows(minRowHeight = "20px") {
      return `minmax(${minRowHeight}, auto)`;
    },
    frGetter(value) {
      if (!value) return;
      return typeof value === "number" ? `repeat(${value}, 1fr)` : value;
    },
    formatAreas(areas) {
      if (!areas) return;
      return areas.map((area) => `"${area}"`).join(" ");
    },
  },
});
</script>

<style></style>
