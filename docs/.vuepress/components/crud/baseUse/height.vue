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
        height: "300px", // 设置为`auto`，会自适应窗口高度，配合calcHeight参数去调节范围
        calcHeight: 0, // 值为应减去的底部高度
        delayCalc: 500, // 由于文档自身特性，高度需要延迟计算，实际使用中不需要
        renderColumns: [
          { prop: "name", label: "昵称", search: true },
          {
            label: "信息",
            children: [
              // 表头子级
              {
                prop: "username",
                label: "姓名",
                search: {
                  comp: {
                    name: "el-date-picker",
                  },
                },
                children: [
                  {
                    prop: "username",
                    label: "姓名",
                    search: {
                      comp: {
                        name: "el-date-picker",
                      },
                    },
                  },
                  {
                    prop: "gender",
                    label: "性别",
                  },
                ],
              },
              {
                prop: "gender",
                label: "性别",
              },
            ],
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
  mounted() {
    const dataRepeated = [];
    for (let i = 0; i < 50; i++) {
      dataRepeated.push(Object.assign({}, this.data[0]));
    }
    this.data = dataRepeated;
  },
  methods: {},
};
</script>
