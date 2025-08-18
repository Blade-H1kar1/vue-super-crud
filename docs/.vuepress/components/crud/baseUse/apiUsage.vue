<template>
  <sc-crud :options="options" :data="data" @getList="getUserList"> </sc-crud>
</template>

<script>
export default {
  data() {
    return {
      options: {
        init: true,
        // 配置内置API
        listApi: this.getUserListApi,
        deleteApi: this.deleteUserApi,
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
        selection: true,
        editConfig: {
          // 批量删除按钮配置
          batchDelete: {
            confirm: (rows) =>
              `是否删除序号为${rows
                .map((row) => row.$index + 1)
                .join(",")}的数据？`, // 删除提示
          },
          delete: {
            confirm: (scope) => `是否删除序号为${scope.$index + 1}的数据？`, // 删除提示
          },
        },
      },
      data: [],
    };
  },
  methods: {
    // 列表API - 组件会自动调用此方法获取数据
    async getUserListApi(searchParams) {
      console.log("调用列表API，搜索参数：", searchParams);

      // 模拟API请求
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockData = {
            data: [
              {
                id: 1,
                name: "张三",
                username: "zhangsan",
                gender: "男",
                age: 25,
                phone: "13800138001",
              },
              {
                id: 2,
                name: "李四",
                username: "lisi",
                gender: "女",
                age: 28,
                phone: "13800138002",
              },
              {
                id: 3,
                name: "王五",
                username: "wangwu",
                gender: "男",
                age: 30,
                phone: "13800138003",
              },
            ],
            total: 3,
          };

          // 支持多种响应格式
          resolve(mockData);
        }, 1000);
      });
    },

    // 删除API - 组件在删除操作时会自动调用此方法
    async deleteUserApi(userId) {
      console.log("调用删除API，用户ID：", userId);

      // 模拟删除API请求
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟删除成功
          console.log(`用户 ${userId} 删除成功`);
          resolve();
          // 删除成功后组件会自动刷新列表
        }, 500);
      });
    },
    getUserList(params) {
      console.log("调用获取列表API，参数：", params);
    },
  },
};
</script>

<style scoped>
/* 样式可以根据需要添加 */
</style>
