<template>
  <el-tabs
    v-if="tabList.length"
    v-model="activeName"
    @tab-click="tabClick"
    type="card"
  >
    <el-tab-pane v-if="all" label="全部" name="all"> </el-tab-pane>
    <el-tab-pane
      v-for="(item, index) in tabList"
      :key="index"
      :label="item.label || item"
      :name="(item.value || index) + ''"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  inject: ["ctx"],
  data() {
    return {
      activeName: this.all ? "all" : "0",
    };
  },
  watch: {
    activeName() {
      this.ctx.$emit(
        "update:tab",
        this.all && this.activeName == "all" ? null : this.activeName
      );
    },
    "ctx.tab": {
      handler(val) {
        this.activeName = val || (this.all && "all");
      },
      immediate: true,
    },
  },
  computed: {
    tabOptions() {
      return this.ctx.crudOptions.tabOptions || {};
    },
    all() {
      return this.tabOptions.all;
    },
    tabList() {
      return this.ctx.crudOptions.tabList || [];
    },
  },
  methods: {
    tabClick(tab, event) {
      this.ctx.$emit("tabClick", tab.name, tab, event);
      this.$nextTick(this.ctx.getList);
    },
  },
};
</script>
