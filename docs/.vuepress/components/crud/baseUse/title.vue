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
        title: "表格标题",
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
  methods: {},
};
</script>
