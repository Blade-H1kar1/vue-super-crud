<template>
  <div :class="b('menuBar')" v-if="showHeader">
    <div :class="b('handleRow')">
      <simpleRender
        prop="handleRow"
        :render="handleRow.render"
        :item="handleRow"
        :slots="ctx.$scopedSlots"
        :scope="ctx.crudOptions"
        :positionGap="handleRow.positionGap"
        :position="true"
        ><button_
          v-for="(btn, index) in handleRowButtons"
          :type="btn.type || 'text'"
          :size="ctx.crudOptions.size"
          v-bind="btn"
          :key="btn.key || btn.title || index"
          :scope="ctx"
          :loading="ctx.loadingStatus"
          :disabled="ctx.crudOptions.disabled"
      /></simpleRender>
    </div>
    <div :class="b('toolbar')" v-if="ctx.crudOptions.toolbar !== false">
      <simpleRender
        prop="toolbar"
        :render="toolbar.render"
        :item="toolbar"
        :slots="ctx.$scopedSlots"
        :scope="ctx.crudOptions"
        :positionGap="toolbar.positionGap"
        :position="true"
      >
        <button_
          v-for="(btn, index) in toolbarButtons"
          :type="btn.type"
          :size="ctx.crudOptions.size"
          v-bind="btn"
          :key="btn.key || btn.title || index"
          :scope="ctx"
          :loading="ctx.loadingStatus"
        />
      </simpleRender>
    </div>
    <drawerColumn v-if="showDrawer" ref="drawerColumn" />
  </div>
</template>

<script>
import create from "core/create";
import { batchMerge } from "utils/mergeTemp";
import drawerColumn from "./drawerColumn.vue";
import button_ from "pak/button";
import simpleRender from "core/components/simpleRender";
// TODO 批量编辑
export default create({
  name: "crud",
  inject: ["ctx"],
  components: { drawerColumn, button_, simpleRender },
  data() {
    return {
      isBatchEdit: false,
      showDrawer: false,
    };
  },
  computed: {
    showHeader() {
      return this.handleRow || this.toolbar;
    },
    handleRow() {
      return this.ctx.crudOptions.handleRow || {};
    },
    toolbar() {
      const toolbar = { ...this.ctx.crudOptions.toolbar };
      if (this.ctx.batchRowEdit || this.ctx.batchEdit) {
        toolbar.batchEdit = true;
        toolbar.batchSave = true;
        toolbar.batchCancel = true;
      }
      if (!this.hasSearch || !this.ctx.crudOptions.searchForm) {
        toolbar.search = false;
      }
      return toolbar;
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
          label: "提交",
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
