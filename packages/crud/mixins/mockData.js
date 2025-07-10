export default {
  data() {
    return {
      // 临时mock标志
      _tempMock: false,
    };
  },
  methods: {
    // 处理批量生成的数据
    handleGenerateMockData(newData, mode) {
      if (!newData || !newData.length) return;

      let resultData = [];
      let message = "";

      switch (mode) {
        case "append":
          // 追加模式：将新数据添加到现有数据后面
          resultData = [...this.list, ...newData];
          message = `成功追加 ${newData.length} 条测试数据`;
          break;

        case "replace":
          // 替换模式：用新数据替换现有数据
          resultData = [...newData];
          message = `成功替换为 ${newData.length} 条测试数据`;
          break;

        case "fill":
          // 补充空值模式：使用新数据直接替换（因为在 batchMockData.vue 中已经处理了空值填充）
          resultData = [...newData];
          message = `成功补充空值字段`;
          break;

        default:
          return;
      }

      // 触发数据变更事件
      this.updatedData(resultData);

      // 显示操作成功提示
      this.$message({
        type: "success",
        message,
      });

      // 如果是替换，清除已选择的行
      if (mode === "replace") {
        this.clearSelection();
      }

      // 刷新表格布局
      this.$nextTick(() => {
        this.refreshTable();
      });
    },
    handleCloseMockDialog() {
      if (this._tempMock) {
        this.$nextTick(() => {
          this._tempMock = false;
          // 删除临时mock数据
          this.data.shift();
        });
      }
    },
    clearMock() {
      // 过滤掉标记为$mock的数据
      const filteredData = this.list.filter((item) => !item.$mock);

      // 更新数据
      this.updatedData(filteredData);
    },
  },
};
