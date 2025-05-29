<template>
  <div>
    <sc-crud
      :search.sync="searchForm"
      :options="options"
      :data="data"
      @edit="edit"
      @save="save"
      @cancel="cancel"
      @add="add"
      @delete="handleDelete"
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
          name: "部门1",
          manager: "张三",
          count: 10,
          children: [
            {
              id: 11,
              name: "子部门1-1",
              manager: "李四",
              count: 5,
              children: [
                {
                  id: 111,
                  name: "子部门1-1-1",
                  manager: "王五",
                  count: 2,
                },
              ],
            },
            {
              id: 12,
              name: "子部门1-2",
              manager: "赵六",
              count: 3,
            },
          ],
        },
        {
          id: 2,
          name: "部门2",
          manager: "钱七",
          count: 8,
          children: [
            {
              id: 21,
              name: "子部门2-1",
              manager: "孙八",
              count: 4,
            },
          ],
        },
      ],
    };
  },
  computed: {
    options() {
      return {
        // 编辑配置
        editConfig: {
          mode: "row",
          trigger: "manual",
          // 编辑
          edit: true,
          // 批量编辑
          batch: true,
          // 新增
          add: true,
          // 新增子节点
          addChild: true,
          // 删除
          delete: {
            confirm: (scope) => `是否删除${scope.row.name}及其子部门？`,
          },
          batchDelete: true,
        },
        selection: true,
        // 表格列配置
        renderColumns: [
          {
            prop: "name",
            label: "部门名称",
            width: 200,
          },
          {
            prop: "manager",
            label: "负责人",
            form: {
              comp: {
                name: "el-select",
                options: [
                  { label: "张三", value: "张三" },
                  { label: "李四", value: "李四" },
                  { label: "王五", value: "王五" },
                  { label: "赵六", value: "赵六" },
                  { label: "钱七", value: "钱七" },
                  { label: "孙八", value: "孙八" },
                ],
              },
            },
          },
          {
            prop: "count",
            label: "人数",
          },
        ],
      };
    },
  },
  methods: {
    // 编辑事件
    edit(done, scope) {
      console.log("编辑节点", scope);
      this.$message.info(`编辑部门：${scope.row.name}`);
      done();
    },
    // 保存事件
    save(done, scope) {
      console.log("保存节点", scope);
      this.$message.success(`保存部门：${scope.row.name}`);
      done();
    },
    // 取消事件
    cancel(done, scope) {
      console.log("取消编辑", scope);
      this.$message.warning(`取消编辑：${scope.row.name}`);
      done();
    },
    // 新增事件
    add(done, scope, parentRow) {
      console.log("新增节点", scope, parentRow);
      const type = parentRow ? "子部门" : "部门";
      this.$message.success(`新增${type}：${scope.row.name}`);
      done();
    },
    // 删除事件
    handleDelete(done, scope) {
      console.log("删除节点", scope);
      this.$message.success(`删除部门：${scope.row.name}`);
      done();
    },
    // 添加子节点
    handleAddChild(scope) {
      this.$refs.crud.handleRowAdd({}, "last", scope.row);
    },
  },
};
</script>
