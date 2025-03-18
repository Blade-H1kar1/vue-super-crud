// TODO: 暴露外部方法
export default {
  methods: {
    resetBatchEdit() {
      this.$refs.menuBar && this.$refs.menuBar.resetBatchEdit();
    },
    resetField(prop) {
      // 通知子组件执行重置
      this.$emit("handleChild", "resetField", prop);
    },
    reset() {
      this.$refs.tableFormRef && this.$refs.tableFormRef.resetFields();
      this.$emit("reset");
    },
    sortedData() {
      this._sortedData(this.list);
    },
  },
};
