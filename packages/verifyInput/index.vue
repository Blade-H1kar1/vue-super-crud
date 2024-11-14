<template>
  <div :class="[b(), inputSize ? 'sc-verify-input--' + inputSize : '']">
    <input
      v-for="(code, index) in codes"
      :key="index"
      type="number"
      min="0"
      max="9"
      required
      ref="codeInput"
      v-model="codes[index]"
      @keydown="handleKeyDown(index, $event)"
      @paste="handlePaste($event)"
      :disabled="inputDisabled"
      placeholder=""
      v-bind="$attrs"
      v-on="omitListeners"
    />
  </div>
</template>

<script>
import { create } from "core";
import { omit } from "lodash-es";
export default create({
  name: "verify-input",
  inject: {
    elForm: {
      default: "",
    },
    elFormItem: {
      default: "",
    },
  },
  props: {
    length: {
      type: Number,
      default: 6,
    },
    size: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    allowLetters: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      codes: Array.from({ length: this.length }, () => ""),
      timer: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.codeInput[0].focus();
    });
  },
  watch: {
    value(val) {
      this.codes = val.split("");
    },
    codes(val) {
      this.$emit("input", val.join(""));
    },
  },
  computed: {
    omitListeners() {
      return omit(this.$listeners, ["input"]);
    },
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    inputSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
  },
  methods: {
    handleKeyDown(index, event) {
      if (event.key >= 0 && event.key <= 9) {
        this.codes.splice(index, 1, "");
        this.timer = setTimeout(() => {
          if (index < this.codes.length - 1) {
            this.$refs.codeInput[index + 1].focus();
          }
        }, 10);
      } else if (event.key === "Backspace") {
        this.timer = setTimeout(() => {
          if (index > 0) {
            this.$refs.codeInput[index - 1].focus();
          }
        }, 10);
      }
    },
    handlePaste(event) {
      event.preventDefault();
      const pastedText = event.clipboardData.getData("text");
      const numbers = pastedText
        .replace(/[^\d]/g, "")
        .split("")
        .slice(0, this.length);

      if (numbers.length > 0) {
        this.codes = Array.from(
          { length: this.length },
          (_, index) => numbers[index] || ""
        );

        // 如果输入完成，聚焦到最后一个输入框
        if (numbers.length >= this.length) {
          this.$refs.codeInput[this.length - 1].focus();
        } else {
          // 否则聚焦到下一个空输入框
          this.$refs.codeInput[numbers.length].focus();
        }
      }
    },
    focus(index = 0) {
      this.$refs.codeInput[index].focus();
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer); // 清除定时器
  },
});
</script>
