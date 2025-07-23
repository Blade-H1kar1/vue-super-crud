<template>
  <div class="position-demo">
    <h3>下拉模式自定义方位</h3>
    <sc-table-select
      v-model="dropdownValue"
      :tableOptions="tableOptions"
      :data="userData"
      placeholder="请选择用户"
      labelKey="name"
    >
      <!-- 表格内容顶部 -->
      <template #content-top="scope">
        <div class="custom-position-content top-content">
          <el-tag type="success">表格顶部内容</el-tag>
        </div>
      </template>

      <!-- 表格内容底部 -->
      <template #content-bottom="scope">
        <div class="custom-position-content bottom-content">
          <el-tag type="success">表格底部内容</el-tag>
        </div>
      </template>
      <template #name="scope">
        <el-tag type="success">姓名</el-tag>
      </template>
    </sc-table-select>

    <h3 style="margin-top: 20px">弹窗模式自定义方位</h3>
    <sc-table-select
      v-model="dialogValue"
      :tableOptions="tableOptions"
      :data="userData"
      placeholder="请选择用户"
      labelKey="name"
      useDialog
    >
      <!-- 弹窗表格内容顶部 -->
      <template #content-top="scope">
        <div class="custom-position-content top-content">
          <el-tag type="success">表格顶部内容</el-tag>
        </div>
      </template>

      <!-- 弹窗表格内容底部 -->
      <template #content-bottom="scope">
        <div class="custom-position-content bottom-content">
          <el-tag type="success">表格底部内容</el-tag>
        </div>
      </template>
    </sc-table-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropdownValue: null,
      dialogValue: null,
      userData: [
        {
          id: 1,
          name: "张三",
          email: "zhangsan@example.com",
          department: "技术部",
        },
        {
          id: 2,
          name: "李四",
          email: "lisi@example.com",
          department: "产品部",
        },
        {
          id: 3,
          name: "王五",
          email: "wangwu@example.com",
          department: "设计部",
        },
        {
          id: 4,
          name: "赵六",
          email: "zhaoliu@example.com",
          department: "运营部",
        },
        {
          id: 5,
          name: "钱七",
          email: "qianqi@example.com",
          department: "技术部",
        },
      ],
      tableOptions: {
        singleSelection: {
          banner: false,
          ctrlSelect: true,
        },
        renderColumns: [
          { prop: "id", label: "ID", width: 80 },
          { prop: "name", label: "姓名", width: 120 },
          { prop: "email", label: "邮箱", width: 200 },
          { prop: "department", label: "部门", width: 120 },
        ],
      },
    };
  },
  methods: {},
};
</script>

<style scoped>
.position-demo {
  margin: 20px 0;
}

.custom-position-content {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-position-content.top-content {
  border-bottom: 1px dashed #dcdfe6;
  margin-bottom: 8px;
}

.custom-position-content.bottom-content {
  border-top: 1px dashed #dcdfe6;
  margin-top: 8px;
}

.position-info {
  margin-left: 10px;
  color: #606266;
  font-size: 12px;
}
</style>
