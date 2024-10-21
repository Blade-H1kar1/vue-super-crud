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
      data: [
        {
          createTime: "2018-06-02 12:28:47",
          createUser: 94,
          id: 56,
          idNumber: "8",
          name: "",
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
  computed: {
    options() {
      return {
        handleRow: {
          handles: [
            {
              label: "表格校验",
              type: "primary",
              onClick: (ctx) => {
                ctx.validate();
              },
            },
            {
              label: "清除校验",
              type: "primary",
              onClick: (ctx) => {
                ctx.clearValidate();
              },
            },
          ],
        },
        action: {
          delete: true,
        },
        renderColumns: [
          {
            prop: "name",
            label: "昵称",
            isEdit: true,
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (value) {
                    callback();
                  } else {
                    callback(new Error("error1"));
                  }
                },
                trigger: "change",
              },
            ],
          },
          {
            prop: "username",
            label: "姓名",
            isEdit: ({ row }) => row.id === 56,
          },
          {
            prop: "gender",
            label: "性别",
            isEdit: this.isEdit,
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
  methods: {},
};
</script>
