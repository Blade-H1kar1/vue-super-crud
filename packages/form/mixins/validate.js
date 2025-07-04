import { scrollToFirstError } from "../utils/formHelpers";

export default {
  methods: {
    // 验证表单
    validate(callBack) {
      return new Promise((resolve, reject) => {
        this.$refs.formRef.validate((valid, obj) => {
          if (!valid) {
            reject(obj);
            callBack && callBack(false);
            if (this.formOptions.scrollError) {
              scrollToFirstError(obj, this.$refs);
            }
          } else {
            callBack && callBack(true);
            resolve();
          }
        });
      });
    },

    // 提交表单
    async submit() {
      await this.validate();
      this.loadingStatus = true;
      this.runBefore(
        "submit",
        () => {
          this.loadingStatus = false;
        },
        this.value
      );
    },

    // 清除验证
    clearValidate(prop) {
      this.$refs.formRef && this.$refs.formRef.clearValidate(prop);
    },

    // 验证字段
    validateField(prop) {
      this.$refs.formRef && this.$refs.formRef.validateField(prop);
    },
  },
};
