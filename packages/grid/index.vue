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
    // 自动填充模式
    autoFill: Boolean,
    // 是否填充空白单元格
    fillCell: Boolean,
    // 列宽配置
    columnWidth: {
      type: [String, Number, Array, Object],
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
        const defaultWidth = "300px";
        const width = this.columnWidth || defaultWidth;
        const columnWidth = `minmax(${setPx(width)}, 1fr)`;
        return `repeat(auto-fill, ${columnWidth})`;
      }
      // 处理固定列数模式
      return this.getFixedColumnsTemplate();
    },
  },
  methods: {
    //获取固定列数模式下的列模板
    getFixedColumnsTemplate() {
      // 数组模式：独立列宽
      if (Array.isArray(this.columnWidth)) {
        return this.buildIndependentColumnsTemplate();
      }

      // 单值模式：统一列宽（原有逻辑）
      return this.buildUniformColumnsTemplate();
    },

    // 构建独立列宽模板
    buildIndependentColumnsTemplate() {
      const widths = [];

      for (let i = 0; i < this.columns; i++) {
        const columnConfig = this.columnWidth[i];

        if (!columnConfig || columnConfig === "1fr") {
          widths.push("1fr");
        } else if (
          typeof columnConfig === "string" ||
          typeof columnConfig === "number"
        ) {
          // 简单值：直接设置宽度
          widths.push(setPx(columnConfig));
        } else if (typeof columnConfig === "object" && columnConfig !== null) {
          // 对象配置：支持 width, min, max
          widths.push(this.buildColumnTemplate(columnConfig));
        } else {
          widths.push("1fr");
        }
      }

      return widths.join(" ");
    },

    // 构建单列模板（支持最大最小宽度约束）
    buildColumnTemplate(config) {
      const { width, min, max } = config;
      if (width && !min && !max) {
        return setPx(width);
      }
      if (min || max) {
        const minWidth = min ? setPx(min) : width ? setPx(width) : "auto";
        const maxWidth = max ? setPx(max) : width ? setPx(width) : "1fr";
        return `minmax(${minWidth}, ${maxWidth})`;
      }
      if (width) {
        return setPx(width);
      }
      return "1fr";
    },

    // 构建统一列宽模板
    buildUniformColumnsTemplate() {
      if (this.columnWidth === "1fr") {
        return `repeat(${this.columns}, 1fr)`;
      }

      // 对象形式：支持 {min, max, width} 配置
      if (
        typeof this.columnWidth === "object" &&
        this.columnWidth !== null &&
        !Array.isArray(this.columnWidth)
      ) {
        const template = this.buildColumnTemplate(this.columnWidth);
        return `repeat(${this.columns}, ${template})`;
      }

      // 优先使用columnWidth
      if (this.columnWidth) {
        return `repeat(${this.columns}, ${setPx(this.columnWidth)})`;
      }

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
      if (typeof value === "number") {
        return `repeat(${value}, 1fr)`;
      }
      return value;
    },

    // 格式化网格区域
    formatAreas(areas) {
      if (!areas) return undefined;
      if (typeof areas === "string") return areas;
      return areas.map((area) => `"${area}"`).join(" ");
    },
  },
});
</script>

<style></style>
