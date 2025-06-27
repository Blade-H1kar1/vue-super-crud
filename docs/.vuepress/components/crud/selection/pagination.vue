<template>
  <div>
    <el-button @click="handleClick">手动更新选中数据</el-button>
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
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
        {
          id: 8,
        },
        {
          id: 7,
        },
      ],
      search: {
        pageNum: 1,
        pageSize: 10,
      },
      options: {
        selection: {
          reserveSelection: true, // 是否保留选中状态
          ctrlSelect: true, // 是否启用 Ctrl 键点击选中
          shiftSelect: true, // 是否启用 Shift 键批量选中
          banner: true, // 是否显示横幅
          maxDisplay: 3, // 直接显示的最大数量
          labelKey: "name", // 显示的字段名
          clear: true, // 是否显示清除按钮
          selectable: (row, index) => {
            return index !== 0 && index !== 7;
          },
        },
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
  computed: {
    selectedNames() {
      return this.selectedRows.map((row) => row.name).join("、");
    },
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
      this.selectedRows = [
        {
          id: 1,
        },
        {
          id: 3,
        },
      ];
    },
  },
};
</script>
