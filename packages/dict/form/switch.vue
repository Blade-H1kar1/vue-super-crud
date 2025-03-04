<template>
  <el-switch
    ref="target"
    :value="value"
    @input="onElInput"
    :active-color="_active[props.color]"
    :active-value="_active[props.value]"
    :active-text="showText ? _active[props.label] : ''"
    :inactive-color="_inActive[props.color]"
    :inactive-value="_inActive[props.value]"
    :inactive-text="showText ? _inActive[props.label] : ''"
    v-bind="$attrs"
    v-on="listeners"
  >
  </el-switch>
</template>

<script>
import inputBase from "./input-base";
import { create } from "core";
import { omit } from "lodash-es";
import extendMethod from "./extendMethod";
// 字典switch
export default create({
  name: "switch",
  mixins: [inputBase, extendMethod],
  props: {
    value: { require: false },
    scope: Object,
    options: Array,
    props: {
      type: Object,
      default() {
        return {
          value: "value",
          label: "label",
          color: "color",
        };
      },
    },
    showText: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    _options() {
      return this.options || this.scope.dict;
    },
    _active() {
      if (this._options?.length > 0) {
        return this._options[0];
      }
      return {};
    },
    _inActive() {
      if (this._options?.length > 1) {
        return this._options[1];
      }
      return {};
    },
    listeners() {
      return omit(this.$listeners, ["input"]);
    },
  },
  methods: {
    onElInput(value) {
      this.onInput(value);
    },
  },
});
</script>
