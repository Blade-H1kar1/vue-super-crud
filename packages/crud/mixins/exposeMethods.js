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
  },
};
