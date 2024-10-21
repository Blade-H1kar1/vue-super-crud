<template>
  <div>
    <sc-crud :search.sync="searchForm" :options="options" :data="data">
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {},
      options: {
        action: {
          handles: [
            {
              icon: "el-icon-circle-check",
              label: "操作确认",
              confirm: "操作确认",
              onClick: (scope) => {
                this.$message.info("操作确认");
              },
            },
            {
              icon: "el-icon-circle-check",
              label: "操作后返回指定页",
              successBack: () => {
                this.$router.push({
                  path: "/",
                });
              },
              onClick: (scope, cb) => {
                this.$message.info("操作后返回指定页");
                cb();
              },
            },
          ],
        },
        renderColumns: [
          {
            prop: "username",
            label: "姓名",
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
  methods: {},
};
</script>
