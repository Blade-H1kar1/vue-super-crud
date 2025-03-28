// TODO: 暴露外部方法
export default {
  methods: {
    resetBatchEdit() {
      this.$refs.menuBar && this.$refs.menuBar.resetBatchEdit();
    },
    /**
     * 重置表单
     * @param {String} prop 列属性
     */
    resetField(prop) {
      // 通知子组件执行重置
      this.$emit("handleChild", "resetField", prop);
    },
    // 重置表单
    reset() {
      this.$refs.tableFormRef && this.$refs.tableFormRef.resetFields();
      this.$emit("reset");
    },
    /**
     * 手动排序
     * @param {Array} data 数据
     * @param {Array} props 排序字段
     */
    sortedData(data, props) {
      this._sortedData(data || this.list, props);
    },
    /**
     * 新增表格行
     * @param {Object} params 行数据参数
     * @param {String} type 新增位置类型: 'first' | 'last'
     */
    addRow(params = {}, type = "last") {
      this.handleRowAdd(params, type);
    },
    /**
     * 设置行编辑状态
     * @param {Object|Array} rows 行数据或行数据数组
     * @param {Object} options 配置选项
     * @param {String} options.type 操作类型: 'edit' | 'cancel' | 'save'
     * @param {String} options.prop 列属性(可选,用于聚焦)
     * @returns {void}
     */
    setRowEdit(rows, options = {}) {
      const { type = "edit", prop } = options;
      const rowArray = Array.isArray(rows) ? rows : [rows];

      rowArray.forEach((row) => {
        const scope = { row, $index: row.$index };
        switch (type) {
          case "edit":
            this.handleRowEdit(scope, prop);
            break;
          case "cancel":
            this.handleRowCancel(scope);
            break;
          case "save":
            this.handleRowSave(scope);
            break;
        }
      });
    },

    /**
     * 批量设置行编辑状态
     * @param {String} type 操作类型: 'edit'  | 'save' | 'cancel'
     * @param {Array} rows 行数据数组
     */
    setBatchEdit(type = "edit", rows) {
      if (type === "edit") {
        this.handleBatchRowEdit(rows);
      } else if (type === "save") {
        this.handleBatchRowSave(undefined, rows);
      } else if (type === "cancel") {
        this.handleBatchRowCancel(rows);
      }
    },
    /**
     * 设置单元格编辑状态
     * @param {Object|Array} rows 行数据或行数据数组
     * @param {String} prop 列属性
     */
    setCellEdit(row, prop) {
      if (!prop) return;
      const column = this.columnsMap[prop];
      if (!column) return;
      const scope = { row, $index: row.$index };
      this.handleCellEdit(scope, column);
    },

    // 获取当前所有处于编辑状态的行
    getEditingRows() {
      return this.editState?.getEditingRows().map((item) => item.row) || [];
    },

    // 清除所有编辑状态
    clearAllEdit() {
      this.editState?.clearAllEditStatus();
      this.resetBatchEdit();
      this.forceUpdate();
    },
  },
};
