<template>
  <el-cascader
    ref="target"
    :value="currentValue"
    v-bind="$attrs"
    @input="onInput"
    v-on="listeners"
    :options="_options"
  />
</template>

<script>
import input from "./input";
import { create } from "core";
import { omit } from "lodash-es";
import extendMethod from "./extendMethod";
// 级联选择器
export default create({
  name: "cascader",
  mixins: [input, extendMethod],
  props: {
    // 值
    value: {
      default: () => {
        return [];
      },
      require: false,
    },
    scope: Object,
    options: Array,
  },
  data() {
    return {};
  },
  computed: {
    _options() {
      return this.options || this.scope.dict.options;
    },
    listeners() {
      return omit(this.$listeners, ["input"]);
    },
  },
  methods: {
    setValue(value) {
      if (value == null) {
        this.currentValue = [];
        return;
      }
      if (typeof this.value === "string") {
        this.currentValue = value.split(",");
        return;
      }
      if (value instanceof Array) {
        this.currentValue = value;
        return;
      }
      this.currentValue = [];
    },
  },
});
</script>
