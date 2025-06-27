<template>
  <component
    :is="tag"
    :class="b()"
    v-scObserveVisibility="{
      onVisible: onVisible,
      rootClass: rootClass,
    }"
  >
    <template v-if="delay">
      <slot name="delay">
        <div class="sc-lazy-loading-stripe" :style="{ height: loadingHeight }">
          <span class="sc-lazy-loading-text">{{ loadingText }}</span>
        </div>
      </slot>
    </template>
    <template v-else>
      <slot />
    </template>
  </component>
</template>

<script>
import { create } from "core";
export default create({
  name: "lazy-render",
  props: {
    rootClass: String,
    tag: { type: String, default: "div" },
    loadingText: { type: String, default: "加载中..." },
    loadingHeight: { type: [String, Number], default: "40px" },
    once: { type: Boolean, default: true },
  },
  data() {
    return {
      delay: true,
      loaded: false,
    };
  },
  methods: {
    onVisible(entry, arg) {
      if (this.once && this.loaded) return;
      this.$emit("visible", entry, arg);
      this.delay = false;
      this.loaded = true;
    },
  },
});
</script>
