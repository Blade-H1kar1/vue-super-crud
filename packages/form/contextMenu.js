export default {
  methods: {
    handleContextMenu(event) {
      if (this.formOptions.contextMenu === false) return;

      // 创建右键菜单项
      const menuItems = [
        {
          label: "生成测试数据",
          icon: "el-icon-magic-stick",
          onClick: () => {
            this.$emit("mock");
            this.$emit("mockData");
          },
        },
        {
          label: "重置表单",
          icon: "el-icon-refresh",
          onClick: () => this.reset(),
        },
        {
          label: "复制数据",
          icon: "el-icon-document-copy",
          onClick: async () => {
            try {
              // 只获取显示的字段数据
              const visibleData = this.trueRenderColumns.reduce(
                (acc, column) => {
                  if (!column.hidden && this.value[column.prop] !== undefined) {
                    acc[column.prop] = this.value[column.prop];
                  }
                  return acc;
                },
                {}
              );

              const jsonStr = JSON.stringify(visibleData, null, 2);
              await navigator.clipboard.writeText(jsonStr);
              this.$message.success("表单数据已复制到剪贴板");
              this.$emit("copy", jsonStr);
            } catch (error) {
              this.$message.error("复制失败：" + error.message);
            }
          },
        },
        {
          label: "粘贴数据",
          icon: "el-icon-document-add",
          onClick: async () => {
            try {
              const text = await navigator.clipboard.readText();
              let pasteData = JSON.parse(text);

              // 验证数据结构
              if (!this.validatePasteData(pasteData)) {
                this.$message.error("数据结构不匹配，请检查字段");
                return;
              }

              // 更新表单数据
              const newFormData = { ...this.value };
              this.trueRenderColumns.forEach((column) => {
                if (pasteData[column.prop] !== undefined) {
                  newFormData[column.prop] = pasteData[column.prop];
                }
              });

              this.$emit("input", newFormData);
              this.$emit("paste", newFormData);
              this.$message.success("数据导入成功");
              this.clearValidate();
            } catch (error) {
              this.$message.error("导入失败：" + error.message);
            }
          },
        },
        {
          label: `保存为草稿`,
          icon: "el-icon-plus",
          onClick: () => {
            this.$refs.draftDrawer.handleSaveDraft();
          },
        },
        {
          label: `加载最新草稿`,
          icon: "el-icon-bottom",
          onClick: () => {
            this.$refs.draftDrawer.handleLoadDraft();
          },
        },
        {
          label: `草稿箱 (${this.$refs.draftDrawer.draftNumber})`,
          icon: "el-icon-notebook-2",
          onClick: () => {
            this.$refs.draftDrawer.handleDraft();
          },
        },
      ];

      // 显示右键菜单
      this.$contextmenu({
        items: menuItems,
        event,
        customClass: "sc-form-contextmenu",
        zIndex: 3000,
        minWidth: 180,
      });
    },

    // 验证粘贴的数据是否符合表单结构
    validatePasteData(data) {
      if (!data || typeof data !== "object") {
        return false;
      }
      return this.trueRenderColumns.some(
        (column) => data[column.prop] !== undefined
      );
    },
  },
};
