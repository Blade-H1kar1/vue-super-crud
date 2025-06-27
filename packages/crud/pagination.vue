<template>
  <el-pagination
    :class="b()"
    :style="{
      'text-align': pagination.align,
    }"
    v-show="showPagination"
    :current-page.sync="pageNum"
    :page-size.sync="pageSize"
    :total="total"
    :disabled="ctx.loadingStatus"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    v-bind="pagination"
    v-on="paginationOn"
  />
</template>

<script>
import create from "core/create";
import { checkVisibility } from "utils";
export default create({
  name: "crud-pagination",
  inject: ["ctx"],
  data() {
    return {
      pageScrollMap: new Map(), // 存储每页滚动位置
    };
  },
  computed: {
    showPagination() {
      return checkVisibility(this.pagination, null, this.total > 0);
    },
    pagination() {
      return this.ctx.crudOptions.pagination;
    },
    paginationOn() {
      return this.pagination?.on;
    },
    props() {
      return this.ctx.crudOptions.props;
    },
    pageNum: {
      get() {
        return this.ctx.query[this.props.pageNum];
      },
      set(val) {
        this.ctx.query[this.props.pageNum] = val;
      },
    },
    pageSize: {
      get() {
        return this.ctx.query[this.props.pageSize];
      },
      set(val) {
        this.ctx.query[this.props.pageSize] = val;
      },
    },
    total() {
      if (this.ctx.crudOptions.localPagination) {
        if (this.ctx.localFilteredData !== undefined) {
          return this.ctx.localFilteredData?.length || 0;
        }
        return this.ctx.data.length;
      }
      return this.ctx.total;
    },
  },
  watch: {
    total(total) {
      //如果当前页面删除没数据了调用第一页
      if (total === (this.pageNum - 1) * this.pageSize && total != 0) {
        this.pageNum = this.pageNum - 1;
      }
    },
  },
  created() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.$set(
        this.ctx.query,
        this.props.pageNum,
        this.ctx.search[this.props.pageNum] || 1
      );
      this.$set(
        this.ctx.query,
        this.props.pageSize,
        this.ctx.search[this.props.pageSize] || this.ctx.setOptions.pageSize
      );
    },
    // 保存当前页滚动位置
    saveScrollPosition(prePage) {
      const bodyWrapper = this.ctx.$refs.tableRef.$refs.bodyWrapper;
      if (bodyWrapper) {
        this.pageScrollMap.set(prePage, {
          scrollTop: bodyWrapper.scrollTop,
          scrollLeft: bodyWrapper.scrollLeft,
        });
      }
    },

    // 设置页面滚动位置
    setScrollPosition(pageNum) {
      if (this.pagination.memorizeScroll) {
        this.$nextTick(() => {
          const bodyWrapper = this.ctx.$refs.tableRef.$refs.bodyWrapper;
          if (!bodyWrapper) return;

          const position = this.pageScrollMap.get(pageNum);
          if (position) {
            // 如果有历史记录,恢复到历史位置
            bodyWrapper.scrollTop = position.scrollTop;
            bodyWrapper.scrollLeft = position.scrollLeft;
          } else {
            // 如果没有历史记录,滚动到顶部
            bodyWrapper.scrollTop = 0;
            bodyWrapper.scrollLeft = 0;
          }
        });
      }
    },

    handleSizeChange(val) {
      // 保存当前页滚动位置
      this.saveScrollPosition(this.pageNum);

      if (this.pageNum * val > this.total) {
        this.pageNum = 1;
      }
      this.ctx.setOptions.pageSize = val;
      this.ctx.saveLocalCache(false);
      this.handleDataChange();
      // 设置新页面的滚动位置
      this.setScrollPosition(this.pageNum);
    },

    handleCurrentChange(val) {
      // 保存当前页滚动位置
      this.saveScrollPosition(val - 1);
      this.handleDataChange();
    },

    handleDataChange() {
      this.ctx._isPaging = true;
      if (this.ctx.crudOptions.localPagination) {
        this.$nextTick(() => {
          this.ctx.updateSelection();
        });
      } else {
        this.$nextTick(() => {
          this.ctx.getList().then(() => {
            // 设置新页面的滚动位置
            this.setScrollPosition(this.pageNum);
          });
        });
      }
    },
  },
});
</script>
