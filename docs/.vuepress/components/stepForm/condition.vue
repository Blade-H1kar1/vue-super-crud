<template>
  <sc-step-form v-model="formData" :steps="steps"> </sc-step-form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        userType: "",
        personalInfo: {},
        companyInfo: {},
      },
      steps: [
        {
          title: "选择用户类型",
          prop: "userType",
          columns: [
            {
              prop: "type",
              label: "用户类型",
              comp: {
                name: "el-radio-group",
                options: [
                  { label: "个人", value: "personal" },
                  { label: "企业", value: "company" },
                ],
              },
            },
          ],
        },
        {
          title: "个人信息",
          prop: "personalInfo",
          // 只有选择个人用户时显示
          condition: () => this.formData.userType?.type === "personal",
          columns: [
            { prop: "name", label: "姓名" },
            { prop: "idCard", label: "身份证号" },
          ],
        },
        {
          title: "企业信息",
          prop: "companyInfo",
          // 只有选择企业用户时显示
          condition: () => this.formData.userType?.type === "company",
          columns: [
            { prop: "companyName", label: "公司名称" },
            { prop: "licenseNo", label: "营业执照号" },
          ],
        },
      ],
    };
  },
};
</script>
