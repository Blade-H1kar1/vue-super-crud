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
            prop: "name",
            label: "自动合并行",
            search: true,
            sameRowSpan: true,
          },
          {
            prop: "age",
            label: "自动合并条件指定为name",
            sameRowSpan: "name",
          },
          {
            prop: "username",
            label: "自定义spanMethod",
            search: true,
            spanMethod: ({ row, rowIndex }) => {
              if (rowIndex % 2 === 0) {
                return {
                  rowspan: 2,
                  colspan: 1,
                };
              } else {
                return {
                  rowspan: 0,
                  colspan: 0,
                };
              }
            },
          },
          {
            prop: "gender",
            label: "性别",
            search: true,
          },
          {
            prop: "idNumber",
            label: "idNumber",
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
                createTime: "2018-06-02 12:28:47",
                createUser: 94,
                id: 56,
                idNumber: "8",
                name: "识间华中张认",
                password: "sed laboris",
                phone: "18157668675",
                gender: "男",
                age: 20,
                status: 35,
                updateTime: "2018-09-08 16:33:19",
                updateUser: 58,
                username: "石洋",
              },
              {
                createTime: "2018-06-02 12:28:47",
                createUser: 94,
                id: 57,
                idNumber: "8",
                name: "识间华中张认1",
                password: "sed laboris",
                phone: "18157668675",
                gender: "男",
                age: 20,
                status: 35,
                updateTime: "2018-09-08 16:33:19",
                updateUser: 58,
                username: "石洋11",
              },
              {
                createTime: "2018-06-02 12:28:47",
                createUser: 94,
                id: 58,
                idNumber: "8",
                name: "识间华中张认1",
                password: "sed laboris",
                phone: "18157668675",
                gender: "男",
                age: 20,
                status: 35,
                updateTime: "2018-09-08 16:33:19",
                updateUser: 58,
                username: "石洋22",
              },
              {
                createTime: "2018-06-02 12:28:47",
                createUser: 94,
                id: 59,
                idNumber: "8",
                name: "识间华中张认1",
                password: "sed laboris",
                phone: "18157668675",
                gender: "男",
                age: 20,
                status: 35,
                updateTime: "2018-09-08 16:33:19",
                updateUser: 58,
                username: "石洋33",
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
