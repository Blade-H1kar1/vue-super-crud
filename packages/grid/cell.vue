<template>
  <div :class="b()" :style="mergeStyle">
    <slot></slot>
  </div>
</template>

<script>
import create from "core/create";
export default create({
  inheritAttrs: false,
  name: "cell",
  props: {
    // 单元格宽度（跨越的列数）
    widthSize: {
      type: [Number, String],
      default: 1,
      validator: (value) => Number(value) > 0,
    },
    // 单元格高度（跨越的行数）
    heightSize: {
      type: [Number, String],
      default: 1,
      validator: (value) => Number(value) > 0,
    },
    // 网格区域名称
    area: {
      type: String,
    },
    // 是否居中显示内容
    center: {
      type: Boolean,
    },
    // 起始列位置
    left: {
      type: [Number, String],
    },
    // 起始行位置
    top: {
      type: [Number, String],
    },
    // 自定义单元格样式
    cellStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    mergeStyle() {
      // 基础样式设置
      const baseStyles = {
        height: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      };

      // 网格位置样式
      const gridStyles = this.area
        ? {
            gridArea: this.area || "auto",
          }
        : {
            gridColumnEnd: `span ${this.widthSize}`,
            gridRowEnd: `span ${this.heightSize}`,
            gridColumnStart: this.left,
            gridRowStart: this.top,
          };

      // 内容对齐样式
      const alignmentStyles = this.center
        ? {
            textAlign: "center",
            ...this.getCenterStyle(),
          }
        : {};

      return {
        ...baseStyles,
        ...gridStyles,
        ...alignmentStyles,
        ...this.$attrs, // 透传属性
        ...this.cellStyle, // 自定义样式（优先级最高）
      };
    },
  },
  methods: {
    getCenterStyle() {
      return {
        display: "inline-flex",
        flexFlow: "column wrap",
        justifyContent: "center",
        justifySelf: "stretch",
      };
    },
  },
});
</script>

<style></style>
