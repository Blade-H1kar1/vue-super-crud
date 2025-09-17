<template>
  <sc-crud
    ref="crud"
    :search.sync="searchForm"
    :options="options"
    :data="tableData"
    @area-fill="handleFill"
    @area-selection-change="handleSelectionChange"
  >
  </sc-crud>
</template>

<script>
export default {
  name: "CrudAreaSelectionSmartFill",
  data() {
    return {
      searchForm: {},
      tableData: [
        {
          id: 1,
          sequence: 1,
          project: "项目1",
          date: "2024-01-01",
          weekday: "星期一",
          month: "一月",
          quarter: "第一季度",
          score: 85,
          version: "v1.0",
        },
        {
          id: 2,
          sequence: 2,
          project: "项目2",
          date: "2024-01-02",
          weekday: "星期二",
          month: "二月",
          quarter: "第二季度",
          score: 90,
          version: "v1.1",
        },
        {
          id: 3,
          sequence: "",
          project: "",
          date: "",
          weekday: "",
          month: "",
          quarter: "",
          score: "",
          version: "",
        },
        {
          id: 4,
          sequence: "",
          project: "",
          date: "",
          weekday: "",
          month: "",
          quarter: "",
          score: "",
          version: "",
        },
        {
          id: 5,
          sequence: "",
          project: "",
          date: "",
          weekday: "",
          month: "",
          quarter: "",
          score: "",
          version: "",
        },
        {
          id: 6,
          sequence: "",
          project: "",
          date: "",
          weekday: "",
          month: "",
          quarter: "",
          score: "",
          version: "",
        },
        {
          id: 7,
          sequence: "",
          project: "",
          date: "",
          weekday: "",
          month: "",
          quarter: "",
          score: "",
          version: "",
        },
        {
          id: 8,
          sequence: "",
          project: "",
          date: "",
          weekday: "",
          month: "",
          quarter: "",
          score: "",
          version: "",
        },
      ],
    };
  },
  computed: {
    options() {
      return {
        index: true,
        areaSelection: {
          fillCustomLists: [
            [
              "星期一",
              "星期二",
              "星期三",
              "星期四",
              "星期五",
              "星期六",
              "星期日",
            ],
            [
              "一月",
              "二月",
              "三月",
              "四月",
              "五月",
              "六月",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月",
            ],
            ["第一季度", "第二季度", "第三季度", "第四季度"],
          ],
        },
        editConfig: {
          mode: "cell",
        },
        height: "500px",
        renderColumns: [
          {
            prop: "id",
            label: "ID",
            width: 60,
            isEdit: false,
          },
          {
            prop: "sequence",
            label: "序号",
            width: 80,
            form: {
              comp: {
                name: "el-input-number",
                min: 1,
                placeholder: "数值序列",
              },
            },
          },
          {
            prop: "project",
            label: "项目名称",
            width: 120,
            form: {
              comp: {
                name: "el-input",
                placeholder: "文本+数字序列",
              },
            },
          },
          {
            prop: "date",
            label: "日期",
            width: 120,
            form: {
              comp: {
                name: "el-date-picker",
                type: "date",
                placeholder: "日期序列",
                format: "yyyy-MM-dd",
                "value-format": "yyyy-MM-dd",
              },
            },
          },
          {
            prop: "weekday",
            label: "星期",
            width: 100,
            form: {
              comp: {
                name: "el-select",
                placeholder: "自定义列表",
                options: [
                  { label: "星期一", value: "星期一" },
                  { label: "星期二", value: "星期二" },
                  { label: "星期三", value: "星期三" },
                  { label: "星期四", value: "星期四" },
                  { label: "星期五", value: "星期五" },
                  { label: "星期六", value: "星期六" },
                  { label: "星期日", value: "星期日" },
                ],
              },
            },
          },
          {
            prop: "month",
            label: "月份",
            width: 100,
            form: {
              comp: {
                name: "el-select",
                placeholder: "自定义列表",
                options: [
                  { label: "一月", value: "一月" },
                  { label: "二月", value: "二月" },
                  { label: "三月", value: "三月" },
                  { label: "四月", value: "四月" },
                  { label: "五月", value: "五月" },
                  { label: "六月", value: "六月" },
                  { label: "七月", value: "七月" },
                  { label: "八月", value: "八月" },
                  { label: "九月", value: "九月" },
                  { label: "十月", value: "十月" },
                  { label: "十一月", value: "十一月" },
                  { label: "十二月", value: "十二月" },
                ],
              },
            },
          },
          {
            prop: "quarter",
            label: "季度",
            form: {
              comp: {
                name: "el-select",
                placeholder: "自定义列表",
                options: [
                  { label: "第一季度", value: "第一季度" },
                  { label: "第二季度", value: "第二季度" },
                  { label: "第三季度", value: "第三季度" },
                  { label: "第四季度", value: "第四季度" },
                ],
              },
            },
          },
          {
            prop: "score",
            label: "评分",
            width: 80,
            form: {
              comp: {
                name: "el-input-number",
                min: 0,
                max: 100,
                step: 5,
                placeholder: "数值序列",
              },
            },
          },
          {
            prop: "version",
            label: "版本",
            form: {
              comp: {
                name: "el-input",
                placeholder: "文本+数字序列",
              },
            },
          },
        ],
      };
    },
  },
  methods: {
    handleFill(data) {},

    handleSelectionChange(selectedCells) {
      // 可以在这里处理选择变化
    },
  },
};
</script>
