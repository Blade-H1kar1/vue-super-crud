<template>
  <div>
    <sc-crud :search.sync="searchForm" :options="options" :data="data">
      <template #toolbar-left="config">
        <!-- ctx为crud组件实例 -->
        <el-button :size="config.size">toolbar插槽</el-button>
      </template>
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {},
      options: {
        // 不需要自定义内置按钮时可以简写为数组 toolbar: [{label: "自定义按钮"...}]
        toolbar: {
          search: {
            label: "自定义搜索显隐", // 自定义 hover 提示词
          },
          reset: {
            label: "自定义重置", // 自定义 hover 提示词
          },
          zoom: {
            label: "自定义最大化", // 自定义 hover 提示词
          },
          column: {
            label: "自定义列设置", // 自定义 hover 提示词
          },
        },
        renderColumns: [
          { prop: "name", label: "昵称", search: true },
          {
            prop: "username",
            label: "姓名",
            search: {
              name: "el-date-picker",
            },
          },
          {
            prop: "gender",
            label: "性别",
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
