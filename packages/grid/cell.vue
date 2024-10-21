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
    widthSize: {
      type: [Number, String],
      default: 1,
    },
    heightSize: {
      type: [Number, String],
      default: 1,
    },
    area: {},
    center: {},
    left: {},
    top: {},
    center: {},
    cellStyle: {},
  },
  computed: {
    mergeStyle() {
      return {
        height: "100%",
        minWidth: 0,
        gridArea: this.area || "auto",
        gridColumnEnd: `span ${this.widthSize}`, // 使用 grid-column-end 属性设置网格元素跨越多少列，或者在哪一列结束。
        gridRowEnd: `span ${this.heightSize}`, // grid-row-start 属性指定哪一行开始显示网格元素
        gridColumnStart: this.left, // grid-column-start 属性定义了网格元素从哪一列开始
        gridRowStart: this.top, // grid-row-end 属性指定哪一行停止显示网格元素，或设置跨越多少行
        textAlign:
          this.center !== undefined && this.center !== null && "center",
        ...this.middleStyle(this.center),
        ...this.cellStyle,
        boxSizing: "border-box",
      };
    },
  },
  methods: {
    middleStyle(center) {
      if (center !== undefined && center !== null) {
        return {
          display: "inline-flex",
          flexFlow: "column wrap",
          justifyContent: "center",
          justifySelf: "stretch",
        };
      }
    },
  },
});
</script>

<style></style>
