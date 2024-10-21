<template>
  <div>
    <sc-crud
      :search.sync="searchForm"
      :options="options"
      :data="data"
      @add="add"
      @edit="edit"
      @save="save"
      @delete="handleDelete"
      @cancel="cancel"
      @change="change"
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
        rowEdit: true,
        handleRow: {
          rowAdd: true,
        },
        renderColumns: [
          { prop: "name", label: "昵称", search: true },
          {
            prop: "username",
            label: "姓名",
            search: {
              comp: {
                name: "el-date-picker",
              },
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
  methods: {
    // 点击新增触发 add（行编辑与单元格编辑只有在保存后才会改变数据）
    add(done, scope) {
      this.$message.success("新增自定义参数");
      // 传入自定义新增参数
      done({
        name: "测试",
        username: "自定义新增参数",
        gender: "男",
      });
    },
    // 点击编辑触发 edit
    edit(done, scope) {
      done({
        // 自定义进入编辑时的参数
        ...scope.row,
        username: "自定义进入编辑时的参数",
      });
    },
    // 点击保存触发 save（自由编辑没有save事件）
    save(done, scope) {
      done({
        // 自定义保存参数
        ...scope.row,
        gender: "自定义保存参数",
      });
      this.$message.success("保存并修改数据");
    },
    // 点击删除触发 delete
    handleDelete(done, scope) {
      done();
      this.$message.success("删除数据");
    },
    // 点击取消触发 cancel
    cancel(done) {
      done();
      this.$message.success("取消编辑");
    },
    // 数据变化触发
    change(done, scope) {
      done();
      setTimeout(() => {
        this.$message.success("change 模式：" + scope.mode);
      }, 500);
    },
  },
};
</script>
