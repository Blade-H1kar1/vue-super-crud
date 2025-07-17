<template>
  <sc-step-form v-model="formData" :steps="steps"> </sc-step-form>
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      steps: [
        {
          title: "基本信息",
          prop: "basicInfo",
          columns: [
            {
              prop: "name",
              label: "姓名",
              required: true,
            },
            {
              prop: "age",
              label: "年龄",
              required: true,
            },
          ],
        },
        {
          title: "联系方式",
          prop: "contactInfo",
          columns: [
            {
              prop: "phone",
              label: "电话",
              required: true,
              rules: [
                {
                  regular: /^1[3-9]\d{9}$/,
                  message: "请输入正确的手机号",
                  trigger: "blur",
                },
              ],
            },
          ],
        },
      ],
    };
  },
};
</script>
