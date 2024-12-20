<template>
  <el-select
    ref="target"
    :value="currentValue"
    filterable
    v-bind="$attrs"
    :value-key="props.value"
    @input="onInput"
    v-on="listeners"
    style="width: 100%;"
  >
    <el-option
      v-for="option in _options"
      :key="option[props.value]"
      :value="option[props.value]"
      :label="option[props.label]"
      v-bind="option"
    >
    </el-option>
  </el-select>
</template>

<script>
import input from "./input";
import { create } from "core";
import { omit } from "lodash-es";
import extendMethod from "./extendMethod";
// 字典选择器
export default create({
  name: "select",
  mixins: [input, extendMethod],
  props: {
    // 值
    value: { type: [Number, String, Boolean, Array], require: false },
    // value的分隔符<br/>
    // 多选时，如果value为string，则以该分隔符分割成多个展示<br/>
    // 传入空字符串，表示不分割<br/>
    separator: { default: ",", require: false },
    multiple: { default: false },
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
      return this.options || this.scope.dict.options;
    },
    listeners() {
      return omit(this.$listeners, ["input"]);
    },
  },
  methods: {
    setValue(newVal) {
      if (!this.multiple) {
        // 单选
        if (newVal === this.currentValue) {
          return;
        }
        this.currentValue = newVal;
        return;
      }
      // 多选
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
      if (!(newVal instanceof Array)) {
        this.currentValue = [newVal];
        return;
      }

      //  TODO 重置表单时，多选的value会重置为[null]
      const val = [];
      for (const item of newVal) {
        if (item != null) {
          val.push(item);
        }
      }
      this.currentValue = val;
      if (newVal.length === 1 && newVal[0] == null) {
        this.onInput(val);
      }
    },
  },
});
</script>
