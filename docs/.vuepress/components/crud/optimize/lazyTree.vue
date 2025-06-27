<template>
  <div>
    <el-button type="primary" @click="handleRender" :disabled="loading">
      开始渲染
    </el-button>
    <el-switch
      v-model="autoLazy"
      active-text="自动树级懒加载"
      inactive-text="普通渲染"
      style="margin-left: 20px;"
      :disabled="loading"
    />
    <span v-if="renderTime !== null" style="margin-left: 16px;">
      渲染耗时：<b>{{ renderTime }}</b> ms
    </span>
    <sc-crud
      v-if="showTable"
      row-key="id"
      :loading.sync="loading"
      :options="crudOptions"
      :data="data"
      :total="total"
      @getList="getList"
    >
    </sc-crud>
  </div>
</template>

<script>
import { mockApi } from "../../mock";
function createTreeData(
  level = 3,
  childrenCount = 5,
  curLevel = 1,
  parentId = null,
  prefix = ""
) {
  // 递归生成树形结构
  const arr = [];
  for (let i = 0; i < childrenCount; i++) {
    const id = prefix + (parentId ? parentId + "-" : "") + (i + 1);
    const node = {
      id,
      name: `节点${id}`,
      gender: i % 2 === 0 ? "男" : "女",
      age: 20 + i,
      birthday: "2000-01-01",
      city: ["北京", "上海", "广州", "深圳"][i % 4],
      email: `user${id}@test.com`,
      status: "正常",
      score: Math.round(Math.random() * 100),
      children: [],
    };
    if (curLevel < level) {
      node.children = createTreeData(
        level,
        childrenCount,
        curLevel + 1,
        id,
        prefix
      );
    } else {
      delete node.children;
    }
    arr.push(node);
  }
  return arr;
}
export default {
  data() {
    return {
      loading: false,
      showTable: false,
      renderTime: null,
      startTime: 0,
      autoLazy: true,
      options: {
        border: true,
        init: true,
        editConfig: {
          mode: "free",
        },
        height: "500px",
        isTree: true,
        valueKey: "id",
        childrenKey: "children",
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
        renderColumns: [
          { prop: "name", label: "姓名", isEdit: false },
          {
            prop: "gender",
            label: "性别",
            form: {
              comp: {
                name: "el-select",
                options: [
                  { label: "男", value: "男" },
                  { label: "女", value: "女" },
                ],
              },
            },
          },
          { prop: "age", label: "年龄" },
          {
            prop: "birthday",
            label: "生日",
            form: {
              comp: {
                name: "el-date-picker",
                type: "date",
                valueFormat: "yyyy-MM-dd",
              },
            },
          },
          {
            prop: "city",
            label: "城市",
            width: 100,
            form: {
              comp: {
                name: "el-select",
                options: [
                  { label: "北京", value: "北京" },
                  { label: "上海", value: "上海" },
                  { label: "广州", value: "广州" },
                  { label: "深圳", value: "深圳" },
                ],
              },
            },
          },
          { prop: "email", label: "邮箱" },
          { prop: "status", label: "状态" },
          { prop: "score", label: "分数" },
        ],
      },
      data: [],
      total: 0,
    };
  },
  computed: {
    crudOptions() {
      return {
        ...this.options,
        autoLazy: this.autoLazy,
      };
    },
  },
  methods: {
    async handleRender() {
      this.renderTime = null;
      this.showTable = false;
      this.data = [];
      this.total = 0;
      await this.$nextTick();
      this.startTime = performance.now();
      this.showTable = true;
    },
    async getList() {
      this.loading = true;
      this.startTime = performance.now();
      try {
        // 生成大数据量树形结构（如3级，每级5个节点，总共155个节点，或自行调整参数）
        const treeData = createTreeData(3, 5); // 4级，每级8个节点，总量较大
        // 统计总节点数
        function countNodes(arr) {
          let count = 0;
          arr.forEach((node) => {
            count++;
            if (node.children) count += countNodes(node.children);
          });
          return count;
        }
        this.data = treeData;
        this.total = countNodes(treeData);
        this.$nextTick(() => {
          this.renderTime = Math.round(performance.now() - this.startTime);
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
