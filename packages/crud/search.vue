<template>
  <div
    v-if="hasAlwaysSearch"
    ref="searchWrapper"
    :style="{
      height: searchHeight,
      overflow: 'hidden',
      transition: 'height 0.3s',
    }"
  >
    <scForm
      ref="searchForm"
      actionInLastCell
      :autoFill="true"
      v-model="ctx.query"
      :options="options"
      :loading="ctx.loadingStatus"
    ></scForm>
  </div>
  <scForm
    v-else
    :class="[b({ 'show-search': ctx.showSearch })]"
    ref="searchForm"
    actionInLastCell
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
  data() {
    return {
      searchHeight: "0px",
      delayShowSearch: false,
    };
  },
  computed: {
    hasAlwaysSearch() {
      return this.options.renderColumns.some((i) => i.alwaysShow);
    },
    searchForm() {
      const opt = this.ctx.crudOptions.searchForm;
      const renderColumns = filterColumns(this.ctx.getRenderColumns("search"));
      if (renderColumns.some((i) => i.alwaysShow)) {
        return {
          ...opt,
          renderColumns: renderColumns
            .slice()
            .sort((a, b) => {
              // alwaysShow 为 true 的排前面
              return (b.alwaysShow === true) - (a.alwaysShow === true);
            })
            .filter((i) => {
              if (this.delayShowSearch) {
                return true;
              }
              return i.alwaysShow;
            }),
        };
      }
      return {
        ...opt,
        renderColumns,
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
    if (
      (this.searchForm && this.searchForm.initShow) ||
      this.ctx.crudOptions?.expandSearch
    ) {
      this.ctx.showSearch = true;
    }
    if (this.hasAlwaysSearch) {
      this.initShowSearch();
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
    initShowSearch() {
      this.$watch(
        "ctx.showSearch",
        (val) => {
          this.$nextTick(() => {
            const el = this.$refs.searchWrapper;
            if (val) {
              this.delayShowSearch = val;
              setTimeout(() => {
                this.searchHeight = el.scrollHeight + "px";
              }, 300);
            } else {
              this.calculateCollapsedHeight();
              setTimeout(() => {
                this.delayShowSearch = val;
              }, 300);
            }
          });
        },
        {
          immediate: true,
        }
      );
    },
    // 计算一行能容纳多少个元素
    getItemsPerRow() {
      const container = this.$refs.searchWrapper.querySelector(".sc-grid");
      if (!container) return 1;

      const containerWidth = container.offsetWidth;

      const minColumnWidth = Number.parseInt(this.options.columnWidth) || 300;

      const itemsPerRow = Math.floor(containerWidth / minColumnWidth);

      return Math.max(1, itemsPerRow);
    },

    calculateCollapsedHeight() {
      const searchWrapper = this.$refs.searchWrapper;
      if (!searchWrapper) return;

      const scCells = searchWrapper.querySelectorAll(".sc-cell");
      if (scCells.length === 0) return;

      // 获取 renderColumns 中 alwaysShow 为 true 的数量
      const renderColumns = this.ctx.getRenderColumns("search");
      const alwaysShowCount = renderColumns.filter((col) => col.alwaysShow)
        .length;

      // 计算一行能容纳多少个元素
      const itemsPerRow = this.getItemsPerRow();
      const actionCount = 1; // 按钮元素

      // 计算需要展示的行数
      const rowsNeeded = Math.ceil(
        (alwaysShowCount + actionCount) / itemsPerRow
      );

      // 获取单个 .sc-cell 元素的高度
      const firstCell = scCells[0];
      if (!firstCell) {
        this.searchHeight = "50px";
        return;
      }

      const cellHeight = firstCell.offsetHeight;

      // 计算收缩后的高度：行数 × 单行高度
      const collapsedHeight = rowsNeeded * cellHeight;

      this.searchHeight = collapsedHeight + "px";
    },
  },
});
</script>
