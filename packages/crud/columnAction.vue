<template>
  <!-- 操作栏 -->
  <el-table-column
    v-if="showAction"
    v-bind="action"
    :fixed="defaultFixed"
    :width="actionWidth || action.width"
    :min-width="actionMinWidth || action.minWidth"
  >
    <template v-slot="scope">
      <div :class="b('action-column')" ref="actionRef">
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
// TODO: 按钮增加 confirm字段 confirm: "确定删除？"，快捷确认操作
import create from "core/create";
import { batchMerge } from "utils/mergeTemp";
import calcColumnWidth from "./mixins/calcColumnWidth";
import button_ from "pak/button";
import { cloneDeep, debounce, isFunction } from "lodash-es";
export default create({
  name: "crud",
  components: {
    button_,
  },
  data() {
    return {};
  },
  inject: ["ctx"],
  mixins: [calcColumnWidth],
  computed: {},
  data() {
    return {
      buttonList: [],
      actionWidth: "",
      actionMinWidth: "",
    };
  },
  created() {
    const calcAutoWidth = this.calcAutoWidth;
    this.calcAutoWidth = debounce(calcAutoWidth, 100);
  },
  computed: {
    action() {
      return (
        this.ctx.crudOptions.action || {
          prop: "action",
          label: "操作",
          align: "center",
          width: "auto",
          calcWidth: 20,
          defaultMinWidth: 50,
        }
      );
    },
    showAction() {
      if (this.ctx.crudOptions.action === false) return false;
      if (this.actionButtons.length > 0) return true;
      return false;
    },
    defaultFixed() {
      if (this.action.fixed) return this.action.fixed;
      const fixed = this.ctx.setOptions.fixed;
      const hasRight = Object.keys(fixed).some((i) => fixed[i] === "right");
      return hasRight ? "right" : false;
    },
    actionButtons() {
      const action = cloneDeep(this.action);
      let buttons = [];
      if (this.ctx.rowEdit) {
        action.rowEdit = true;
        action.rowSave = true;
        action.rowCancel = true;
      }
      const merges = batchMerge(
        "btn.crud.action",
        action,
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
        rowEdit: (item, { ctx }) => {
          return {
            icon: "el-icon-edit",
            label: "编辑",
            innerHide: (scope) =>
              this.isRowEdit(scope) || this.ctx.disabledRowEdit(scope),
            onClick: (scope) => {
              this.ctx.handleRowEdit(scope);
            },
          };
        },
        rowSave: (item, { ctx }) => ({
          icon: "el-icon-circle-check",
          label: "保存",
          innerHide: (scope) =>
            !this.isRowEdit(scope) || this.ctx.disabledRowEdit(scope),
          onClick: (scope) => {
            this.ctx.handleRowSave(scope);
          },
        }),
        rowCancel: (item, { ctx }) => ({
          icon: "el-icon-circle-close",
          label: "取消",
          innerHide: (scope) =>
            !this.isRowEdit(scope) || this.ctx.disabledRowEdit(scope),
          onClick: (scope) => {
            this.ctx.handleRowCancel(scope);
          },
        }),
        view: (item, { ctx }) => ({
          icon: "el-icon-view",
          label: "查看",
          onClick: (scope) => {
            this.ctx.handleView(scope);
          },
        }),
        edit: (item, { ctx }) => {
          return {
            icon: "el-icon-edit",
            label: "编辑",
            onClick: (scope) => {
              this.ctx.handleEdit(scope);
            },
          };
        },
        delete: (item, { ctx }) => ({
          icon: "el-icon-delete",
          label: "删除",
          innerHide: (scope) => this.ctx.rowEdit && this.isRowEdit(scope),
          onClick: (scope) => {
            this.ctx.handleDelete(scope);
          },
        }),
      };
    },
  },
  methods: {
    isRowEdit(scope) {
      return scope.row.$edit || scope.row.$add;
    },
    handleActionButtons(scope) {
      let buttons = this.actionButtons;
      buttons = this.ctx.checkHiddenButtons("action", buttons, scope);
      this.ctx.buttonList[scope.$index] = this.buttonList[
        scope.$index
      ] = buttons;

      this.$nextTick(() => {
        this.calcAutoWidth();
      });
      return buttons;
    },
    calcAutoWidth() {
      if (this.action.width === "auto" || this.action.minWidth === "auto") {
        let width = this.actionWidth || this.actionMinWidth;
        let list = document.querySelectorAll(".sc-crud__action-column");
        list.forEach((ele) => {
          let childList = ele.children;
          let allWidth = 0;
          for (let i = 0; i < childList.length; i++) {
            const child = childList[i];
            allWidth += child.offsetWidth + this.action.calcWidth;
          }
          if (allWidth >= width) width = allWidth;
        });
        if (this.action.width === "auto") {
          this.actionWidth = Math.max(width, this.action.defaultMinWidth);
        } else {
          this.actionMinWidth = Math.max(width, this.action.defaultMinWidth);
        }
      }
    },
  },
});
</script>
