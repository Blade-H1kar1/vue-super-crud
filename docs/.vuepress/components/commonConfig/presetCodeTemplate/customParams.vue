<template>
  <div>
    <sc-crud :search.sync="searchForm" :options="options" :data="data">
    </sc-crud>
  </div>
</template>

<script>
/***
 * "testCodeTemplate" 匹配到的配置对象
 * @param {Object} item - 当前配置对象
 * 
 *testCodeTemplate: (item) => ({
    search: {
      comp: {
        name: item.searchCompName,
        type: item.SearchCompType,
      },
    },
    form: {
      comp: {
        name: item.formCompName,
      },
    },
    formatter: (row) => row[item.prop] + "自定义格式化",
  }),
 * * */
export default {
  data() {
    return {
      searchForm: {},
      options: {
        rowEdit: true,
        searchHeader: true,
        renderColumns: [
          {
            prop: "name",
            label: "昵称",
            presetType: "testCodeTemplate",
            searchCompName: "el-select",
            formCompName: "el-select",
          },
          {
            prop: "username",
            label: "姓名",
            presetType: "testCodeTemplate",
            searchCompName: "el-input",
            formCompName: "el-input",
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
  methods: {},
};
</script>
