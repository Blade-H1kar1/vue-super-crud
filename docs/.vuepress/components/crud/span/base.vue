<template>
  <sc-crud
    :loading.sync="loading"
    :search.sync="search"
    :options="options"
    :data="data"
    :total="total"
    @getList="getList"
  >
  </sc-crud>
</template>

<script>
import { mockApi } from "../../mock";
export default {
  data() {
    return {
      loading: false,
      search: {
        pageNum: 1,
        pageSize: 10,
      },
      options: {
        border: true,
        init: true,
        renderColumns: [
          {
            prop: "city",
            label: "城市",
            spanProp: "city", // 开启该列合并
          },
          {
            prop: "gender",
            label: "性别",
            spanProp: "gender", // 开启该列合并
          },
          {
            prop: "age",
            label: "年龄",
          },
          {
            prop: "is30",
            label: "大于30",
            spanProp: "is30",
          },
          { prop: "name", label: "姓名" },
        ],
        showSummary: true, // 启用合计行
      },
      data: [],
      total: 0,
    };
  },

  methods: {
    async getList() {
      this.loading = true;
      try {
        const { data, total } = await mockApi.getList(40)(this.search);
        // 根据当前排序字段对数据进行排序
        this.data = [...data];
        this.total = total;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
