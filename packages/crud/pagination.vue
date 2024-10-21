<template>
  <el-pagination
    :class="b('pagination')"
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
export default create({
  name: "crud",
  inject: ["ctx"],
  computed: {
    showPagination() {
      if (!this.pagination) return false;
      if (!this.total) return false;
      return true;
    },
    pagination() {
      return this.ctx.crudOptions.pagination || {};
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
        this.ctx.setOptions.pageSize || this.ctx.search[this.props.pageSize]
      );
    },
    handleSizeChange(val) {
      if (this.pageNum * val > this.total) {
        this.pageNum = 1;
      }
      this.ctx.setOptions.pageSize = val;
      this.ctx.saveLocalCache(false);
      this.ctx.getList();
    },
    handleCurrentChange(val) {
      this.ctx.getList();
    },
  },
});
</script>
