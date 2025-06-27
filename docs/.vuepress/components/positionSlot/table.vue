<template>
  <sc-crud
    :loading.sync="loading"
    :search.sync="search"
    :options="options"
    :data="data"
    :total="total"
    @getList="getList"
  >
    <template #handleRow>
      <el-button>操作栏</el-button>
    </template>
    <template #handleRow-left>
      <el-button type="primary">操作栏左侧</el-button>
    </template>
    <template #handleRow-right>
      <el-button type="primary">操作栏右侧</el-button>
    </template>
    <template #handleRow-top>
      <el-button type="primary" style="width: 100%;">操作栏顶部</el-button>
    </template>
    <template #handleRow-bottom>
      <el-button type="primary" style="width: 100%;">操作栏底部</el-button>
    </template>
    <template #name-header-left>
      <el-button type="primary">左侧</el-button>
    </template>
    <template #name-header-right>
      <el-button type="primary">右侧</el-button>
    </template>
    <template #name-header-top>
      <el-button type="primary" style="width: 100%;">顶部</el-button>
    </template>
    <template #name-header-bottom>
      <el-button type="primary" style="width: 100%;">底部</el-button>
    </template>
    <template #pagination-left>
      <el-button type="primary">左侧</el-button>
    </template>
    <template #pagination-right>
      <el-button type="primary">右侧</el-button>
    </template>
    <template #pagination-top>
      <el-button type="primary" style="width: 100%;">顶部</el-button>
    </template>
    <template #pagination-bottom>
      <el-button type="primary" style="width: 100%;">底部</el-button>
    </template>
  </sc-crud>
</template>

<script>
import { mockApi } from "../mock";
export default {
  data() {
    return {
      loading: false,
      search: {
        pageNum: 1,
        pageSize: 2,
      },
      options: {
        init: true,
        renderColumns: [
          { prop: "name", label: "姓名" },
          { prop: "gender", label: "性别" },
          { prop: "age", label: "年龄" },
          { prop: "city", label: "城市" },
        ],
      },
      data: [],
      total: 0,
    };
  },
  methods: {
    async getList() {
      this.loading = true;
      const { data, total } = await mockApi.getList(40)(this.search);
      this.data = data;
      this.total = total;
      this.loading = false;
    },
  },
};
</script>
