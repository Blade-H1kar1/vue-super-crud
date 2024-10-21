<template>
  <div>
    <sc-crud
      ref="crud"
      :search.sync="searchForm"
      :options="options"
      :data="data"
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
        {
          createTime: "2018-06-02 12:28:47",
          createUser: 94,
          id: 57,
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
                this.$refs.crud.validate();
              },
            },
            {
              label: "清除校验",
              type: "primary",
              onClick: (ctx) => {
                this.$refs.crud.clearValidate();
              },
            },
            {
              label: "表格第二行校验",
              type: "primary",
              onClick: (ctx) => {
                this.$refs.crud.validateField(1);
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
            required: true,
          },
          {
            prop: "username",
            label: "姓名",
          },
          {
            prop: "gender",
            label: "性别",
            required: true,
            isEdit: true,
            form: {
              // 使用form字段自定义编辑模式的组件
              comp: {
                name: "el-select",
                clearable: true,
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
