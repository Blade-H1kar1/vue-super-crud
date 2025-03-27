<template>
  <div>
    <el-button @click="isSelection = !isSelection"
      >切换为批量编辑选中项</el-button
    >
    <el-button @click="isAll = !isAll">切换为编辑所有项</el-button>
    <sc-crud
      ref="crud"
      :search.sync="searchForm"
      :options="options"
      :data="data"
      @batchEdit="batchEdit"
      @batchSave="batchSave"
      @batchCancel="batchCancel"
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
      isSelection: false,
      isAll: false,
    };
  },
  computed: {
    options() {
      return {
        editConfig: {
          mode: "row",
          trigger: "manual",
          batch: {
            isSelect: this.isSelection,
            hasPermi: ["xx:xx:xx"],
          }, // 批量操作按钮配置
        },
        selection: this.isSelection,
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
    batchEdit(done) {
      console.log("batchEdit");
      this.$message.info("点击批量编辑");
      done(this.isAll ? this.data : this.data.slice(0, 2));
    },
    batchSave(done, rows) {
      console.log("batchSave", rows);
      this.$message.success("点击批量保存", rows);
      done();
    },
    batchCancel(done, rows) {
      console.log("batchCancel", rows);
      this.$message.warning("点击批量取消", rows);
      done();
    },
  },
};
</script>
