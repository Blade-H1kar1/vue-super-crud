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
        showSummary: true, // 启用统计行
        renderColumns: [
          {
            prop: "amount",
            label: "金额",
            summary: {
              type: "sum",
              prefix: "¥",
              suffix: "元",
              decimals: 2,
            },
          },
          {
            prop: "score",
            label: "得分",
            summary: {
              type: "avg",
              decimals: 1,
              suffix: "分",
            },
          },
          {
            prop: "status",
            label: "状态统计",
            summary: {
              type: "count",
              predicate: (value) => value === "active",
              suffix: "个活跃",
            },
          },
          {
            prop: "nested.sales",
            label: "销售额",
            summary: {
              type: "custom",
              path: "nested.sales",
              method: (values, data) => {
                // 自定义统计逻辑
                const total = values.reduce((sum, val) => sum + val, 0);
                return total;
              },
            },
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
      try {
        const { data, total } = await mockApi.getList(40)(this.search);
        this.data = data.map((item) => ({
          ...item,
          amount: Math.floor(Math.random() * 100),
          score: Math.floor(Math.random() * 100),
          status: Math.random() > 0.5 ? "active" : "inactive",
          nested: {
            sales: Math.floor(Math.random() * 100),
          },
        }));
        this.total = total;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
