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
        // 接收promise api 远程调用方法
        api: {
          getList: this.listApi,
          add: this.addApi,
          edit: (param) => {
            //自定义api传参
            console.log(param, "param");
            return this.editApi(param);
          },
          delete: this.deleteApi,
          getDetail: this.detailApi, // 没有detailApi则默认取表格本地row数据
        },
        props: {
          pageNum: "pageNum", // 分页参数
          pageSize: "pageSize", // 分页参数
          listResult: "data", // 列表数据
          total: "total", // 列表条数
          detailResult: "data", // 自定义详情返回数据
        },
        isLocal: true, // crud是否修改本地数据，在真实请求中可以禁用该项
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
      data: [],
    };
  },
  methods: {
    // 模拟请求api
    listApi() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            code: 200,
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
            total: 2,
          });
        }, 1000);
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
    // 在真实增删改请求中不需要传参给本地，刷新列表即可
    addApi(params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(params);
        }, 500);
      });
    },
    editApi(params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(params);
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
  },
};
</script>
