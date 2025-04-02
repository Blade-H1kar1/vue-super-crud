<template>
  <div>
    <div class="demo-section">
      <h3>方法调用示例：</h3>
      <el-button @click="setFirstRowEdit">设置第一行编辑</el-button>
      <el-button @click="setMultiRowEdit">设置多行编辑</el-button>
      <el-button @click="cancelRowEdit">取消编辑</el-button>
      <el-button @click="saveRowEdit">保存编辑</el-button>
    </div>

    <div style="margin-bottom: 20px;">
      <h3>其他操作：</h3>
      <el-button @click="addNewRow">新增行</el-button>
      <el-button @click="addNewRowToFirst">新增至首行</el-button>
      <el-button @click="clearAllEditStatus">清除所有编辑</el-button>
      <el-button @click="showEditingStatus">显示编辑状态</el-button>
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
      ],
    };
  },
  computed: {
    options() {
      return {
        editConfig: {
          mode: "row",
          trigger: "manual",
          edit: true,
        },
        renderColumns: [
          { prop: "name", label: "姓名" },
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
          { prop: "age", label: "年龄" },
          { prop: "city", label: "城市" },
          { prop: "date", label: "日期" },
        ],
      };
    },
  },
  methods: {
    // 设置第一行进入编辑状态
    setFirstRowEdit() {
      const firstRow = this.data[0];
      this.$refs.crud.setRowEdit(firstRow, {
        type: "edit",
        prop: "name", // 聚焦到name列
      });
    },

    // 设置多行进入编辑状态
    setMultiRowEdit() {
      const rows = this.data.slice(0, 2); // 获取前两行
      this.$refs.crud.setRowEdit(rows, { type: "edit" });
    },

    // 取消编辑状态
    cancelRowEdit() {
      const editingRows = this.$refs.crud.getEditingRows();
      this.$refs.crud.setRowEdit(editingRows, { type: "cancel" });
    },

    // 保存编辑状态
    saveRowEdit() {
      const editingRows = this.$refs.crud.getEditingRows();
      this.$refs.crud.setRowEdit(editingRows, { type: "save" });
    },

    // 新增行
    addNewRow() {
      this.$refs.crud.addRow({
        name: "新用户",
        gender: "男",
        age: 25,
      });
    },

    // 在首行新增
    addNewRowToFirst() {
      this.$refs.crud.addRow(
        {
          name: "新用户",
          gender: "男",
          age: 25,
        },
        "first"
      );
    },

    // 清除所有编辑状态
    clearAllEditStatus() {
      this.$refs.crud.clearAllEdit();
    },

    // 显示编辑状态信息
    showEditingStatus() {
      // 获取所有编辑状态的行
      const editingRows = this.$refs.crud.getEditingRows();
      console.log("正在编辑的行:", editingRows);
    },
  },
};
</script>
