<template>
  <div>
    <sc-crud
      :loading="loading"
      :search.sync="searchForm"
      :options="options"
      :data="data"
      :total="total"
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
        toolbar: {
          position: "bottom",
        },
        renderColumns: [
          {
            prop: "name",
            label: "昵称",
            search: true,
          },
          {
            prop: "username",
            label: "姓名",
            search: true,
          },
          {
            prop: "gender",
            label: "性别",
            search: true,
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
            ],
            total: 2,
          });
        }, 1000);
      });
    },
  },
};
</script>
