import { batchMerge, mergeTemp } from "utils/mergeTemp";
import { isFunction } from "lodash-es";
import { executeFunctionByObject } from "utils";
export default {
  methods: {
    generateRules(item, scope) {
      const config = executeFunctionByObject(
        {
          required: item.required,
          regular: item.regular,
          rules: item.rules,
        },
        scope
      );
      let rules = [];
      if (config.required) {
        const required = mergeTemp("rules", "required", config.required, {
          item,
        });
        rules.push(required);
        rules.required = true;
      }
      if (config.regular) {
        let regulars = batchMerge("rules", config.regular, {
          item,
        });
        regulars = this.handleRegularRule(regulars, scope);
        rules.push(...regulars);
      }
      if (config.rules) {
        let mergeRules = batchMerge("rules", config.rules, {
          item,
        });
        mergeRules = this.handleRegularRule(mergeRules, scope);
        rules.push(...mergeRules);
      }
      return rules;
    },
    handleRegularRule(rules, scope) {
      return rules.map((item) => {
        if (item.regular && item.msg) {
          return {
            validator: (rule, value, callback) => {
              if (!value || item.regular.test(value)) {
                callback();
              } else {
                callback(new Error(item.msg));
              }
            },
            trigger: item.trigger || "change",
            message: item.msg,
          };
        } else {
          if (item.validator) {
            const validator = item.validator;
            item.validator = (...args) => validator(...args, scope);
          }
          return item;
        }
      });
    },
  },
};
