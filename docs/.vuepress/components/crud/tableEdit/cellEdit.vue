<template>
  <div>
    <sc-crud
      :search.sync="searchForm"
      :options="options"
      :data="data"
      @edit="edit"
      @save="save"
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
          id: 1,
          name: "张三",
          gender: "男",
          age: 20,
          city: "北京",
          date: "2021-01-01",
          time: "12:00:00",
          datetime: "2021-01-01 12:00:00",
          color: "#409EFF",
          switch: true,
          rate: 3,
          slider: 50,
          radio: "1",
          checkbox: ["1"],
          select: "1",
          cascader: ["1", "1-1"],
          textarea: "这是一段文本",
          number: 100,
        },
        {
          id: 2,
          name: "李四",
          gender: "女",
          age: 21,
          city: "上海",
          date: "2021-01-02",
          time: "13:00:00",
          datetime: "2021-01-02 13:00:00",
          color: "#67C23A",
          switch: false,
          rate: 4,
          slider: 30,
          radio: "2",
          checkbox: ["2"],
          select: "2",
          cascader: ["2", "2-1"],
          textarea: "这是另一段文本",
          number: 200,
        },
        {
          id: 3,
          name: "王五",
          gender: "男",
          age: 22,
          city: "广州",
          date: "2021-01-03",
          time: "14:00:00",
          datetime: "2021-01-03 14:00:00",
          color: "#E6A23C",
          switch: true,
          rate: 5,
        },
        {
          id: 4,
          name: "赵六",
          gender: "女",
          age: 23,
          city: "深圳",
          date: "2021-01-04",
          time: "15:00:00",
          datetime: "2021-01-04 15:00:00",
          color: "#F56C6C",
          switch: false,
          rate: 2,
        },
      ],
      isEdit: true,
    };
  },
  computed: {
    options() {
      return {
        editConfig: {
          mode: "cell",
          autofocus: true,
        },
        renderColumns: [
          { prop: "name", label: "输入框", required: true },
          {
            prop: "select",
            label: "选择器",
            isEdit: (scope) => {
              return scope.row.id === 1;
            },
            form: {
              comp: {
                name: "el-select",
                options: [
                  { value: "1", label: "选项1" },
                  { value: "2", label: "选项2" },
                ],
              },
            },
          },
          {
            prop: "cascader",
            label: "级联选择器",
            form: {
              comp: {
                name: "el-cascader",
                options: [
                  {
                    value: "1",
                    label: "选项1",
                    children: [
                      { value: "1-1", label: "选项1-1" },
                      { value: "1-2", label: "选项1-2" },
                    ],
                  },
                  {
                    value: "2",
                    label: "选项2",
                    children: [
                      { value: "2-1", label: "选项2-1" },
                      { value: "2-2", label: "选项2-2" },
                    ],
                  },
                ],
              },
            },
          },
          {
            prop: "date",
            label: "日期选择器",
            form: {
              comp: {
                name: "el-date-picker",
                "value-format": "yyyy-MM-dd",
              },
            },
          },
          {
            prop: "time",
            label: "时间选择器",
            form: {
              comp: {
                name: "el-time-picker",
                "value-format": "HH:mm:ss",
              },
            },
          },
          {
            prop: "color",
            label: "颜色选择器",
            form: {
              comp: {
                name: "el-color-picker",
              },
            },
          },
          {
            prop: "rate",
            label: "评分",
            form: {
              comp: {
                name: "el-rate",
              },
            },
          },
        ],
      };
    },
  },
  methods: {
    edit(done, scope) {
      this.$message.info("编辑");
      console.log(scope, "edit");
      done();
    },
    save(done, scope) {
      this.$message.success("保存");
      console.log(scope, "save");
      done();
    },
  },
};
</script>
