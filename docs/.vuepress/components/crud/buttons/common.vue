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
        action: {
          handles: [
            {
              icon: "el-icon-search",
              label: "自定义按钮隐藏",
              hidden: (scope) => {
                return scope.$index === 0;
              },
            },
          ],
        },
        handleRow: {
          tempGlobalButton: {
            label: "自定义temp按钮",
          },
          handles: [
            {
              label: "自定义按钮",
              icon: "el-icon-edit",
              type: "primary",
              hidden: false,
              onClick: () => {
                this.$message.success("自定义按钮");
              },
            },
            {
              label: "自定义按钮1",
              icon: "el-icon-edit",
              type: "primary",
              round: true,
            },
            {
              label: "折叠按钮",
              children: [
                {
                  label: "折叠按钮1",
                  icon: "el-icon-search",
                  onClick: () => {
                    console.log("折叠按钮1");
                  },
                },
                {
                  presetType: "add",
                  label: "自定义新增",
                  onClick: (scope, rawClick) => {
                    console.log("自定义新增", rawClick);
                  },
                },
                "add",
              ],
            },
          ],
        },
        renderColumns: [
          { prop: "name", label: "昵称", search: true },
          {
            prop: "username",
            label: "姓名",
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
