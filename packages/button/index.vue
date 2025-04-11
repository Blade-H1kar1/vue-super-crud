<template>
  <el-button
    v-if="getIsShow() && !attrs.children"
    :disabled="isDebounce || attrs.disabled"
    v-bind="attrs"
    :size="size"
    :class="b()"
    @click="handleClick()"
  >
    <span v-if="attrs.label">{{ attrs.label }}</span>
    <slot v-if="$slots.default"></slot>
  </el-button>
  <el-dropdown
    v-else-if="getIsShow()"
    v-bind="attrs"
    trigger="click"
    :size="size"
    :disabled="isDebounce || attrs.disabled"
  >
    <el-button
      :class="b()"
      :size="size"
      :disabled="isDebounce || attrs.disabled"
      v-bind="attrs"
      ><span v-if="attrs.label">{{ attrs.label }}</span
      ><slot v-if="$slots.default"></slot
      ><i class="el-icon-arrow-down el-icon--right"></i
    ></el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(child, idx) in attrs.children"
        @click.native="handleClick(child)"
        :key="idx"
        v-bind="child"
        >{{ child.label }}</el-dropdown-item
      >
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import { create } from "core";
import { isFunction } from "lodash-es";
export default create({
  inheritAttrs: false,
  name: "button",
  props: {
    time: {
      type: Number,
      default: 300,
    },
    size: String,
    scope: {},
    onClick: {},
    confirm: {},
    customConfirm: {},
    successBack: {},
    textSubmit: {},
    batchConfirm: {},
  },
  data() {
    return {
      isDebounce: false,
      attrs: {},
    };
  },
  watch: {
    $attrs() {
      this.attrs = this.getBindAttrs();
    },
  },
  created() {
    this.attrs = this.getBindAttrs();
  },
  methods: {
    getBindAttrs() {
      const attrs = {};
      Object.keys(this.$attrs).forEach((key) => {
        if (isFunction(this.$attrs[key])) {
          attrs[key] = this.$attrs[key](this.scope);
        } else {
          attrs[key] = this.$attrs[key];
        }
      });
      return attrs;
    },
    getIsShow() {
      const bindAttrs = this.attrs;
      if (bindAttrs.hidden) return false;
      if (bindAttrs.show === false) return false;
      return true;
    },
    handleClick(item = this) {
      this.beforeClick((...args) => {
        if (item.onClick) {
          item.onClick(this.scope, ...args);
        } else {
          this.$emit("click", ...args);
        }
        this.isDebounce = true;
        setTimeout(() => {
          this.isDebounce = false;
        }, this.time);
      }, item);
    },
    beforeClick(cb, item) {
      if (item.confirm) {
        this.handleConfirm(item.confirm, cb);
      } else if (item.customConfirm) {
        this.handleCustomConfirm(item.customConfirm, cb);
      } else if (item.successBack) {
        this.handleSuccessBack(item.successBack, cb);
      } else if (item.textSubmit) {
        this.handleFormSubmit(item.textSubmit, cb);
      } else if (item.batchConfirm) {
        this.$scDialog({
          presetType: "batchConfirm",
          ...item.batchConfirm,
        }).show(cb);
      } else {
        cb();
      }
    },
    handleConfirm(confirm, cb) {
      if (isFunction(confirm)) confirm = confirm(this.scope);
      // 处理字符串和布尔值配置
      if (confirm === true || typeof confirm === "string") {
        const message = confirm === true ? "确定要执行此操作吗？" : confirm;
        this.$confirm(message, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          cb();
        });
        return;
      }
      // 处理对象配置
      const {
        label,
        title = "提示",
        confirmButtonText = "确定",
        cancelButtonText = "取消",
        type = "warning",
      } = confirm;
      this.$confirm(label || "确定要执行此操作吗？", title, {
        confirmButtonText,
        cancelButtonText,
        type,
      }).then(() => {
        cb();
      });
    },
    handleCustomConfirm(customConfirm, cb) {
      if (isFunction(customConfirm)) customConfirm = customConfirm(this.scope);
      this.$scDialog({
        presetType: "confirmTip",
        label: customConfirm.label,
        content: customConfirm.content,
        title: customConfirm.title,
      }).show(cb);
    },
    handleSuccessBack(successBack, cb) {
      const vm = this.$scDialog({
        presetType: "successBack",
        onClick: () => {
          if (isFunction(successBack)) {
            successBack(this.scope);
            vm.hide();
          } else {
            setTimeout(() => {
              this.$router.go(-1);
              vm.hide();
            }, 50);
          }
        },
      });
      cb(() => vm.show());
    },
    handleFormSubmit(textSubmit, clickCb) {
      if (isFunction(textSubmit)) textSubmit = textSubmit(this.scope);
      this.$scDialog({
        presetType: "textSubmit",
        ...textSubmit,
        submit: clickCb,
      }).show();
    },
  },
});
</script>
