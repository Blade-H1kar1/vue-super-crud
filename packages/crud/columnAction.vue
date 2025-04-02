<template>
  <!-- 操作栏 -->
  <el-table-column
    ref="column"
    v-if="showAction"
    v-bind="action"
    :width="width"
    :fixed="fixed"
    @hook:mounted="bindColumnConfig"
  >
    <template v-slot="scope">
      <div :class="b()" ref="actionRef">
        <button_
          v-for="(btn, index) in handleActionButtons(scope)"
          :type="btn.type || 'text'"
          :size="ctx.crudOptions.size"
          :scope="scope"
          v-bind="btn"
          :key="index"
        />
      </div>
    </template>
  </el-table-column>
</template>

<script>
import create from "core/create";
import { batchMerge } from "utils/mergeTemp";
import { checkVisibility } from "utils";
import button_ from "pak/button";
import { cloneDeep, debounce } from "lodash-es";

export default create({
  name: "crud-action-column",
  components: {
    button_,
  },
  inject: ["ctx"],
  data() {
    return {
      buttonList: [],
      actionWidth: "",
    };
  },
  created() {
    const calcAutoWidth = this.calcAutoWidth;
    this.calcAutoWidth = debounce(calcAutoWidth, 0);
  },
  watch: {
    action() {
      this.bindColumnConfig();
    },
  },
  computed: {
    width() {
      if (this.action.width === "auto")
        return Math.max(this.actionWidth, this.action.defaultWidth);
      if (this.action.width) return this.action.width;
      return this.action.defaultWidth;
    },
    fixed() {
      if (this.action.fixed) return this.action.fixed;
      return this.ctx.setOptions.fixed[this.action.prop];
    },
    action() {
      const editConfig = this.ctx.editConfig;
      return {
        type: "action",
        delete: editConfig.delete,
        view: editConfig.view,
        edit: editConfig.edit,
        rowEdit: editConfig.rowEdit,
        rowSave: editConfig.rowEdit,
        rowCancel: editConfig.rowEdit,
        ...cloneDeep(this.ctx.crudOptions.action),
      };
    },
    showAction() {
      if (this.ctx.setOptions.hidden.includes(this.action.prop)) return false;
      return checkVisibility(this.action, null, this.actionButtons.length > 0);
    },
    actionButtons() {
      let buttons = [];
      const merges = batchMerge(
        "btn.crud.action",
        this.action,
        {
          ctx: this.ctx,
        },
        this.actionTemps
      );
      buttons.push(...merges);
      return buttons;
    },
    actionTemps() {
      return {
        rowEdit: (item, { ctx }) => ({
          icon: "el-icon-edit",
          label: "编辑",
          order: 9,
          disabled: (scope) => {
            return this.ctx.disabledRowEdit({
              row: scope.row,
              $index: scope.$index,
            });
          },
          innerHide: (scope) => this.isRowEditing(scope),
          onClick: (scope) => {
            this.ctx.handleRowEdit(scope);
          },
        }),
        rowSave: (item, { ctx }) => ({
          icon: "el-icon-circle-check",
          label: "保存",
          order: 10,
          innerHide: (scope) => !this.isRowEditing(scope),
          onClick: (scope) => {
            this.ctx.handleRowSave(scope);
          },
        }),
        rowCancel: (item, { ctx }) => ({
          icon: "el-icon-circle-close",
          label: "取消",
          order: 11,
          innerHide: (scope) => !this.isRowEditing(scope),
          onClick: (scope) => {
            this.ctx.handleRowCancel(scope);
          },
        }),
        view: (item, { ctx }) => ({
          icon: "el-icon-view",
          label: "查看",
          order: 8,
          onClick: (scope) => {
            this.ctx.handleView(scope);
          },
        }),
        edit: (item, { ctx }) => ({
          icon: "el-icon-edit",
          label: "编辑",
          order: 9,
          onClick: (scope) => {
            this.ctx.handleEdit(scope);
          },
        }),
        delete: (item, { ctx }) => ({
          icon: "el-icon-delete",
          label: "删除",
          order: 12,
          innerHide: (scope) =>
            this.ctx.editConfig.mode === "row" && this.isRowEditing(scope),
          onClick: (scope) => {
            this.ctx.handleDelete(scope);
          },
        }),
      };
    },
  },
  methods: {
    bindColumnConfig() {
      const columnConfig = this.$refs.column?.columnConfig;
      if (columnConfig) {
        columnConfig.col = this.action;
      }
    },
    isRowEditing(scope) {
      return this.ctx.editState.isRowEditing(scope.row);
    },
    handleActionButtons(scope) {
      let buttons = this.actionButtons;

      buttons = buttons.filter((btn) => {
        if (btn.innerHide && btn.innerHide(scope)) {
          return false;
        }
        return true;
      });

      this.ctx.buttonList[scope.$index] = this.buttonList[
        scope.$index
      ] = buttons;

      this.$nextTick(() => {
        this.calcAutoWidth();
      });
      return buttons;
    },
    calcAutoWidth() {
      if (this.action.width === "auto") {
        let width = this.actionWidth;
        let list = document.querySelectorAll(".sc-crud-action-column");
        list.forEach((ele) => {
          let childList = ele.children;
          let allWidth = 0;
          for (let i = 0; i < childList.length; i++) {
            const child = childList[i];
            allWidth += child.offsetWidth + this.action.calcWidth;
          }
          if (allWidth >= width) width = allWidth;
        });
        this.actionWidth = width;
      }
    },
  },
});
</script>
