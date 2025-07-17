<template>
  <div>
    <sc-step-form v-model="formData" :steps="steps"> </sc-step-form>

    <!-- 展示当前表单数据 -->
    <div class="form-data-display">
      <h4>当前表单数据 (基础模式)</h4>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      steps: [
        {
          title: "基本信息",
          description: "请填写基本信息",
          prop: "basicInfo", // 自定义数据对象的key
          columns: [
            { prop: "name", label: "姓名" },
            { prop: "age", label: "年龄" },
          ],
        },
        {
          title: "联系方式",
          description: "请填写联系方式",
          prop: "contactInfo",
          columns: [
            { prop: "phone", label: "电话" },
            { prop: "email", label: "邮箱" },
          ],
        },
        {
          title: "确认信息",
          description: "请确认所有信息",
          prop: "confirmInfo",
          columns: [
            {
              prop: "agree",
              label: "同意协议",
              comp: { name: "el-checkbox" },
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped>
.form-data-display {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f9fafc;
}

.form-data-display pre {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  max-height: 200px;
  overflow: auto;
}
</style>
