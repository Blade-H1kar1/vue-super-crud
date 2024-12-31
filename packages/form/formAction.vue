<template>
  <component
    v-if="showAction"
    :class="b('action', [action.align])"
    :is="layoutCell"
    :widthSize="widthSize"
  >
    <el-form-item label-width="0px">
      <button_
        v-for="(item, index) in formActionButtons"
        :key="index"
        :size="formCtx.formOptions.size"
        :loading="formCtx.loadingStatus"
        :scope="scope"
        v-bind="item"
      ></button_>
    </el-form-item>
  </component>
</template>

<script>
import create from "core/create";
import { batchMerge } from "utils/mergeTemp";
import Cell from "../grid/cell.vue";
import button_ from "pak/button";
import { checkVisibility } from "utils";
export default create({
  name: "form",
  inject: ["formCtx"],
  components: { Cell, button_ },
  computed: {
    showAction() {
      return checkVisibility(
        this.action,
        null,
        this.formActionButtons.length > 0
      );
    },
    action() {
      return this.formCtx.formOptions.action;
    },
    scope() {
      return {
        ctx: this.formCtx,
        row: this.formCtx.value,
      };
    },
    layoutCell() {
      if (this.formCtx.formOptions.layout === "grid") {
        return "cell";
      }
      if (this.formCtx.formOptions.layout === "el-row") {
        return "el-col";
      }
    },
    widthSize() {
      if (this.action.widthSize) {
        return this.action.widthSize;
      }
      if (this.action.fill !== false) {
        return this.formCtx.formOptions.columns;
      }
      return 1;
    },
    formActionButtons() {
      const action = this.action;
      const buttons = [];
      const merges = batchMerge(
        "btn.form",
        action,
        {
          ctx: this.formCtx,
          row: this.formCtx.value,
        },
        this.formActionTemps
      );
      buttons.push(...merges);
      return buttons;
    },
    formActionTemps() {
      return {
        submit: (item, { ctx }) => ({
          label: "提交",
          icon: "el-icon-check",
          type: "primary",
          onClick: this.formCtx.submit,
        }),
        reset: (item, { ctx }) => ({
          icon: "el-icon-refresh",
          label: "重置",
          onClick: this.formCtx.reset,
        }),
      };
    },
  },
});
</script>
