<template>
  <div>
    <sc-crud
      :search.sync="searchForm"
      :options="options"
      :data="data"
      @edit="edit"
      @save="save"
      @cancel="cancel"
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
        editConfig: {
          mode: "row",
          trigger: "manual",
          edit: {
            hasPermi: ["xx:xx:xx"],
          }, // 操作列按钮配置
        },
        renderColumns: [
          { prop: "name", label: "姓名" },
          {
            prop: "gender",
            label: "性别",
          },
          {
            prop: "age",
            label: "年龄",
          },
          {
            prop: "city",
            label: "城市",
          },
          {
            prop: "date",
            label: "日期",
          },
        ],
      };
    },
  },
  methods: {
    edit(done, scope) {
      console.log("edit", scope);
      this.$message.info("点击编辑", scope);
      done();
    },
    save(done, scope) {
      console.log("save", scope);
      this.$message.success("点击保存", scope);
      done();
    },
    cancel(done, scope) {
      console.log("cancel", scope);
      this.$message.warning("点击取消", scope);
      done();
    },
  },
};
</script>
