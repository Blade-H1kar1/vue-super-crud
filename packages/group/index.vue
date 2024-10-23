<template>
  <div
    v-if="!hidden"
    :class="[b({ header: !isHeader, arrow: disabled, border: border })]"
  >
    <slot name="tabs" />
    <el-collapse v-model="activeName" :value="text" @change="handleChange">
      <el-collapse-item :name="1" :disabled="disabled">
        <template #title>
          <div v-if="$slots.header && !hiddenHeader" :class="[b('header')]">
            <slot name="header" />
          </div>
          <div
            v-else-if="(label || icon) && !hiddenHeader"
            :class="[b('header')]"
          >
            <i v-if="icon" :class="[icon, b('icon')]" />
            <h1 v-if="label" :class="[b('title'), tag ? b('tag') : '']">
              {{ label }}
            </h1>
          </div>
        </template>
        <slot />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import create from "core/create";

export default create({
  name: "group",
  data() {
    return {
      activeName: "",
    };
  },
  props: {
    border: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hiddenHeader: {
      type: Boolean,
      default: false,
    },
    collapse: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
    },
    tag: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    text(val) {
      this.activeName = [val];
    },
  },
  computed: {
    text() {
      return this.collapse ? 1 : 0;
    },
    isHeader() {
      return (
        (this.$slots.header && !this.hiddenHeader) ||
        ((this.label || this.icon) && !this.hiddenHeader)
      );
    },
  },
  created() {
    this.activeName = [this.text];
  },
  methods: {
    handleChange(activeNames) {
      this.$emit("change", activeNames);
    },
  },
});
</script>
