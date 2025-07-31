<template>
  <div :style="{ height: '100%', width: '100%' }">
    <slot></slot>
  </div>
</template>

<script>
import { create } from "core";

export default create({
  name: "splitter-panel",
  props: {
    size: {
      type: Number,
      default: null,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 获取折叠状态的插槽内容
    getCollapsedSlot() {
      return this.$slots.collapsed;
    },
    // 获取折叠追加插槽内容
    getCollapsedAppendSlot() {
      return this.$slots['collapsed-append'];
    },
    // 检查是否有折叠插槽
    hasCollapsedSlot() {
      return !!this.$slots.collapsed;
    },
    // 检查是否有折叠追加插槽
    hasCollapsedAppendSlot() {
      return !!this.$slots['collapsed-append'];
    }
  }
});
</script>
