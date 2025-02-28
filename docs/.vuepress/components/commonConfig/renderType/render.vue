<template>
  <sc-crud :options="options" :data="data"> </sc-crud>
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
            render: (scope) => {
              // 安装了jsx相关转换插件可以使用vue-jsx语法
              return <div>{scope.row.name + "render"}</div>;
            },
          },
          {
            prop: "username",
            label: "名称",
            render: (h, scope) => {
              // 否则使用h函数渲染
              return h("div", {}, scope.row.username + "h");
            },
          },
          {
            prop: "gender",
            label: "性别",
            render: (scope) => {
              return (
                <el-select
                  v-model={scope.row.gender} // 与v-model相同
                  onChange={() => {
                    console.log("change");
                  }} // 事件加on前缀
                  clearable // 组件的属性
                  props={{
                    // 约等于模板语法的v-bind
                    multiple: true,
                  }}
                  on={{
                    // 约等于模板语法的v-on
                    "visible-change": () => {
                      console.log("visible-change");
                    },
                  }}
                  scopedSlots={{
                    // 作用域插槽
                    prefix: () => "prefix",
                  }}
                >
                  <i slot="prefix">具名插槽</i>
                  <el-option value="111" label="111"></el-option>
                </el-select>
              );
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
