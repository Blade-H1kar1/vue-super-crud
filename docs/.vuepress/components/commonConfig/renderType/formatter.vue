<template>
  <sc-crud :options="options" :data="data"> </sc-crud>
</template>

<script>
export default {
  data() {
    return {
      options: {
        renderColumns: [
          { prop: "name", label: "昵称" },
          {
            prop: "username",
            label: "姓名",
            formatter: (row) => row.username + " formatter",
          },
          {
            prop: "gender",
            label: "性别",
            html: true,
            formatter: (row) => {
              return `<span style="color:red">${row.gender}</span>`;
            },
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
};
</script>

<style lang="scss" scoped></style>
