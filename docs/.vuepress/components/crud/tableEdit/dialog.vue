<template>
  <div>
    <sc-crud
      :search.sync="searchForm"
      :options="options"
      :data="data"
      @add="add"
      @edit="edit"
      @view="view"
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
      options: {
        editConfig: {
          mode: "dialog",
          edit: {},
          add: {
            addType: "first",
          },
          view: {},
          delete: true,
          lastAdd: {},
        },
        dialog: {}, // 自定义弹窗配置
        formOptions: {}, // 自定义表单配置
        renderColumns: [
          {
            prop: "name",
            label: "姓名",
            form: {},
          },
          {
            prop: "gender",
            label: "性别",
            form: {
              comp: {
                name: "el-select",
                options: [
                  { value: "男", label: "男" },
                  { value: "女", label: "女" },
                ],
              },
            },
          },
          {
            prop: "age",
            label: "年龄",
            form: {
              comp: {
                name: "el-select",
                options: [
                  { value: 20, label: "20" },
                  { value: 21, label: "21" },
                  { value: 22, label: "22" },
                  { value: 23, label: "23" },
                ],
              },
            },
          },
          {
            prop: "city",
            label: "城市",
            form: {
              comp: {
                name: "el-select",
                options: [
                  { value: "北京", label: "北京" },
                  { value: "上海", label: "上海" },
                  { value: "广州", label: "广州" },
                  { value: "深圳", label: "深圳" },
                ],
              },
            },
          },
          {
            prop: "date",
            label: "日期",
            form: {
              comp: {
                name: "el-date-picker",
                props: {
                  type: "date",
                  placeholder: "选择日期",
                  valueFormat: "yyyy-MM-dd",
                },
              },
            },
          },
        ],
      },
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
        {
          id: 5,
          name: "孙七",
          gender: "男",
          age: 24,
          city: "成都",
          date: "2021-01-05",
        },
        {
          id: 6,
          name: "周八",
          gender: "女",
          age: 25,
          city: "重庆",
          date: "2021-01-06",
        },
      ],
    };
  },
  methods: {
    add(done, scope) {
      this.$message("点击新增");
      done();
    },
    edit(done, scope) {
      this.$message("点击编辑");
      done();
    },
    view(done, scope) {
      this.$message("点击查看");
      done();
    },
    save(done, scope) {
      setTimeout(() => {
        done();
        this.$message("点击保存");
      }, 500);
    },
  },
};
</script>
