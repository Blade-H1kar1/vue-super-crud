<template>
  <div>
    <div style="margin-bottom: 15px;">queryForm:：{{ searchForm }}</div>
    <sc-crud :search.sync="searchForm" :options="options" :data="data">
      <!-- 插槽 自定义搜索标题 -->
      <template slot="name-search-label">
        <div>插槽自定义label</div>
      </template>
      <template slot="name-search">
        <div>插槽自定义搜索内容</div>
      </template>
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        name: "defaultName",
        sexCustom: [],
      },
      options: {
        searchForm: true,
        searchHeader: true,
        renderColumns: [
          { prop: "name", label: "昵称", search: true },
          {
            prop: "username",
            label: "姓名",
            search: {
              comp: {
                name: "el-select",
              },
              labelRender: () => {
                // jsx 自定义搜索标题
                return <div>jsx label</div>;
              },
            },
          },
          {
            prop: "gender",
            label: "性别",
            search: {
              prop: "sexCustom", //自定义search取值字段
              label: "自定义搜索标题", //自定义search标题
              comp: {
                name: "el-date-picker",
              },
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
  methods: {},
};
</script>

<style lang="scss" scoped></style>
