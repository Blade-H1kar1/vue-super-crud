<template>
  <sc-step-form
    v-model="formData"
    :steps="steps"
    @step-change="handleStepChange"
    @submit="handleSubmit"
  >
  </sc-step-form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        basicInfo: {
          name: "",
          age: null,
        },
        contact: {
          phone: "",
          email: "",
        },
        confirm: {
          agree: false,
        },
      },
      steps: [
        {
          title: "基本信息",
          prop: "basicInfo",
          columns: [
            { prop: "name", label: "姓名", required: true },
            { prop: "age", label: "年龄", comp: { name: "el-input-number" } },
          ],
        },
        {
          title: "联系方式",
          prop: "contact",
          columns: [
            { prop: "phone", label: "电话", required: true },
            { prop: "email", label: "邮箱", required: true },
          ],
        },
        {
          title: "确认信息",
          prop: "confirm",
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
  methods: {
    handleStepChange({ from, to, step }) {
      this.$message.info(`步骤从 ${from + 1} 变更为 ${to + 1}`);
    },
    handleSubmit(formData) {
      this.$message.info("正在提交表单...");

      // 模拟异步提交
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.3) {
            resolve({ success: true });
          } else {
            reject(new Error("提交失败"));
          }
        }, 1000);
      });
    },
  },
};
</script>
