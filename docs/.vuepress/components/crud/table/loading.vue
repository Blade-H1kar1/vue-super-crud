<template>
  <div>
    <sc-crud
      :search.sync="searchForm"
      :options="options"
      :data="data"
      :loading.sync="loading"
    >
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      searchForm: {},
      options: {
        loadingText: "拼命加载中...",
        loadingSpinner: "el-icon-loading",
        loadingBackground: "rgba(0, 0, 0, 0.8)",
        disableLoading: true, //禁用组件内部控制加载状态
        handleRow: [
          {
            label: "控制加载",
            icon: "el-icon-loading",
            type: "primary",
            onClick: () => {
              this.loading = !this.loading;
            },
          },
        ],
        renderColumns: [
          { prop: "name", label: "昵称", search: true },
          {
            prop: "username",
            label: "姓名",
            search: {
              name: "el-date-picker",
            },
          },
          {
            prop: "gender",
            label: "性别",
          },
        ],
      },
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
      ],
    };
  },
  mounted() {},
  methods: {},
};
</script>
