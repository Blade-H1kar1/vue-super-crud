<template>
  <div>
    <sc-crud
      :selected="selectedRows"
      :options="options"
      :data="data"
      @selection-change="handleSelectionChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedRows: [],
      options: {
        selection: true,
        renderColumns: [
          { prop: "name", label: "姓名" },
          { prop: "gender", label: "性别" },
        ],
      },
      data: [
        { id: 1, name: "张三", gender: "男" },
        { id: 2, name: "李四", gender: "女" },
      ],
    };
  },
  methods: {
    handleSelectionChange(selection) {
      this.$message.success(`选中 ${selection.length} 条数据`);
    },
    handleSelect(selection, row) {
      this.$message.info(
        `${row.name} ${selection.includes(row) ? "被选中" : "取消选中"}`
      );
    },
    handleSelectAll(selection) {
      this.$message.info(`${selection.length ? "全选" : "取消全选"}`);
    },
  },
};
</script>
