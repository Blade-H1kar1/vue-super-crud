<template>
  <div>
    <sc-crud
      :search.sync="searchForm"
      :options="options"
      :data="data"
      @view="view"
      @add="add"
      @edit="edit"
      @save="save"
      @delete="handleDelete"
      @cancel="cancel"
      @change="change"
      @getDetail="getDetail"
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
          view: true,
          edit: true,
          delete: true,
        },
        handleRow: {
          add: true,
        },
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
    getDetail(done, scope, unLoading) {
      this.detailApi().then((res) => {
        done(res.data);
        this.$message.success("获取详情");
      });
    },
    // 点击新增触发 add（行编辑与单元格编辑只有在保存后才会改变数据）
    add(done, scope, unLoading) {
      this.$message.success("新增自定义参数");
      // 传入自定义新增参数
      done({
        name: "测试",
        username: "自定义新增参数",
        gender: "男",
      });
    },
    // 点击编辑触发 edit
    edit(done, scope, unLoading) {
      done({
        // 自定义进入编辑时的参数
        ...scope.row,
        username: "自定义进入编辑时的参数",
      });
    },
    // 点击保存触发 save（自由编辑没有save事件）
    save(done, scope, unLoading) {
      console.log(scope.mode);
      if (scope.mode === "add") {
        this.addApi(scope.row).then((res) => {
          done({
            // 自定义保存参数
            ...scope.row,
            gender: "自定义保存参数",
          });
        });
      } else {
        this.editApi(scope.row)
          .then((res) => {})
          .catch(() => {
            unLoading(); // 失败时，手动停止loading
            this.$message.error("保存失败");
          });
      }
    },
    // 点击查看触发 view
    view(done, scope, unLoading) {
      done();
    },
    // 点击删除触发 delete
    handleDelete(done, scope, unLoading) {
      this.deleteApi(scope.row).then((res) => {
        done();
      });
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
        this.$message.success("change，事件模式：" + scope.mode);
      }, 500);
    },
    // 模拟请求api，在真实请求中除了 detailApi 不需要传参给本地，刷新列表即可
    addApi(params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    editApi(params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject();
        }, 500);
      });
    },
    deleteApi() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    detailApi(scope) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            code: 200,
            msg: "success",
            data: {
              createTime: "2018-06-02 12:28:47",
              createUser: 94,
              id: 56,
              idNumber: "8",
              name: "识间华中张认1",
              password: "sed laboris",
              phone: "18157668675",
              gender: "男",
              age: 20,
              status: 35,
              updateTime: "2018-09-08 16:33:19",
              updateUser: 58,
              username: "石洋1",
            },
          });
        }, 500);
      });
    },
  },
};
</script>
