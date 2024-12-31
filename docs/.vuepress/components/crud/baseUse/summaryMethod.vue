<template>
  <div>
    <sc-crud
      :loading="loading"
      :search.sync="searchForm"
      :options="options"
      :data="data"
      :total="total"
      :spanMethod="spanMethod"
      @getList="getList"
    >
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      searchForm: {},
      options: {
        init: true,
        border: true,
        renderColumns: [
          {
            prop: "number",
            label: "合计",
            summary: "sum",
          },
          {
            prop: "number",
            label: "平均",
            summary: "avg",
          },
          {
            prop: "number",
            label: "最大值",
            summary: "max",
          },
          {
            prop: "number",
            label: "最小值",
            summary: "min",
          },
          {
            prop: "number",
            label: "自定义summary",
            summary: (values, data) => {
              return values.reduce((acc, curr) => acc + curr, 0);
            },
          },
        ],
      },
      data: [],
      total: 0,
    };
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.property === "gender") {
        if (rowIndex === 0) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        }
        if (rowIndex === 1) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
        return {
          rowspan: 1,
          colspan: 1,
        };
      }
    },
    async getList() {
      this.loading = true;
      const { data, total } = await this.listApi(this.searchForm);
      this.loading = false;
      this.data = data;
      this.total = total;
    },
    listApi() {
      // 模拟请求api
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            code: 200,
            data: [
              {
                id: 56,
                number: 1,
              },
              {
                id: 56,
                number: 2,
              },
              {
                id: 56,
                number: 3,
              },
              {
                id: 56,
                number: 4,
              },
            ],
            total: 2,
          });
        }, 1000);
      });
    },
  },
};
</script>
