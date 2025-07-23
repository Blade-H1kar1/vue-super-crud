<template>
  <div>
    <div class="demo-section">
      <h4>本地搜索</h4>
      <sc-table-select
        v-model="localSearchSelectValue"
        :tableOptions="localSearchOptions"
        :data="userData"
        labelKey="name"
      />
      <div class="value-display">
        <p>选中值: {{ JSON.stringify(localSearchSelectValue) }}</p>
      </div>
    </div>

    <div class="demo-section">
      <h4>远程搜索</h4>
      <sc-table-select
        v-model="remoteSearchSelectValue"
        :search.sync="remoteSearchValue"
        :tableOptions="remoteSearchOptions"
        :data="filteredData"
        :remote="true"
        labelKey="name"
        searchKey="name"
        :loading="loading"
        @getList="getList"
      />
      <div class="value-display">
        <p>选中值: {{ JSON.stringify(remoteSearchSelectValue) }}</p>
        <p>搜索值: {{ JSON.stringify(remoteSearchValue) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mockApi } from "../mock";
export default {
  data() {
    return {
      // 本地搜索
      localSearchSelectValue: null,
      localSearchOptions: {
        renderColumns: [
          { prop: "id", label: "ID", width: 80, search: true },
          { prop: "name", label: "姓名", width: 120 },
          { prop: "email", label: "邮箱", width: 200, search: true },
          { prop: "department", label: "部门", width: 120, search: true },
        ],
      },

      // 远程搜索
      remoteSearchSelectValue: {},
      remoteSearchValue: {},
      remoteSearchOptions: {
        renderColumns: [
          { prop: "id", label: "ID", width: 80, search: true },
          { prop: "name", label: "姓名", width: 120, search: true },
          { prop: "email", label: "邮箱", width: 200, search: true },
          { prop: "department", label: "部门", width: 120, search: true },
        ],
      },
      loading: false,
      filteredData: [],

      // 用户数据
      userData: [
        {
          id: 1,
          name: "张三",
          email: "zhangsan@example.com",
          age: 28,
          department: "技术部",
        },
        {
          id: 2,
          name: "李四",
          email: "lisi@example.com",
          age: 32,
          department: "市场部",
        },
        {
          id: 3,
          name: "王五",
          email: "wangwu@example.com",
          age: 25,
          department: "销售部",
        },
        {
          id: 4,
          name: "赵六",
          email: "zhaoliu@example.com",
          age: 30,
          department: "人事部",
        },
        {
          id: 5,
          name: "钱七",
          email: "qianqi@example.com",
          age: 35,
          department: "财务部",
        },
      ],
    };
  },
  methods: {
    // 模拟远程搜索方法
    async getList() {
      this.loading = true;
      console.log(this.remoteSearchValue, "getList");
      this.filteredData = [...this.userData];
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
};
</script>

<style scoped>
.demo-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.value-display {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-family: monospace;
}
</style>
