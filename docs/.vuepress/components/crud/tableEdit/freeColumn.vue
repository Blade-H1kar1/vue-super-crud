<template>
  <div>
    <el-button type="primary" @click="isEdit = !isEdit"
      >切换第三列编辑状态</el-button
    >
    <sc-crud :search.sync="searchForm" :options="options" :data="data">
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
        },
        {
          id: 2,
          name: "李四",
          gender: "女",
          age: 21,
          city: "上海",
          date: "2021-01-02",
        },
        {
          id: 3,
          name: "王五",
          gender: "男",
          age: 22,
          city: "广州",
          date: "2021-01-03",
        },
        {
          id: 4,
          name: "赵六",
          gender: "女",
          age: 23,
          city: "深圳",
          date: "2021-01-04",
        },
      ],
      isEdit: true,
    };
  },
  computed: {
    options() {
      return {
        renderColumns: [
          { prop: "name", label: "姓名" },
          {
            prop: "gender",
            label: "性别",
            isEdit: true,
          },
          {
            prop: "age",
            label: "年龄",
            isEdit: this.isEdit,
          },
          {
            prop: "city",
            label: "城市",
          },
          {
            prop: "date",
            label: "日期",
            isEdit: true,
          },
        ],
      };
    },
  },
};
</script>
