<template>
  <div>
    <sc-crud :search.sync="searchForm" :options="options" :data.sync="data">
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {},
      options: {
        api: {
          delete: this.deleteApi,
        },
        deleteMsgTip: (scope) => `自定义删除${scope.$index + 1}?`, // 删除提示信息，传false则不提示
        batchDeleteMsgTip: (selectRows) =>
          `自定义批量删除提示，${selectRows.length}?`, // 批量删除提示信息，传false则不提示
        successTip: (scope) => "自定义成功提示", // 成功提示信息，传false则不提示
        isLocal: true,
        action: {
          delete: true,
        },
        handleRow: {
          batchDelete: true,
        },
        selection: true,
        renderColumns: [
          { prop: "name", label: "昵称", search: true, form: true },
          {
            prop: "username",
            label: "姓名",
            search: {
              comp: {
                name: "el-date-picker",
              },
            },
            form: true,
          },
          {
            prop: "gender",
            label: "性别",
            form: true,
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
    };
  },
  methods: {
    // 模拟请求api
    deleteApi() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
  },
};
</script>
