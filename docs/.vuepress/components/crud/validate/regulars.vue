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
      isEdit: false,
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
          ],
        },
        renderColumns: [
          {
            prop: "name",
            label: "正整数校验",
            isEdit: true,
            rules: ["integer"],
          },
          {
            prop: "username",
            label: "自定义正则校验",
            isEdit: true,
            form: {
              comp: {
                placeholder: "请输入2到16个汉字",
              },
            },
            rules: [
              {
                regular: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
                msg: "请输入2到16个汉字",
              },
            ],
          },
        ],
      };
    },
  },
  methods: {},
};
</script>
