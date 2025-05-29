<template>
  <div :class="b()">
    <div v-if="showHandleRow" :class="b('handleRow')" style="flex: 1;">
      <position
        slotName="handleRow"
        :slots="ctx.$scopedSlots"
        :scope="ctx.crudOptions"
        style="width: 100%;"
        ><div
          style="display: flex; width: 100%;"
          v-if="handleRowButtons.length > 0"
        >
          <button_
            v-for="(btn, index) in handleRowButtons"
            :type="btn.type"
            v-bind="btn"
            :key="btn.key || btn.title || index"
            :scope="btn.key === 'batchDelete' ? ctx.selectionRow : null"
            :loading="ctx.loadingStatus"
            :disabled="
              btn.disabled === undefined
                ? ctx.crudOptions.disabled
                : btn.disabled
            "
          /></div
      ></position>
    </div>
    <div v-if="showToolbar" :class="b('toolbar')">
      <position
        slotName="toolbar"
        :slots="ctx.$scopedSlots"
        :scope="ctx.crudOptions"
        ><button_
          v-for="(btn, index) in toolbarButtons"
          :type="btn.type"
          v-bind="btn"
          :key="btn.key || btn.title || index"
          :loading="ctx.loadingStatus"
      /></position>
    </div>
    <drawerColumn v-if="showDrawer" ref="drawerColumn" />
  </div>
</template>

