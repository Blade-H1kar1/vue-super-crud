// TODO: 暴露外部方法
export default {
  methods: {
    resetBatchEdit() {
      this.$refs.menuBar && this.$refs.menuBar.resetBatchEdit();
    },
    handleSearch() {
      this.$refs.searchRef.handleSearch();
      this.$emit("closeSearchPopover");
    },
    resetField(prop) {
      // 通知子组件执行重置
      this.$emit("handleChild", "resetField", prop);
    },
    reset() {
      this.$refs.tableFormRef && this.$refs.tableFormRef.resetFields();
      this.$emit("reset");
    },
  },
};
