<template>
  <div>
    <sc-step-form
      v-model="formData"
      :steps="steps"
      :flatten-mode="true"
      @step-change="onStepChange"
    >
    </sc-step-form>

    <!-- 展示当前表单数据 -->
    <div class="form-data-display">
      <h4>当前表单数据 (扁平模式)</h4>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: "张三",
        age: 28,
      }, // 所有步骤数据将合并到这个对象中
      currentStep: 0,
      steps: [
        {
          title: "基本信息",
          fields: ["name", "age"], // 指定该步骤关联的字段
          columns: [
            { prop: "name", label: "姓名", comp: { name: "el-input" } },
            { prop: "age", label: "年龄", comp: { name: "el-input-number" } },
          ],
        },
        {
          title: "联系方式",
          fields: ["phone", "email"],
          columns: [
            { prop: "phone", label: "电话", comp: { name: "el-input" } },
            { prop: "email", label: "邮箱", comp: { name: "el-input" } },
          ],
        },
        {
          title: "其他信息",
          fields: ["address", "remark"],
          columns: [
            { prop: "address", label: "地址" },
            {
              prop: "remark",
              label: "备注",
              comp: {
                name: "el-input",
                type: "textarea",
                rows: 3,
              },
            },
          ],
        },
      ],
    };
  },
  methods: {
    onStepChange({ from, to }) {
      this.currentStep = to;

      // 可以在这里添加一些提示信息
      this.$nextTick(() => {
        if (to === 1 && !this.formData.phone) {
          // 为了演示，预填一些数据
          this.$set(this.formData, "phone", "13800138000");
        }
      });
    },
  },
  mounted() {
    // 初始化当前步骤
    this.currentStep = 0;
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
