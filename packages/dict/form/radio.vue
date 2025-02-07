<template>
  <el-radio-group
    ref="target"
    :value="currentValue"
    @input="onInput"
    @change="onChange"
    v-bind="$attrs"
    v-on="listeners"
    style="width: 100%;"
  >
    <component
      :is="type"
      v-for="option in _options"
      :key="option[props.value]"
      :label="option[props.value]"
      v-bind="option"
      >{{ option[props.label] }}</component
    >
  </el-radio-group>
</template>

<script>
import input from "./input";
import { create } from "core";
import { omit } from "lodash-es";
import extendMethod from "./extendMethod";
// 字典radio选择器
export default create({
  name: "radio",
  mixins: [input, extendMethod],
  props: {
    // 值
    value: { require: false },
    // 按钮类型 [el-radio,el-radio-button]
    type: {
      type: String,
      default: "el-radio",
    },
    scope: Object,
    options: Array,
    props: {
      type: Object,
      default() {
        return {
          value: "value",
          label: "label",
        };
      },
    },
  },
  computed: {
    _options() {
      return this.options || this.scope.dict;
    },
    listeners() {
      return omit(this.$listeners, ["input", "change"]);
    },
  },
  methods: {
    onChange(value) {
      this.$emit(
        "objectChange",
        this._options.find((i) => i[this.props.value] === value)
      );
      this.$emit("change", value);
    },
  },
});
</script>
