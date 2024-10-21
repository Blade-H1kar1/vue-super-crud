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
        // 列宽度自动计算规则
        calcColumnWidth: {
          widthType: "first", // first为默认值，仅计算第一个有内容的宽度
          widthFont: "12px Ubuntu", //自定义计算的字体大小和类型(有助于更精确的计算)
          calcWidth: 20, // 增加的宽度，默认单元格内边距20px
        },
        renderColumns: [
          {
            prop: "name",
            width: "auto", // 列自动计算宽度
            label: "昵称1",
            search: true,
          },
          {
            prop: "name",
            width: "auto",
            calcWidth: 200, // 增加的宽度
            label: "昵称2",
            search: true,
          },
          {
            prop: "name",
            minWidth: "auto", // 列自动计算最小宽度
            label: "昵称3",
            search: true,
          },
          {
            prop: "username",
            label: "姓名",
            width: "auto",
            widthType: "max", // 计算所有内容的最大宽度（数据量大存在性能问题），独立设置，覆盖calcColumnWidth
            widthFont: "12px Ubuntu",
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
          username: "石洋ooooooo",
        },
        {
          createTime: "2018-06-02 12:28:47",
          createUser: 94,
          id: 56,
          idNumber: "8",
          name: "识间华中张认ooooooooooooooo",
          password: "sed laboris",
          phone: "18157668675",
          gender: "男",
          age: 20,
          status: 35,
          updateTime: "2018-09-08 16:33:19",
          updateUser: 58,
          username: "石洋oooooooooooooooo",
        },
        {
          createTime: "2018-06-02 12:28:47",
          createUser: 94,
          id: 56,
          idNumber: "8",
          name: "识间华中张认oooooooooooooooooooooooooooooooooo",
          password: "sed laboris",
          phone: "18157668675",
          gender: "男",
          age: 20,
          status: 35,
          updateTime: "2018-09-08 16:33:19",
          updateUser: 58,
          username: "石洋312312312______-----ooooooooooooooooooo",
        },
      ],
    };
  },
  methods: {},
};
</script>
