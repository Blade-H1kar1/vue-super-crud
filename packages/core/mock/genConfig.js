export function getComponentConfig(vnode) {
  const instance = getRealComponent(vnode);
  if (!instance) return null;

  const name = instance.$options.name;
  const props = instance.$props || {};

  // 公共配置
  const commonConfig = {
    ...props,
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
  // 递归查找所有子组件
  function findOptions(component) {
    let options = [];
    if (component.$options.name === "ElOption") {
      options.push({
        label: component.label,
        value: component.value ?? component.label,
        disabled: !!component.disabled,
      });
    }

    // 递归查找子组件
    if (component.$children && component.$children.length) {
      component.$children.forEach((child) => {
        options = options.concat(findOptions(child));
      });
    }

    return options;
  }
  return findOptions(instance);
}

/**
 * 获取单选框组的选项
 */
function getRadioOptions(instance) {
  return instance.$children
    .filter((child) =>
      ["ElRadio", "ElRadioButton"].includes(child.$options.name)
    )
    .map((radio) => ({
      label: radio.label,
      value: radio.value ?? radio.label,
      disabled: !!radio.disabled,
    }));
}

/**
 * 获取复选框组的选项
 */
function getCheckboxOptions(instance) {
  return instance.$children
    .filter((child) => child.$options.name === "ElCheckbox")
    .map((checkbox) => ({
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
