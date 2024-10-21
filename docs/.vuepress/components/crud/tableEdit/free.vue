<template>
  <div>
    <sc-crud
      :search.sync="searchForm"
      :options="options"
      :data="data"
      @add="add"
    >
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {},
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
          id: 58,
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
      isEdit: true,
    };
  },
  computed: {
    options() {
      return {
        freeEdit: this.isEdit,
        handleRow: {
          rowAdd: true,
          handles: [
            {
              label: "控制编辑",
              type: "primary",
              onClick: () => {
                this.isEdit = !this.isEdit;
              },
            },
          ],
        },
        action: {
          delete: true,
        },
        renderColumns: [
          //编辑模式默认渲染 el-input 组件
          {
            prop: "name",
            label: "整列编辑1",
          },
          {
            prop: "name",
            label: "整列编辑2",
          },
          {
            prop: "username",
            label: "函数控制该行是否编辑",
            isEdit: ({ row }) => row.id === 56, // isEdit 函数 控制该行是否可编辑
            search: {
              comp: {
                name: "el-date-picker",
              },
            },
          },
          {
            prop: "gender",
            label: "性别",
            form: {
              // 使用form字段自定义编辑模式的组件
              comp: {
                name: "el-select",
                children: [
                  {
                    name: "el-option",
                    label: "男",
                    value: "男",
                  },
                  {
                    name: "el-option",
                    label: "女",
                    value: "女",
                  },
                ],
              },
            },
          },
        ],
      };
    },
  },
  methods: {
    add(done) {
      this.$message("新增之前");
      done({
        name: "测试",
        username: "测试",
        gender: "男",
      });
    },
  },
};
</script>
