<template>
  <sc-step-form v-model="formData" :steps="steps">
    <!-- 自定义第一步中name字段的前缀 -->
    <template v-slot:form-0-name="{ row }">
      <el-select v-model="row.title" placeholder="称呼">
        <el-option label="先生" value="Mr."></el-option>
        <el-option label="女士" value="Ms."></el-option>
      </el-select>
    </template>

    <!-- 自定义第二步中phone字段的后缀 -->
    <template v-slot:form-1-phone-right="{ row }">
      <el-button @click="verifyPhone(row.phone)">验证</el-button>
    </template>
  </sc-step-form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        basicInfo: {
          title: "Mr.",
          name: "",
        },
        contact: {
          phone: "",
          email: "",
        },
      },
      steps: [
        {
          title: "基本信息",
          prop: "basicInfo",
          columns: [
            { prop: "name", label: "姓名", comp: { name: "el-input" } },
            { prop: "age", label: "年龄", comp: { name: "el-input-number" } },
          ],
        },
        {
          title: "联系方式",
          prop: "contact",
          columns: [
            {
              prop: "phone",
              label: "手机号",
              comp: { name: "el-input" },
              position: true,
            },
            { prop: "email", label: "邮箱", comp: { name: "el-input" } },
          ],
        },
      ],
    };
  },
  methods: {
    verifyPhone(phone) {
      if (!phone) {
        this.$message.error("请输入手机号");
        return;
      }

      // 模拟验证过程
      const isValid = /^1[3-9]\d{9}$/.test(phone);

      if (isValid) {
        this.$message.success("手机号验证通过");
      } else {
        this.$message.error("请输入正确的手机号");
      }
    },
  },
};
</script>
