import { batchMerge } from "utils/mergeTemp";
import { checkVisibility, filterButtons } from "utils";
export default {
  methods: {
    contextMenuTemps() {
      return {
        quickMock: {
          label: "生成测试数据",
          icon: "el-icon-magic-stick",
          onClick: () => {
            this.$refs.batchMockData.quickGenerateData();
          },
        },
        mock: {
          label: "自定义生成测试数据",
          icon: "el-icon-magic-stick",
          onClick: () => {
            this.openMockDialog();
          },
        },
        reset: {
          label: "重置表单",
          icon: "el-icon-refresh",
          onClick: () => {
            this.$emit("handleChild", "resetField", null, true);
          },
        },
        copy: {
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
        paste: {
          label: "粘贴数据",
          icon: "el-icon-document-add",
          children: [
            {
              label: "粘贴当前",
              onClick: async () => {
                try {
                  await this.handlePasteData();
                } catch (error) {
                  this.$message.error("导入失败：" + error.message);
                }
              },
            },
            {
              label: "粘贴全部",
              onClick: async () => {
                try {
                  await this.handlePasteData(true);
                } catch (error) {
                  this.$message.error("导入失败：" + error.message);
                }
              },
            },
          ],
        },
        saveDraft: {
          label: `保存为草稿`,
          icon: "el-icon-plus",
          onClick: () => {
            this.$refs.draftDrawer.handleSaveDraft();
          },
        },
        loadDraft: {
          label: `加载最新草稿`,
          icon: "el-icon-bottom",
          children: [
            {
              label: "加载当前",
              onClick: () => {
                this.$refs.draftDrawer.handleLoadDraft();
              },
            },
            {
              label: "完整加载",
              onClick: () => {
                this.$refs.draftDrawer.handleLoadDraft(null, true);
              },
            },
          ],
        },
        draft: {
          label: `草稿箱 (${this.$refs.draftDrawer.draftNumber})`,
          icon: "el-icon-notebook-2",
          onClick: () => {
            this.$refs.draftDrawer.handleDraft();
          },
        },
      };
    },
    handleContextMenu(event) {
      if (checkVisibility(this.formOptions.contextMenu) === false) return;

      const isFormElement =
        ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName) ||
        event.target.contentEditable === "true";
      // 如果是表单元素则不拦截右键菜单
      if (isFormElement) return;
      event.preventDefault();
      // 创建右键菜单项
      const menuItems = batchMerge(
        "btn.form.contextMenu",
        this.formOptions.contextMenu,
        this.formScope,
        this.contextMenuTemps()
      );
      // 显示右键菜单
      this.$contextmenu({
        items: filterButtons(
          menuItems,
          this.formOptions,
          this.formScope,
          "contextMenu"
        ),
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
    async filterDisabledData(data) {
      const updates = {};
      if (this.isDisabled) {
        return updates;
      }

      const updatePromises = this.trueRenderColumns.map(async (column) => {
        if (data[column.prop] === undefined) return;

        // 获取字段配置
        const config = await new Promise((resolve) => {
          this.$emit("handleChild", "getComponentConfig", column.prop, resolve);
        });

        // 如果字段未禁用,则更新值
        if (!config?.disabled && !column.disabled && !column.detail) {
          updates[column.prop] = data[column.prop];
        }
      });

      await Promise.all(updatePromises);
      return updates;
    }, // 处理粘贴数据
    async handlePasteData(loadAll = false) {
      const text = await navigator.clipboard.readText();
      let pasteData = JSON.parse(text);

      // 验证数据结构
      if (!this.validatePasteData(pasteData)) {
        this.$message.error("数据结构不匹配，请检查字段");
        return;
      }

      // 更新表单数据
      const newFormData = { ...this.value };
      const updates = loadAll
        ? pasteData
        : await this.filterDisabledData(pasteData);
      Object.assign(newFormData, updates);

      this.$emit("input", newFormData);
      this.$emit("paste", newFormData);
      this.$message.success("数据导入成功");
      this.clearValidate();
    },
  },
};
