export function getComponentConfig(vnode) {
  const instance = getRealComponent(vnode);
  if (!instance) return null;

  const name = instance.$options.name;
  const props = instance.$props || {};
  const attrs = instance.$attrs || {};

  
  // 公共配置
  const commonConfig = {
    ...props,
    ...attrs,
    disabled: !!instance.disabled,
  };

  // 特殊配置组件
  const specialConfig = {
    ElInput: {
      type: "input",
      subtype: props.type || "text",
    },
    ElInputNumber: {
      type: "number",
    },
    ElSelect: {
      type: "select",
      options: getSelectOptions(instance),
    },
    ElDatePicker: {
      type: "date",
      pickerType: props.type || "date",
    },
    ElRadioGroup: {
      type: "radio",
      options: getRadioOptions(instance),
    },
    ElRadio: {
      type: "radio",
      options: [
        {
          label: instance.label,
          value: instance.value ?? instance.label,
        },
      ],
    },
    ElRadioButton: {
      type: "radio",
      options: [
        {
          label: instance.label,
          value: instance.value ?? instance.label,
        },
      ],
    },
    ElCheckboxGroup: {
      type: "checkbox",
      options: getCheckboxOptions(instance),
    },
  };

  // 简单组件配置
  const simpleTypes = {
    ElTimePicker: "time",
    ElTimeSelect: "time",
    ElCheckbox: "checkbox",
    ElCascader: "cascader",
    ElSlider: "slider",
    ElRate: "rate",
    ElTransfer: "transfer",
    ElSwitch: "switch",
  };

  if (specialConfig[name]) {
    return {
      ...commonConfig,
      ...specialConfig[name],
    };
  }

  if (simpleTypes[name]) {
    return {
      ...commonConfig,
      type: simpleTypes[name],
    };
  }

  return null;
}

/**
 * 获取选择器的选项
 */
function getSelectOptions(instance) {
  return findChildComponents(instance, {
    name: "ElOption",
    multiple: true,
  }).map((option) => ({
    label: option.label,
    value: option.value ?? option.label,
    disabled: !!option.disabled,
  }));
}

/**
 * 获取单选框组的选项
 */
function getRadioOptions(instance) {
  return findChildComponents(instance, {
    name: ["ElRadio", "ElRadioButton"],
    multiple: true,
  }).map((radio) => ({
    label: radio.label,
    value: radio.value ?? radio.label,
    disabled: !!radio.disabled,
  }));
}

/**
 * 获取复选框组的选项
 */
function getCheckboxOptions(instance) {
  return findChildComponents(instance, {
    name: "ElCheckbox",
    multiple: true,
  }).map((checkbox) => ({
    label: checkbox.label,
    value: checkbox.value ?? checkbox.label,
    disabled: !!checkbox.disabled,
  }));
}

/**
 * 获取真实组件实例
 */
function getRealComponent(vnode) {
  if (!vnode?.componentInstance) return;

  let instance = vnode.componentInstance;
  let name = instance.$options.name;

  // el表单组件
  const formComponents = [
    "ElInput",
    "ElInputNumber",
    "ElSelect",
    "ElDatePicker",
    "ElTimePicker",
    "ElTimeSelect",
    "ElRadioGroup",
    "ElRadio",
    "ElCheckboxGroup",
    "ElCheckbox",
    "ElCascader",
    "ElSwitch",
    "ElSlider",
    "ElRate",
    "ElColorPicker",
    "ElUpload",
    "ElTransfer",
  ];

  while (instance && !formComponents.includes(name)) {
    const children = instance.$children || [];
    const childInstance = children[0];
    if (!childInstance) break;
    instance = childInstance;
    name = instance.$options.name;
  }

  return instance;
}

/**
 * 查找特定子组件
 * @param {Object} instance - 组件实例
 * @param {Object} options - 查找选项
 * @param {String} options.name - 组件名称
 * @param {Function} options.filter - 自定义过滤函数
 * @param {Boolean} options.deep - 是否深度查找，默认true
 * @param {Boolean} options.multiple - 是否查找多个，默认false
 * @returns {Array|Object|null} - 返回找到的组件实例
 */
export function findChildComponents(instance, options = {}) {
  const { name, filter, deep = true, multiple = false } = options;

  if (!instance?.$children) {
    return multiple ? [] : null;
  }

  // 处理名称匹配逻辑
  const matchName = (componentName) => {
    if (!name) return true;
    if (Array.isArray(name)) {
      return name.includes(componentName);
    }
    return componentName === name;
  };

  const result = [];

  // 查找逻辑
  function find(children) {
    for (const child of children) {
      // 检查组件是否匹配
      const nameMatch = matchName(child.$options.name);
      const isMatch = nameMatch && (filter ? filter(child) : true);

      if (isMatch) {
        result.push(child);
        // 如果不需要多个结果且已找到，则提前返回
        if (!multiple) {
          return true;
        }
      }

      // 深度查找
      if (deep && child.$children?.length) {
        const found = find(child.$children);
        if (found && !multiple) {
          return true;
        }
      }
    }
    return false;
  }

  find(instance.$children);

  return multiple ? result : result[0] || null;
}
