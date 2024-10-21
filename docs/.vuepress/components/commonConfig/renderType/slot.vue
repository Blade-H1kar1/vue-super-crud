<template>
  <sc-crud :options="options" :data="data">
    <!-- 根据prop渲染插槽 -->
    <template #name="{row}">
      {{ row.name + "slot" }}
    </template>
    <template #username="{row}">
      {{ row.username + "slot" }}
    </template>
  </sc-crud>
</template>

<script>
export default {
  data() {
    return {
      options: {
        pagination: true,
        action: [
          {
            label: "操作",
            icon: "el-icon-edit",
            onClick: () => {},
          },
        ],
        renderColumns: [
          {
            prop: "name",
            label: "昵称",
          },
          {
            prop: "username",
            label: "名称",
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
};
</script>

<style lang="scss" scoped></style>
