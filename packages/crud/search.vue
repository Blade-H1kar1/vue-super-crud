<template>
  <scForm
    :class="[b('search', { 'show-search': ctx.showSearch })]"
    ref="searchForm"
    :autoFill="true"
    v-model="ctx.query"
    :options="options"
    :loading="ctx.loadingStatus"
  ></scForm>
</template>

<script>
import create from "core/create";
import scForm from "../form/index.vue";
import { merge, isFunction } from "lodash-es";
import defaultRender from "core/defaultRender";
import { filterColumns } from "utils";
export default create({
  name: "crud",
  inject: ["ctx"],
  components: { scForm },
  computed: {
    searchForm() {
      const opt = this.ctx.crudOptions.searchForm;
      return {
        ...opt,
        renderColumns: filterColumns(this.ctx.getColumns("search")),
      };
    },
    options() {
      return merge(
        {
          size: this.ctx.crudOptions.size,
          shrinkLabel: false,
          columnWidth: "300px",
          action: {
            fill: false,
            search: {
              label: "查询",
              icon: "el-icon-search",
              type: "primary",
              onClick: this.handleSearch,
            },
            reset: {
              icon: "el-icon-refresh",
              label: "重置",
              onClick: () => this.handleReset(),
            },
          },
          slots: this.ctx.$scopedSlots,
          mode: "search",
          defaultRender: (h, scope) => {
            if (isFunction(this.searchForm.defaultRender)) {
              return this.searchForm.defaultRender(h, scope);
            }
            return defaultRender.input(h, scope);
          },
        },
        this.searchForm
      );
    },
  },
  watch: {
    "ctx.query": {
      handler(val) {
        this.queryChange = true;
        this.ctx.$emit("update:search", val);
        this.$nextTick(() => {
          this.queryChange = false;
        });
      },
      deep: true,
    },
    "ctx.search": {
      handler(val) {
        if (this.queryChange) return;
        this.$nextTick(() => {
          this.ctx.query = { ...this.ctx.query, ...val };
        });
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // this.saveInitSearch();
    if (this.searchForm && this.searchForm.initShow) {
      this.ctx.showSearch = true;
    }
  },
  mounted() {
    this.ctx.$refs.searchForm = this.$refs.searchForm;
    // this.setInitSearch();
  },
  methods: {
    saveInitSearch() {
      // 保存初始搜索参数
      if (this.ctx.search) {
        this._search = { ...this.ctx.search };
      }
    },
    setInitSearch() {
      // 表单加载完成后再设置初始搜索参数，防止重置残留初始搜索参数
      if (this._search) {
        setTimeout(() => {
          Object.keys(this._search).forEach((key) => {
            this.$set(this.ctx.query, key, this._search[key]);
          });
        }, 0);
      }
    },
    handleSearch() {
      this.ctx.changeLoading(true);
      this.ctx.runBefore("search", (res) => {
        this.ctx.changeLoading();
        this.$nextTick(this.ctx.getList);
      });
    },
    handleReset(prop) {
      this.ctx.changeLoading(true);
      this.ctx.runBefore(
        "reset",
        (res) => {
          this.ctx.changeLoading();
          if (prop) {
            this.$refs.searchForm.resetField(prop);
          } else {
            this.$refs.searchForm.resetFields();
            this.searchForm.renderColumns.forEach((item) => {
              if (isFunction(item.reset)) item.reset();
            });
          }
          this.$nextTick(this.ctx.getList);
        },
        prop
      );
    },
  },
});
</script>

<style lang="scss" scoped></style>
