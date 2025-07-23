<template>
  <div>
    <div class="demo-section">
      <h3>弹窗模式</h3>
      <sc-table-select
        v-model="dialogValue"
        :data="tableData"
        :columns="columns"
        labelKey="name"
        useDialog
      />
      <div class="value-display">选中值: {{ getType(dialogValue) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogValue: null,
      tableData: [
        { id: 1, name: "张三", age: 25 },
        { id: 2, name: "李四", age: 30 },
        { id: 3, name: "王五", age: 35 },
        { id: 4, name: "赵六", age: 28 },
        { id: 5, name: "钱七", age: 32 },
        { id: 6, name: "孙八", age: 40 },
      ],
      columns: [
        { label: "ID", prop: "id", width: 80 },
        { label: "姓名", prop: "name" },
        { label: "年龄", prop: "age" },
      ],
    };
  },
  methods: {
    getType(value) {
      if (value === null || value === undefined) {
        return "未选择";
      }
      if (Array.isArray(value)) {
        return JSON.stringify(value);
      }
      return JSON.stringify(value);
    },
  },
};
</script>

<style>
table {
  margin: 0;
}
.demo-section {
  margin-bottom: 20px;
}
.value-display {
  margin-top: 10px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-family: monospace;
}
</style>
