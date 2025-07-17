<template>
  <div>
    <sc-step-form
      v-model="formData"
      :steps="steps"
      :customValidator="customValidator"
      @submit="handleSubmit"
      @success="handleSuccess"
      @error="handleError"
    ></sc-step-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        step1: {
          name: "",
          age: "",
        },
        step2: {
          email: "",
          phone: "",
        },
      },
      steps: [
        {
          title: "基本信息",
          description: "请填写您的基本信息",
          prop: "step1",
          columns: [
            {
              label: "姓名",
              prop: "name",
              component: "el-input",
              required: true,
            },
            {
              label: "年龄",
              prop: "age",
              component: "el-input-number",
              required: true,
            },
          ],
        },
        {
          title: "联系方式",
          description: "请填写您的联系方式",
          prop: "step2",
          columns: [
            {
              label: "邮箱",
              prop: "email",
              component: "el-input",
              required: true,
            },
            {
              label: "电话",
              prop: "phone",
              component: "el-input",
              required: true,
            },
          ],
        },
      ],
      submitted: false,
    };
  },
  methods: {
    // 自定义校验函数
    customValidator(resolve, stepIndex) {
      const formData = this.formData;
      // 第一步的自定义校验
      if (stepIndex === 0) {
        if (formData.step1.age && parseInt(formData.step1.age) < 18) {
          this.$message.error("年龄必须大于或等于18岁");
          return;
        }
      }
      resolve();
    },

    handleSubmit(data) {
      console.log("表单提交", data);
      // 模拟提交
      setTimeout(() => {
        this.$emit("success", data);
      }, 1000);
    },

    handleSuccess(data) {
      this.submitted = true;
      this.$message.success("表单提交成功");
    },

    handleError(error) {
      this.$message.error(`表单提交失败: ${error.message || "未知错误"}`);
    },
  },
};
</script>
