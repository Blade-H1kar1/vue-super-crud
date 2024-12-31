<template>
  <div :class="b('menuBar')">
    <div v-if="showHandleRow" :class="b('handleRow')">
      <position
        slotName="handleRow"
        :slots="ctx.$scopedSlots"
        :scope="ctx.crudOptions"
        ><button_
          v-for="(btn, index) in handleRowButtons"
          :type="btn.type || 'text'"
          :size="ctx.crudOptions.size"
          v-bind="btn"
          :key="btn.key || btn.title || index"
          :scope="ctx"
          :loading="ctx.loadingStatus"
          :disabled="ctx.crudOptions.disabled"
      /></position>
    </div>
    <div v-if="showToolbar" :class="b('toolbar')">
      <position
        slotName="toolbar"
        :slots="ctx.$scopedSlots"
        :scope="ctx.crudOptions"
        ><button_
          v-for="(btn, index) in toolbarButtons"
          :type="btn.type"
          :size="ctx.crudOptions.size"
          v-bind="btn"
          :key="btn.key || btn.title || index"
          :scope="ctx"
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
  name: "crud",
  inject: ["ctx"],
  components: { drawerColumn, button_, position },
  data() {
    return {
      isBatchEdit: false,
      showDrawer: false,
    };
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
      return {
        add: this.ctx.crudOptions.addBtn,
        rowAdd: this.ctx.crudOptions.rowAddBtn,
        batchDelete: this.ctx.crudOptions.batchDeleteBtn,
        ...handleRow,
      };
    },
    toolbar() {
      const toolbar = { ...(this.ctx.crudOptions.toolbar || {}) };
      const isBatchEdit = this.ctx.batchRowEdit || this.ctx.batchEdit;
      return {
        batchEdit: isBatchEdit,
        batchSave: isBatchEdit,
        batchCancel: isBatchEdit,
        search: this.hasSearch,
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
            this.ctx.handleAdd();
          },
        },
        batchDelete: {
          icon: "el-icon-delete",
          label: "删除",
          type: "danger",
          onClick: () => {
            this.ctx.handleBatchDelete();
          },
        },
        rowAdd: {
          icon: "el-icon-plus",
          label: "新增",
          type: "primary",
          onClick: () => {
            this.ctx.handleRowAdd();
          },
        },
      };
    },
    toolbarTemps() {
      return {
        batchEdit: {
          label: this.ctx.batchEdit ? "编辑" : "批量编辑",
          type: "primary",
          innerHide: this.isBatchEdit,
          onClick: () => {
            this.isBatchEdit = true;
            this.ctx.handleBatchRowEdit();
          },
        },
        batchSave: {
          type: "primary",
          label: "保存",
          innerHide: !this.isBatchEdit,
          onClick: () => {
            this.ctx.handleBatchRowSave(() => {
              this.isBatchEdit = false;
            });
          },
        },
        batchCancel: {
          label: "取消",
          innerHide: !this.isBatchEdit,
          onClick: () => {
            this.resetBatchEdit();
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
            this.ctx.$refs.searchRef.handleReset();
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
