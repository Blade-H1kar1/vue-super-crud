import { batchMerge, mergeTemp } from "utils/mergeTemp";
import { executeFunctionByObject } from "utils";

export function generateRules(item, scope) {
  // 获取经过scope处理后的配置
  const config = executeFunctionByObject(
    {
      required: item.required,
      regular: item.regular,
      limit: item.limit,
      rules: item.rules,
    },
    scope
  );

  const rules = [];
  const rawRules = [];

  // 处理必填规则
  if (config.required) {
    const requiredRule = generateRequiredRule(config.required, item);
    rules.push(requiredRule);
    rules.required = true;
  }

  // 处理长度限制规则
  if (config.limit) {
    rules.push(generateLimitRule(config.limit));
  }

  // 处理正则校验规则
  if (config.regular) {
    const regularRules = generateRegularRules(
      config.regular,
      item,
      scope,
      rawRules
    );
    rules.push(...regularRules);
  }

  // 处理自定义规则
  if (config.rules) {
    const customRules = generateCustomRules(
      config.rules,
      item,
      scope,
      rawRules
    );
    rules.push(...customRules);
  }

  return {
    rules,
    rawRules,
  };
}
function generateRequiredRule(required, item) {
  return mergeTemp("rules", "required", required, { item });
}

function generateLimitRule([min, max]) {
  return {
    min,
    max,
    message:
      min === max ? `请输入 ${min} 个字符` : `请输入 ${min} 到 ${max} 个字符`,
    trigger: "change",
  };
}

function generateRegularRules(regular, item, scope, rawRules) {
  const rules = batchMerge("rules", regular, { item });
  rawRules.push(...rules);
  return handleRegularRule(rules, scope);
}

function generateCustomRules(rules, item, scope, rawRules) {
  const customRules = batchMerge("rules", rules, { item });
  rawRules.push(...customRules);
  return handleRegularRule(customRules, scope);
}

function handleRegularRule(rules, scope) {
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
        return {
          ...item,
          validator: (...args) => {
            validator(...args.slice(0, 3), scope);
          },
        };
      }
      return item;
    }
  });
}
