<template>
  <div>
    <sc-crud :search.sync="searchForm" :options="options" :data="data">
    </sc-crud>
  </div>
</template>

<script>
/***
 * date 匹配到的全局配置对象
 * 
 *date: {
    comp: {
      name: "el-date-picker",
      type: "date",
      valueFormat: "yyyy-MM-dd",
    },
  }
 * * */
export default {
  data() {
    return {
      searchForm: {},
      options: {
        renderColumns: [
          { prop: "name", label: "昵称" },
          {
            prop: "username",
            label: "姓名",
          },
          {
            prop: "createTime",
            label: "模板复用示例",
            presetType: "date", // 使用模板
          },
          {
            prop: "createTime",
            label: "不使用模板，效果与模板等价",
            comp: {
              name: "el-date-picker",
              type: "date",
              valueFormat: "yyyy-MM-dd",
            },
          },
        ],
      },
      data: [
        {
          createTime: "2018-06-02",
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
