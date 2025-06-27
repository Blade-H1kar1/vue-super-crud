<template>
  <div>
    <el-button @click="visible = !visible">visible</el-button>
    <sc-crud
      v-if="visible"
      init
      :search.sync="searchForm"
      :options="options"
      :data="data"
      :total="total"
      @getList="getList"
    >
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
      searchForm: {
        pageSize: 1000,
      },
      options: {
        // action: {
        //   width: "200",
        // },
        editConfig: {
          mode: "row",
          trigger: "click",
          // edit: true,
        },
        height: "auto", // 设置为`auto`，会自适应窗口高度，配合calcHeight参数去调节范围
        renderColumns: [
          { prop: "name", label: "输入框", required: true, search: true },
          {
            prop: "select",
            label: "选择器",
            search: true,
            // comp: {
            //   name: "el-select",
            //   options: [
            //     { value: "1", label: "选项1" },
            //     { value: "2", label: "选项2" },
            //   ],
            // },
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
            search: {
              alwaysShow: true,
            },
            // comp: {
            //   name: "el-cascader",
            //   options: [
            //     {
            //       value: "1",
            //       label: "选项1",
            //       children: [
            //         { value: "1-1", label: "选项1-1" },
            //         { value: "1-2", label: "选项1-2" },
            //       ],
            //     },
            //     {
            //       value: "2",
            //       label: "选项2",
            //       children: [
            //         { value: "2-1", label: "选项2-1" },
            //         { value: "2-2", label: "选项2-2" },
            //       ],
            //     },
            //   ],
            // },
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
      },
      allData: [],
      data: [],
      total: 0,
    };
  },
  mounted() {
    this.allData = this.generateData(10000);
  },
  methods: {
    getList() {
      setTimeout(() => {
        const { pageNum, pageSize } = this.searchForm;
        const start = (pageNum - 1) * pageSize;
        const end = pageNum * pageSize;

        // 模拟分页数据
        this.data = this.allData.slice(start, end);
        this.total = this.allData.length;
      }, 0);
    },
    generateData(count) {
      const baseData = [
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
      ];

      const cities = [
        "北京",
        "上海",
        "广州",
        "深圳",
        "杭州",
        "成都",
        "武汉",
        "西安",
      ];
      const names = ["张", "李", "王", "赵", "钱", "孙", "周", "吴"];
      const colors = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C", "#909399"];

      return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        name: names[Math.floor(Math.random() * names.length)] + "某某",
        gender: Math.random() > 0.5 ? "男" : "女",
        age: Math.floor(Math.random() * 40) + 18, // 18-57岁
        city: cities[Math.floor(Math.random() * cities.length)],
        date: this.randomDate("2020-01-01", "2024-12-31"),
        time: this.randomTime(),
        datetime:
          this.randomDate("2020-01-01", "2024-12-31") + " " + this.randomTime(),
        color: colors[Math.floor(Math.random() * colors.length)],
        switch: Math.random() > 0.5,
        rate: Math.floor(Math.random() * 5) + 1,
        slider: Math.floor(Math.random() * 100),
        radio: Math.random() > 0.5 ? "1" : "2",
        checkbox: [Math.random() > 0.5 ? "1" : "2"],
        select: Math.random() > 0.5 ? "1" : "2",
        cascader: Math.random() > 0.5 ? ["1", "1-1"] : ["2", "2-1"],
        textarea: "这是第" + (index + 1) + "条随机生成的文本",
        number: Math.floor(Math.random() * 1000),
      }));
    },
    randomDate(start, end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const randomTime =
        startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime());
      const date = new Date(randomTime);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    },
    randomTime() {
      const hours = String(Math.floor(Math.random() * 24)).padStart(2, "0");
      const minutes = String(Math.floor(Math.random() * 60)).padStart(2, "0");
      const seconds = String(Math.floor(Math.random() * 60)).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    },
  },
};
</script>
