// TODO: 暴露外部方法
export default {
  methods: {
    resetBatchEdit() {
      this.$refs.menuBar && this.$refs.menuBar.resetBatchEdit();
    },
  },
};
