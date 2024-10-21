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
        searchHeader: true,
        renderColumns: [
          {
            prop: "sexValue",
            label: "字典组件sc-select",
            dict: "gender",
            comp: {
              name: "el-select",
            },
          },
          {
            prop: "sexValue",
            label: "字典组件value-format",
            dict: "gender",
            comp: {
              name: "sc-value-format",
            },
          },
          {
            prop: "cascade",
            label: "级联组件",
            dict: "cascade",
            comp: {
              name: "el-cascade",
            },
          },
          {
            prop: "cascade",
            label: "字典组件cascade-format",
            dict: "cascade",
            comp: {
              name: "sc-cascade-format",
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
          sexValue: "1",
          age: 20,
          status: 35,
          updateTime: "2018-09-08 16:33:19",
          updateUser: 58,
          username: "石洋",
          cascade: "1,1-1",
        },
      ],
    };
  },
  created() {},
  methods: {},
};
</script>
