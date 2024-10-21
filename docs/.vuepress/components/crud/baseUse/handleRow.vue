<template>
  <div>
    <sc-crud :search.sync="searchForm" :options="options" :data="data">
      <template #handleRow-left="{size}">
        <el-button :size="size">handleRow插槽</el-button>
      </template>
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {},
      options: {
        rowEdit: true,
        handleRow: {
          add: {
            label: "自定义弹窗新增",
          }, // 自定义弹窗新增按钮
          batchDelete: {
            label: "自定义批量删除",
          }, // 自定义批量删除按钮
          rowAdd: {
            label: "定义行新增",
          }, // 自定义行新增按钮
        },
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
  methods: {},
};
</script>
