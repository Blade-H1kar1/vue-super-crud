<template>
  <div>
    <sc-crud
      :search.sync="searchForm"
      :options="options"
      :data="data"
      @getDetail="getDetail"
      @add="add"
      @edit="edit"
      @view="view"
      @save="save"
    >
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
          edit: true,
          delete: true,
          view: true,
        },
        handleRow: {
          add: true,
        },
        isLocal: true,
        dialog: {}, // 自定义弹窗配置
        formOptions: {}, // 自定义表单配置
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
      ],
    };
  },
  methods: {
    add(done, scope) {
      this.$message("新增");
      done();
    },
    edit(done, scope) {
      this.$message("编辑");
      done();
    },
    view(done, scope) {
      this.$message("查看");
      done();
    },
    save(done, scope) {
      setTimeout(() => {
        done();
      }, 500);
    },
    getDetail(done, scope) {
      setTimeout(() => {
        done();
      }, 500);
    },
  },
};
</script>
