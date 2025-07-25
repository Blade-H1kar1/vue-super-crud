<template>
  <div :class="b()" :style="mergeStyle">
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
    // 列数配置
    columns: {
      type: Number,
      default: 1,
      validator: (value) => value > 0,
    },
    // 自动填充模式：true, false, 'autoFit', 'autoFill', 'fixedWidth'
    autoFill: {
      type: [Boolean, String],
      validator: (value) => {
        if (typeof value === "boolean") return true;
        return ["autoFit", "autoFill", "fixedWidth"].includes(value);
      },
    },
    // 是否填充空白单元格
    fillCell: Boolean,
    // 列宽配置
    columnWidth: {
      type: [String, Number],
    },
    // 最小列宽
    minColumnWidth: {
      type: [String, Number],
    },
    // 最大列宽
    maxColumnWidth: {
      type: [String, Number],
    },
    // 网格间隙（同时设置行列间隙）
    gap: {
      type: [String, Number],
    },
    // 列间隙
    columnGap: {
      type: [String, Number],
    },
    // 行间隙
    rowGap: {
      type: [String, Number],
    },
    // 网格区域名称
    areas: {
      type: [String, Array],
    },
    // 最小行高
    minRowHeight: {
      type: [String, Number],
    },
    // 最大行高
    maxRowHeight: {
      type: [String, Number],
    },
    // 垂直对齐方式
    alignContent: {
      type: String,
      validator: (value) =>
        [
          "start",
          "end",
          "center",
          "stretch",
          "space-around",
          "space-between",
          "space-evenly",
        ].includes(value),
    },
    // 行数配置
    rows: {
      type: [Number, String],
      description: "行数或行模板字符串",
    },
    // 水平对齐方式
    justifyContent: {
      type: String,
      validator: (value) =>
        [
          "start",
          "end",
          "center",
          "stretch",
          "space-around",
          "space-between",
          "space-evenly",
        ].includes(value),
    },
    // 网格流动方向
    flow: {
      type: String,
      validator: (value) =>
        ["row", "column", "row dense", "column dense"].includes(value),
    },
    // 容器高度
    height: {
      type: [String, Number],
      default: "auto",
    },
    // 自定义网格样式
    gridStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    mergeStyle() {
      const gapStyles = this.gap
        ? {
            columnGap: setPx(this.gap),
            rowGap: setPx(this.gap),
          }
        : {
            columnGap: this.columnGap ? setPx(this.columnGap) : undefined,
            rowGap: this.rowGap ? setPx(this.rowGap) : undefined,
          };

      return {
        display: "grid", // 布局是grid布局
        height:
          typeof this.height === "number" ? setPx(this.height) : this.height, // 设置容器高度
        gridAutoFlow: this.fillCell ? "row dense" : this.flow, // 设置容器内元素流动方向
        gridAutoRows: this.autoRows(), // 设置默认单元格高度
        gridTemplateRows: this.frGetter(this.rows), // 设置行模板
        gridTemplateColumns: this.gridTemplateColumns, // 设置列模板
        gridTemplateAreas: this.formatAreas(this.areas), // 设置网格区域
        justifyContent: this.justifyContent, // 水平对齐方式
        alignContent: this.alignContent, // 垂直对齐方式
        ...gapStyles, // 应用间隙样式
        ...this.$attrs, // 透传属性
        ...this.gridStyle, // 自定义样式（优先级最高）
      };
    },

    // 计算网格列模板
    gridTemplateColumns() {
      // 处理自动填充模式
      if (this.autoFill) {
        const columnWidth = this.getAutoFillColumnWidth();
        const autoFill = this.autoFill === "autoFit" ? "auto-fit" : "auto-fill";
        return `repeat(${autoFill}, ${columnWidth})`;
      }

      // 处理固定列数模式
      return this.getFixedColumnsTemplate();
    },
  },
  methods: {
    // 获取自动填充模式下的列宽
    getAutoFillColumnWidth() {
      const defaultWidth = "300px";
      const width = this.columnWidth || defaultWidth;

      // 固定宽度模式
      if (this.autoFill === "fixedWidth") {
        return setPx(width);
      }

      // 自适应宽度模式（默认）
      return `minmax(${setPx(width)}, 1fr)`;
    },

    //获取固定列数模式下的列模板
    getFixedColumnsTemplate() {
      // 优先使用columnWidth
      if (this.columnWidth) {
        return `repeat(${this.columns}, ${setPx(this.columnWidth)})`;
      }

      // 同时设置了最小和最大列宽
      if (this.minColumnWidth && this.maxColumnWidth) {
        return `repeat(${this.columns}, minmax(${setPx(
          this.minColumnWidth
        )}, ${setPx(this.maxColumnWidth)}))`;
      }

      // 只设置了最小列宽
      if (this.minColumnWidth) {
        return `repeat(${this.columns}, minmax(${setPx(
          this.minColumnWidth
        )}, 1fr))`;
      }

      // 只设置了最大列宽
      if (this.maxColumnWidth) {
        const defaultMinWidth = "200px";
        return `repeat(${this.columns}, minmax(${defaultMinWidth}, ${setPx(
          this.maxColumnWidth
        )}))`;
      }

      // 默认情况：平均分配空间
      return `repeat(${this.columns}, 1fr)`;
    },

    // 计算自动行高
    autoRows() {
      const minHeight = this.minRowHeight ? setPx(this.minRowHeight) : "auto";
      const maxHeight = setPxSaveSource(this.maxRowHeight || "auto");

      return `minmax(${minHeight}, ${maxHeight})`;
    },

    // 处理行数值，转换为CSS grid-template-rows值
    frGetter(value) {
      if (!value) return undefined;

      // 如果是数字，转换为重复的1fr
      if (typeof value === "number") {
        return `repeat(${value}, 1fr)`;
      }

      // 如果是字符串，直接返回
      return value;
    },

    // 格式化网格区域
    formatAreas(areas) {
      if (!areas) return undefined;

      // 如果是字符串，直接返回
      if (typeof areas === "string") return areas;

      // 如果是数组，转换为CSS格式
      return areas.map((area) => `"${area}"`).join(" ");
    },
  },
});
</script>

<style></style>
