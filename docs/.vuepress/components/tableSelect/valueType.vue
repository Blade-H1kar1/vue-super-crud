<template>
  <div>
    <el-divider content-position="left">单选模式</el-divider>

    <div class="demo-section">
      <h4>对象类型</h4>
      <sc-table-select
        v-model="objectValue"
        :data="userData"
        :columns="singleColumns"
        labelKey="name"
      />
      <div class="value-display">
        <p>当前值: {{ JSON.stringify(objectValue) }}</p>
        <p>类型: {{ getType(objectValue) }}</p>
      </div>
    </div>

    <div class="demo-section">
      <h4>基本类型 (ID)</h4>
      <sc-table-select
        v-model="primitiveValue"
        :data="userData"
        :columns="singleColumns"
        labelKey="name"
        basicType
      />
      <div class="value-display">
        <p>当前值: {{ primitiveValue }}</p>
        <p>类型: {{ getType(primitiveValue) }}</p>
      </div>
    </div>

    <el-divider content-position="left">多选模式</el-divider>

    <div class="demo-section">
      <h4>对象数组</h4>
      <sc-table-select
        v-model="objectArrayValue"
        :data="userData"
        :columns="multipleColumns"
        multiple
        labelKey="name"
      />
      <div class="value-display">
        <p>当前值: {{ JSON.stringify(objectArrayValue) }}</p>
        <p>类型: {{ getType(objectArrayValue) }}</p>
        <p>长度: {{ objectArrayValue ? objectArrayValue.length : 0 }}</p>
      </div>
    </div>

    <div class="demo-section">
      <h4>ID 数组</h4>
      <sc-table-select
        v-model="idArrayValue"
        :data="userData"
        :columns="multipleColumns"
        multiple
        labelKey="name"
        basicType
      />
      <div class="value-display">
        <p>当前值: {{ JSON.stringify(idArrayValue) }}</p>
        <p>类型: {{ getType(idArrayValue) }}</p>
        <p>长度: {{ idArrayValue ? idArrayValue.length : 0 }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 单选值
      objectValue: { id: 1, name: "张三", email: "zhangsan@example.com" },
      primitiveValue: 2,

      // 多选值
      objectArrayValue: [
        { id: 1, name: "张三", email: "zhangsan@example.com" },
        { id: 3, name: "王五", email: "wangwu@example.com" },
      ],
      idArrayValue: [2, 4],

      // 表格数据
      userData: [
        {
          id: 1,
          name: "张三",
          email: "zhangsan@example.com",
          age: 28,
          department: "技术部",
        },
        {
          id: 2,
          name: "李四",
          email: "lisi@example.com",
          age: 32,
          department: "市场部",
        },
        {
          id: 3,
          name: "王五",
          email: "wangwu@example.com",
          age: 25,
          department: "销售部",
        },
        {
          id: 4,
          name: "赵六",
          email: "zhaoliu@example.com",
          age: 30,
          department: "人事部",
        },
        {
          id: 5,
          name: "钱七",
          email: "qianqi@example.com",
          age: 35,
          department: "财务部",
        },
      ],

      // 表格配置
      singleColumns: [
        { prop: "id", label: "ID", width: 80 },
        { prop: "name", label: "姓名", width: 120 },
        { prop: "email", label: "邮箱", width: 200 },
        { prop: "department", label: "部门", width: 120 },
      ],
      multipleColumns: [
        { prop: "id", label: "ID", width: 80 },
        { prop: "name", label: "姓名", width: 120 },
        { prop: "email", label: "邮箱", width: 200 },
        { prop: "department", label: "部门", width: 120 },
      ],
    };
  },
  methods: {
    // 获取值的类型
    getType(value) {
      if (value === null || value === undefined) {
        return String(value);
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return "空数组";
        }
        return `数组<${typeof value[0]}>`;
      }
      return typeof value;
    },
  },
};
</script>

<style scoped>
.demo-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.value-display {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-family: monospace;
}
</style>
