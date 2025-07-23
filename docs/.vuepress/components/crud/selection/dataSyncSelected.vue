<template>
  <div>
    <div class="demo-buttons">
      <el-button @click="handleClick">更新选中数据</el-button>
      <el-button @click="toggleDataSyncSelected">切换同步方向</el-button>
    </div>
    <div class="demo-info">
      <p>dataSyncSelected = {{ options.dataSyncSelected }} {{ options.dataSyncSelected ? '(selected → 表格数据)' : '(表格数据 → selected)' }}</p>
      <p>选中数据 {{ JSON.stringify(selectedRows) }}</p>
    </div>
    <sc-crud
      :loading.sync="loading"
      :search.sync="search"
      :selected.sync="selectedRows"
      :options="options"
      :data="data"
      :total="total"
      @getList="getList"
    >
    </sc-crud>
  </div>
</template>

<script>
import { mockApi } from "../../mock";
export default {
  data() {
    return {
      loading: false,
      selectedRows: [
        { id: 1, customField: "自定义值1" },
        { id: 2, customField: "自定义值2" },
      ],
      search: {
        pageNum: 1,
        pageSize: 10,
      },
      options: {
        editConfig: {
          mode: "row",
          edit: true,
        },
        selection: {
          reserveSelection: true,
          banner: true,
          labelKey: "name",
        },
        dataSyncSelected: true,
        init: true,
        renderColumns: [
          { prop: "name", label: "姓名" },
          { prop: "gender", label: "性别" },
          { prop: "age", label: "年龄" },
          { prop: "city", label: "城市" },
          {
            prop: "customField",
            label: "自定义字段",
            formatter: (row) => row.customField || "无数据",
          },
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
    handleClick() {
      // 更新选中数据
      // 当dataSyncSelected=true时：customField字段的值会同步到表格数据中
      // 当dataSyncSelected=false时：只会根据id匹配选中状态，customField不会同步
      this.selectedRows = [
        { id: 1, customField: "更新的值" },
        { id: 3, customField: "新增的值" },
      ];
    },
    toggleDataSyncSelected() {
      // 切换数据同步方向
      // true: selected数组中的数据会同步到表格数据中
      // false: 表格只会根据operateKey匹配选中状态，不会同步其他字段
      this.options.dataSyncSelected = !this.options.dataSyncSelected;
      this.getList();
    },
  },
};
</script>

<style scoped>
.demo-buttons {
  margin-bottom: 15px;
}
.demo-info {
  background-color: #f5f7fa;
  padding: 10px;
  margin-bottom: 15px;
}
</style>
