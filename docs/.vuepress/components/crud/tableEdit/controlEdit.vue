<template>
  <div>
    <div class="demo-section">
      <h3>控制行编辑状态：</h3>
      <el-button @click="handleRowChange(0)">禁用第一行</el-button>
      <el-button @click="handleRowChange(1)">禁用第二行</el-button>
      <el-button @click="handleRowChange(2)">禁用第三行</el-button>
      <el-button @click="handleRowChange(null)">取消禁用</el-button>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>控制列编辑状态：</h3>
      <el-button @click="handleColumnChange('name')">禁用姓名列</el-button>
      <el-button @click="handleColumnChange('gender')">禁用性别列</el-button>
      <el-button @click="handleColumnChange('age')">禁用年龄列</el-button>
      <el-button @click="handleColumnChange(null)">取消禁用</el-button>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>控制单元格编辑状态：</h3>
      <el-button @click="handleCellChange('name')"
        >禁用姓名第一个单元格</el-button
      >
      <el-button @click="handleCellChange('gender')"
        >禁用性别第一个单元格</el-button
      >
      <el-button @click="handleCellChange('age')"
        >禁用年龄第一个单元格</el-button
      >
      <el-button @click="handleCellChange(null)">取消禁用</el-button>
    </div>

    <sc-crud
      :search.sync="searchForm"
      ref="crud"
      :options="options"
      :data="data"
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
      disabledRowIndex: null,
      disabledCellProp: null,
      disabledCell: { row: null, prop: null },
    };
  },
  computed: {
    options() {
      return {
        editConfig: {
          mode: "row",
          batch: true,
          edit: true,
          isRowEdit: ({ row, $index }) => {
            // 如果设置了禁用行索引，则该行不可编辑
            if (this.disabledRowIndex !== null) {
              return $index !== this.disabledRowIndex;
            }
            return true;
          },
        },
        renderColumns: [
          {
            prop: "name",
            label: "姓名",
            isEdit: ({ row, $index }) => {
              if (
                this.disabledCell.row === 0 &&
                this.disabledCell.prop === "name"
              ) {
                return $index !== 0;
              }
              return this.disabledCellProp !== "name";
            },
          },
          {
            prop: "gender",
            label: "性别",
            isEdit: ({ row, $index }) => {
              if (
                this.disabledCell.row === 0 &&
                this.disabledCell.prop === "gender"
              ) {
                return $index !== 0;
              }
              return this.disabledCellProp !== "gender";
            },
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
            isEdit: ({ row, $index }) => {
              if (
                this.disabledCell.row === 0 &&
                this.disabledCell.prop === "age"
              ) {
                return $index !== 0;
              }
              return this.disabledCellProp !== "age";
            },
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
                  format: "yyyy-MM-dd",
                  valueFormat: "yyyy-MM-dd",
                },
              },
            },
          },
        ],
      };
    },
  },
  methods: {
    // 控制行编辑状态
    handleRowChange(index) {
      this.disabledRowIndex = index;
      this.$refs.crud.clearAllEdit();
    },

    // 控制单元格编辑状态
    handleColumnChange(prop) {
      this.disabledCellProp = prop;
      this.$refs.crud.clearAllEdit();
    },
    handleCellChange(prop) {
      if (prop === null) {
        this.disabledCell = { row: null, prop: null };
      } else {
        // 设置第一行的指定列单元格为禁用状态
        this.disabledCell = { row: 0, prop };
      }
      this.$refs.crud.clearAllEdit();
    },
  },
};
</script>
