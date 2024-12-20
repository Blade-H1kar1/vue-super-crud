<template>
  <el-checkbox-group
    ref="target"
    :value="currentValue"
    v-bind="$attrs"
    style="width: 100%;"
    @input="onInput"
    v-on="listeners"
  >
    <component
      :is="type"
      v-for="option in _options"
      :key="option[props.value]"
      :label="option[props.value]"
      v-bind="option"
      >{{ option[props.label] }}</component
    >
  </el-checkbox-group>
</template>

<script>
import input from "./input";
import { create } from "core";
import { omit } from "lodash-es";
import extendMethod from "./extendMethod";
// 字典radio选择器
export default create({
  name: "checkbox",
  mixins: [input, extendMethod],
  props: {
    value: { type: [Number, String, Boolean, Array], require: false },
    // value的分隔符<br/>
    // 如果value为string，则以该分隔符分割成多个展示<br/>
    // 传入空字符串，表示不分割<br/>
    separator: { default: ",", require: false },
    // 按钮类型 [el-checkbox,el-checkbox-button]
    type: {
      type: String,
      default: "el-checkbox",
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
    setValue(newVal) {
      if (newVal == null) {
        this.currentValue = [];
        return;
      }
      if (
        typeof newVal === "string" &&
        this.separator != null &&
        this.separator !== ""
      ) {
        this.currentValue = newVal.split(this.separator);
        return;
      }
      this.currentValue = newVal;
    },
  },
});
</script>
