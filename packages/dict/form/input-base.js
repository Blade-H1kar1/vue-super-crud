export default {
  props: {
    // 值
    value: {
      required: false,
    },
  },
  data() {
    return {
      // 本组件的实际value值
      // 由于value值是props参数，是不允许修改的，需要用别的值存起来
      currentValue: undefined,
    };
  },
  mounted() {
    // this.$emit('ready')
  },
  methods: {
    isValueChanged(value) {
      return this.currentValue !== value;
    },
    setValue(value) {
      // 在这里对 传入的value值做处理
      this.currentValue = value;
      this.onInput(value);
    },
    onInput(value) {
      this.$emit("input", value);
    },
  },
};