<script>
import create from "core/create";
import { batchMerge } from "utils/mergeTemp";
import drawerColumn from "./drawerColumn.vue";
import button_ from "pak/button";
import position from "core/components/position";
import { checkVisibility } from "utils";
export default create({
  name: "crud-menuBar",
  inject: ["ctx"],
  components: { drawerColumn, button_, position },
  data() {
    return {
      isBatchEdit: false,
      showDrawer: false,
    };
  },
  mounted() {
    // 订阅编辑状态变更事件
    if (this.ctx.editState) {
      this.ctx.editState.on("edit-status-change", () => {
        if (!this.ctx.editConfig.batch) return;
        const editRowKeys = this.ctx.editState.getEditingRowKeys();
        if (editRowKeys.length === 0) {
          this.isBatchEdit = false;
        }
        if (editRowKeys.length === this.ctx.list.length) {
          this.isBatchEdit = true;
        }
      });
    }
  },
  computed: {
    showHandleRow() {
      return checkVisibility(this.handleRow, null, true);
    },
    showToolbar() {
      return checkVisibility(this.toolbar, null, true);
    },
    handleRow() {
      const handleRow = { ...(this.ctx.crudOptions.handleRow || {}) };
      const editConfig = this.ctx.editConfig;
      return {
        add: editConfig.add,
        rowAdd: editConfig.rowAdd,
        batchDelete: editConfig.batchDelete,
        ...handleRow,
      };
    },
    toolbar() {
      const toolbar = { ...(this.ctx.crudOptions.toolbar || {}) };
      const editConfig = this.ctx.editConfig;
      return {
        batchEdit: editConfig.batch,
        batchSave: editConfig.batch,
        batchCancel: editConfig.batch,
        search: this.hasSearch,
        // excelImport: true,
        // excelExport: true,
        zoom: true,
        refresh: true,
        reset: true,
        column: true,
        ...toolbar,
      };
    },
    hasSearch() {
      return this.ctx.trueRenderColumns.some((i) => i.search);
    },
    handleRowButtons() {
      const handleRow = this.handleRow;
      if (!handleRow) return;
      let buttons = [];

      const merges = batchMerge(
        "btn.crud.handleRow",
        handleRow,
        {
          ctx: this.ctx,
        },
        this.handleRowTemps
      );
      buttons.push(...merges);
      buttons = this.ctx.checkHiddenButtons("handleRow", buttons);
      return buttons;
    },
    toolbarButtons() {
      const toolbar = this.toolbar;
      if (!toolbar) return;
      let buttons = [];
      const merges = batchMerge(
        "btn.crud.toolbar",
        toolbar,
        {
          ctx: this.ctx,
          self: this,
        },
        this.toolbarTemps
      );
      buttons.push(...merges);
      buttons = this.ctx.checkHiddenButtons("toolbar", buttons);
      return buttons;
    },
    handleRowTemps() {
      return {
        add: {
          icon: "el-icon-plus",
          label: "新增",
          type: "primary",
          onClick: () => {
            this.ctx.handleAdd(this.ctx.editConfig.add?.addType || "last");
          },
        },
        batchDelete: {
          icon: "el-icon-delete",
          label: "删除",
          type: "danger",
          disabled: this.ctx.selectionRow.length === 0,
          onClick: () => {
            this.ctx.handleBatchDelete();
          },
        },
        rowAdd: (item, { ctx }) => ({
          icon: "el-icon-plus",
          label: "新增",
          type: "primary",
          onClick: () => {
            this.ctx.handleRowAdd(
              item.addParams && item.addParams(),
              item?.addType
            );
          },
        }),
      };
    },
    toolbarTemps() {
      return {
        batchEdit: {
          label: "批量编辑",
          type: "primary",
          innerHide: this.isBatchEdit,
          disabled:
            this.ctx.list.length === 0 ||
            (this.ctx.editConfig.batch?.isSelect &&
              this.ctx.selectionRow.length === 0),
          onClick: () => {
            this.isBatchEdit = true;
            this.ctx.handleBatchRowEdit();
          },
        },
        batchSave: {
          type: "primary",
          label: "保存",
          style: {
            marginLeft: "auto",
          },
          innerHide: !this.isBatchEdit,
          onClick: () => {
            this.ctx.handleBatchRowSave(() => {
              this.isBatchEdit = false;
            });
          },
        },
        batchCancel: {
          label: "取消",
          style: {
            marginRight: "10px",
          },
          innerHide: !this.isBatchEdit,
          onClick: () => {
            this.resetBatchEdit();
          },
        },
        excelImport: {
          icon: "el-icon-upload",
          title: "导入",
          circle: true,
          onClick: () => {
            this.ctx.showExcelImportDialog();
          },
        },
        excelExport: {
          icon: "el-icon-download",
          title: "导出",
          circle: true,
          onClick: () => {
            this.ctx.exportToExcel();
          },
        },
        zoom: {
          icon: "el-icon-full-screen",
          title: "最大化",
          circle: true,
          onClick: () => {
            this.ctx.isMaximize = !this.ctx.isMaximize;
            this.ctx.$emit("zoom");
          },
        },
        refresh: {
          icon: "el-icon-refresh",
          title: "刷新",
          circle: true,
          onClick: () => {
            this.ctx.getList();
            this.ctx.$emit("refresh");
          },
        },
        reset: {
          icon: "el-icon-refresh-right",
          title: "重置",
          circle: true,
          onClick: () => {
            this.ctx.handleReset();
          },
        },
        search: {
          icon: "el-icon-search",
          title: "查询",
          circle: true,
          onClick: () => {
            this.ctx.showSearch = !this.ctx.showSearch;
            this.ctx.loadingStatus = true;
            this.ctx.isChangeShowSearch = true;
            setTimeout(() => {
              this.ctx.loadingStatus = false;
            }, 300);
            setTimeout(() => {
              this.ctx.isChangeShowSearch = false;
            }, 500);
          },
        },
        column: {
          icon: "el-icon-set-up",
          title: "列设置",
          circle: true,
          onClick: () => {
            this.showDrawerColumn();
          },
        },
      };
    },
  },
  methods: {
    showDrawerColumn() {
      this.showDrawer = true;
      this.$nextTick(() => {
        this.$refs.drawerColumn.showDrawer();
      });
    },
    resetBatchEdit() {
      this.isBatchEdit = false;
      this.ctx.handleBatchRowCancel();
    },
  },
});
</script>
