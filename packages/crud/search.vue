<template>
  <scForm
    :class="[b({ 'show-search': ctx.showSearch })]"
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
  name: "crud-search",
  inject: ["ctx"],
  components: { scForm },
  computed: {
    searchForm() {
      const opt = this.ctx.crudOptions.searchForm;
      return {
        ...opt,
        renderColumns: filterColumns(this.ctx.getRenderColumns("search")),
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
              onClick: this.ctx.handleSearch,
            },
            reset: {
              icon: "el-icon-refresh",
              label: "重置",
              onClick: () => this.ctx.handleReset(),
            },
          },
          slots: this.ctx.extendsScopedSlots,
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
        Object.keys(val).forEach((key) => {
          if (this.ctx.search[key] !== val[key]) {
            this.ctx.search[key] = val[key];
          }
        });
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
    if (
      (this.searchForm && this.searchForm.initShow) ||
      this.ctx.crudOptions?.expandSearch
    ) {
      this.ctx.showSearch = true;
    }
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
    resetField(prop) {
      this.$refs.searchForm.resetField(prop);
    },
    resetFields() {
      this.$refs.searchForm.resetFields();
    },
  },
});
</script>
