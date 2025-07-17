import { get } from "lodash-es";
import AsyncValidator from "async-validator";
import { generateRules } from "core";

export default {
  methods: {
    // 从步骤配置中获取校验规则
    getStepValidationRules(step, row) {
      const rules = {};
      const columns = step.columns || [];

      // 遍历列配置生成校验规则
      columns.forEach((column) => {
        const col = column.form || column;
        const prop = col.prop;

        if (!prop) return;

        // 生成校验规则
        const { rules: fieldRules } = generateRules(col, { row });

        if (fieldRules && fieldRules.length > 0) {
          // 移除trigger触发器
          const processedRules = fieldRules.map((rule) => {
            const newRule = { ...rule };
            delete newRule.trigger;
            return newRule;
          });

          rules[prop] = processedRules;
        }
      });

      return rules;
    },

    // 校验表单，可校验指定步骤或所有步骤
    async validate(stepIndex) {
      // 校验当前步骤
      if (stepIndex !== undefined && stepIndex === this.currentStep) {
        try {
          await this.$refs.stepForm?.validate();

          // 执行自定义校验
          if (this.customValidator) {
            return new Promise((resolve, reject) => {
              this.customValidator(resolve, stepIndex);
            });
          }

          return Promise.resolve();
        } catch (error) {
          return Promise.reject({ stepIndex });
        }
      }

      // 校验指定步骤
      if (stepIndex !== undefined) {
        // 跳过不可见步骤
        if (!this.isStepVisible(stepIndex)) {
          return Promise.resolve();
        }

        const step = this.steps[stepIndex];
        const stepProp = this.getStepProp(stepIndex);
        const stepData = this.flattenMode
          ? this.value
          : this.value[stepProp] || {};
        const rules = this.getStepValidationRules(step, stepData);

        // 无校验规则且无自定义校验函数，跳过
        if (Object.keys(rules).length === 0 && !this.customValidator) {
          return Promise.resolve();
        }

        try {
          // 执行标准校验
          if (Object.keys(rules).length > 0) {
            const validator = new AsyncValidator(rules);

            await new Promise((resolve, reject) => {
              validator.validate(stepData, { firstFields: true }, (errors) => {
                errors ? reject(errors) : resolve();
              });
            });
          }

          // 执行自定义校验
          if (this.customValidator) {
            return new Promise((resolve, reject) => {
              this.customValidator(resolve, stepIndex);
            });
          }

          return Promise.resolve();
        } catch (validationErrors) {
          // 发现错误，跳转到当前步骤
          this.goToStep(stepIndex);

          setTimeout(() => {
            this.$refs.stepForm?.validate();
          }, 350);

          return Promise.reject({
            stepIndex,
            error: validationErrors,
          });
        }
      }

      // 校验所有步骤
      try {
        // 遍历所有可见步骤
        for (let i = 0; i < this.steps.length; i++) {
          // 跳过不可见步骤
          if (!this.isStepVisible(i)) continue;

          const step = this.steps[i];
          const stepProp = this.getStepProp(i);
          const stepData = this.flattenMode
            ? this.value
            : this.value[stepProp] || {};
          const rules = this.getStepValidationRules(step, stepData);

          // 无校验规则且无自定义校验函数，跳过
          if (Object.keys(rules).length === 0 && !this.customValidator)
            continue;

          try {
            // 执行标准校验
            if (Object.keys(rules).length > 0) {
              const validator = new AsyncValidator(rules);
              await new Promise((resolve, reject) => {
                validator.validate(
                  stepData,
                  { firstFields: true },
                  (errors) => {
                    errors ? reject(errors) : resolve();
                  }
                );
              });
            }

            // 执行自定义校验
            if (this.customValidator) {
              await new Promise((resolve, reject) => {
                this.customValidator(resolve, i);
              });
            }
          } catch (validationErrors) {
            // 发现错误，跳转到当前步骤
            this.goToStep(i);
            setTimeout(() => this.$refs.stepForm?.validate(), 350);

            return Promise.reject({
              stepIndex: i,
              error: validationErrors,
            });
          }
        }

        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
};
