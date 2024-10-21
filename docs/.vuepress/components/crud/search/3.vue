<template>
  <div>
    <div style="margin-bottom: 15px;">queryForm:：{{ searchForm }}</div>
    <sc-crud :search.sync="searchForm" :options="options" :data="data">
      <!-- 自定义搜索头插槽 -->
      <template #gender-searchHeader>
        <div>自定义搜索头插槽</div>
      </template>
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        customProp: "",
      },
      options: {
        // 搜索表单配置
        searchForm: {
          // .... 其余属性同form表单
          initShow: true, // 初始化是否展开搜索框
          columnWidth: "400px", // 搜索框每列宽度
          labelWidth: "150px", // 搜索框label宽度
          action: {
            search: {
              // 自定义搜索按钮
              label: "自定义搜索",
              icon: "el-icon-magic-stick",
            },
            reset: {
              label: "自定义重置",
            },
            handles: [
              // 添加自定义按钮
              {
                label: "自定义按钮",
                icon: "el-icon-magic-stick",
                onClick: () => {
                  this.$message.success("自定义按钮");
                },
              },
            ],
          },
        },
        // 搜索头配置
        searchHeader: {
          // ...其余属性与el-popover组件配置相同
          width: "100px", // 搜索头宽度
        },
        renderColumns: [
          { prop: "name", label: "昵称", search: true },
          {
            prop: "updateTime",
            label: "自定义搜索头组件",
            searchHeader: {
              // 单个搜索头配置 与searchHeader相同
              width: "400px",
              // 自定义搜索头组件，覆盖继承自search的组件
              comp: {
                name: "el-select",
              },
            },
            search: {
              comp: {
                name: "el-date-picker",
                type: "daterange",
                rangeSeparator: "-",
                startPlaceholder: "开始日期",
                endPlaceholder: "结束日期",
                valueFormat: "yyyy-MM-dd",
              },
            },
          },
          {
            prop: "gender",
            label: "自定义搜索头插槽",
            search: {},
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
