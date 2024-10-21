<template>
  <sc-crud :options="options" :data="data"> </sc-crud>
</template>

<script>
export default {
  data() {
    this.scopeComp = {
      render: (h) => {
        return h("div", "非全局组件");
      },
    };
    return {
      options: {
        renderColumns: [
          {
            prop: "username",
            label: "名称",
            comp: {
              // 组件内部通常要有一个value值，用来接收表格的默认值
              name: "el-select", // 组件名称，全局组件才能使用
              clearable: true, // 组件的属性
              multiple: true,
              bind: (scope) => ({
                placeholder: "动态属性" + scope.row.username,
              }),
              children: [
                // 组件的子级，接收comp数组、comp单个对象、渲染函数、默认插槽内容
                {
                  name: "el-option",
                  value: "111",
                  label: "111",
                },
                {
                  name: "el-option",
                  value: "222",
                  label: "222",
                },
              ],
              on: {
                // 组件的事件
                change: (val, scope) => {
                  this.$message.success(val);
                  // scope 包含 el表格原有参数与当前组件实例
                  console.log(scope, "表格参数");
                },
              },
            },
          },
          {
            prop: "name",
            label: "昵称",
            comp: {
              name: "el-input",
              slots: {
                // 使用插槽
                prefix: (h) => {
                  return "prefix";
                },
              },
            },
          },
          {
            prop: "gender",
            label: "性别",
            comp: {
              name: "el-button",
              on: {
                // 组件的事件
                click: () => {
                  this.$message.success("点击了按钮");
                },
              },
              children: "默认插槽内容",
            },
          },
          {
            prop: "gender",
            label: "性别",
            comp: {
              name: this.scopeComp, // 非全局组件使用：将引入的组件直接传给name
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
