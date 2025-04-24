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
              onClick: () => {
                this.$refs.crud.validate();
              },
            },
            {
              label: "清除校验",
              type: "primary",
              onClick: () => {
                this.$refs.crud.clearValidate();
              },
            },
          ],
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
        ],
      };
    },
  },
  methods: {},
};
</script>
