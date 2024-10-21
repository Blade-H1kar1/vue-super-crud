<template>
  <span :class="b()" v-if="isShow">
    <el-button
      v-if="!bindAttrs.children"
      :disabled="isDebounce || bindAttrs.disabled"
      v-bind="bindAttrs"
      :size="size"
      @click="handleClick"
    >
      <span v-if="bindAttrs.label">{{ bindAttrs.label }}</span>
    </el-button>
    <el-dropdown
      v-else
      v-bind="bindAttrs"
      trigger="click"
      :size="size"
      :disabled="isDebounce || bindAttrs.disabled"
    >
      <el-button
        :size="size"
        :disabled="isDebounce || bindAttrs.disabled"
        v-bind="bindAttrs"
        ><span v-if="bindAttrs.label">{{ bindAttrs.label }}</span
        ><i class="el-icon-arrow-down el-icon--right"></i
      ></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(child, idx) in bindAttrs.children"
          @click.native="handleChildClick(child)"
          :key="idx"
          v-bind="child"
          >{{ child.label }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>
<script>
import { create } from "core";
import { isFunction, isPlainObject } from "lodash-es";
export default create({
  inheritAttrs: false,
  name: "button",
  props: {
    time: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: "mini",
    },
    confirm: {},
    scope: {},
    onClick: {},
    successBack: {},
  },
  data() {
    return {
      isDebounce: false,
    };
  },
  computed: {
    bindAttrs() {
      const attrs = {};
      Object.keys(this.$attrs).forEach((key) => {
        if (isFunction(this.$attrs[key]) && key !== "successBack") {
          attrs[key] = this.$attrs[key](this.scope);
        } else {
          attrs[key] = this.$attrs[key];
        }
      });
      return attrs;
    },
    isShow() {
      if (this.bindAttrs.hidden === true) return false;
      if (this.bindAttrs.show === false) return false;
      return true;
    },
  },
  methods: {
    beforeClick(cb, confirm) {
      if (confirm) {
        if (typeof confirm === "string") {
          this.$confirm(confirm, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            cb();
          });
        }
        if (isPlainObject(confirm)) {
          this.$scDialog({
            presetType: "confirmTip",
            label: confirm.label,
            content: confirm.content,
          }).show(cb);
        }
      } else {
        cb();
      }
    },
    afterClick(successBack) {
      if (successBack) {
        const vm = this.$scDialog({
          presetType: "successBack",
          backClick: () => {
            if (isFunction(successBack)) {
              successBack(vm);
              vm.hide();
            } else {
              setTimeout(() => {
                this.$router.go(-1);
                vm.hide();
              }, 50);
            }
          },
        }).show();
      }
    },
    handleClick() {
      // TODO raw.onClick 获取原来的click, custom的temp合并在按钮组件中进行
      this.beforeClick(() => {
        if (this.onClick)
          this.onClick(this.scope, () => this.afterClick(this.successBack));
        this.isDebounce = true;
        setTimeout(() => {
          this.isDebounce = false;
        }, this.time);
      }, this.confirm);
    },
    handleChildClick(child) {
      this.beforeClick(() => {
        if (child.onClick)
          child.onClick(this.scope, () => this.afterClick(child.successBack));
        this.isDebounce = true;
        setTimeout(() => {
          this.isDebounce = false;
        }, this.time);
      }, child.confirm);
    },
  },
});
</script>
