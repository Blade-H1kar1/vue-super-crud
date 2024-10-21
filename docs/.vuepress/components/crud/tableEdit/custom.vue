<template>
  <div>
    <sc-crud :search.sync="searchForm" :options="options" :data="data">
      <template #name-form="{row}">
        <el-input v-model="row.name"></el-input>
      </template>
      <template #username-form>
        <el-button type="text">插槽自定义编辑组件</el-button>
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
          rowAdd: true,
        },
        renderColumns: [
          { prop: "name", label: "昵称", search: true },
          {
            prop: "username",
            label: "姓名",
          },
          {
            prop: "11111",
            form: {
              prop: "updateTime", // 自定义编辑取值字段
              comp: {
                name: "el-date-picker",
                props: {
                  type: "date",
                  valueFormat: "yyyy-MM-dd",
                },
              },
            },
          },
          {
            prop: "gender",
            label: "性别",
            form: {
              render: (h, { row }) => (
                <div>render 自定义编辑组件 {row.gender}</div>
              ),
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
  methods: {},
};
</script>
