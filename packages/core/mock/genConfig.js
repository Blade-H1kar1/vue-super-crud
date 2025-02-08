export function getMockConfig(vnode) {
  const instance = getRealComponent(vnode);
  if (!instance) return null;

  const name = instance.$options.name;
  const props = instance.$props || {};

  // 基础配置（所有组件通用）
  const baseConfig = {
    disabled: !!instance.disabled,
  };

  // 根据组件类型生成配置
  switch (name) {
    case "ElInput":
      return {
        ...baseConfig,
        type: "input",
        subtype: props.type || "text",
        maxLength: props.maxLength,
        minLength: props.minLength,
      };

    case "ElInputNumber":
      return {
        ...baseConfig,
        type: "number",
        min: props.min,
        max: props.max,
        precision: props.precision,
        step: props.step,
      };

    case "ElSelect":
      return {
        ...baseConfig,
        type: "select",
        options: getSelectOptions(instance),
        multiple: props.multiple,
        multipleLimit: props.multipleLimit,
        allowCreate: props.allowCreate,
      };

    case "ElDatePicker":
      return {
        ...baseConfig,
        type: "date",
        valueFormat: props.valueFormat,
        format: props.format,
        pickerType: props.type || "date", // date/datetime/week/month/year/dates
        min: props.startDate,
        max: props.endDate,
      };

    case "ElTimeSelect":
      return {
        ...baseConfig,
        type: "time",
        format: props.format,
        min: props.start,
        max: props.end,
        step: props.step,
      };

    case "ElRadioGroup":
      return {
        ...baseConfig,
        type: "radio",
        options: getRadioOptions(instance),
      };

    case "ElRadio":
    case "ElRadioButton":
      return {
        ...baseConfig,
        type: "radio",
        options: [
          {
            label: instance.label,
            value: instance.value ?? instance.label,
          },
        ],
      };

    case "ElCheckboxGroup":
      return {
        ...baseConfig,
        type: "checkbox",
        options: getCheckboxOptions(instance),
        min: props.min,
        max: props.max,
      };

    case "ElCheckbox":
      return {
        ...baseConfig,
        type: "checkbox",
        trueLabel: props.trueLabel ?? true,
        falseLabel: props.falseLabel ?? false,
      };

    case "ElCascader":
      return {
        ...baseConfig,
        type: "cascader",
        options: props.options || [],
        props: props.props,
        multiple: props.multiple,
        filterable: props.filterable,
      };

    case "ElSwitch":
      return {
        ...baseConfig,
        type: "switch",
        activeValue: props.activeValue ?? true,
        inactiveValue: props.inactiveValue ?? false,
      };

    case "ElSlider":
      return {
        ...baseConfig,
        type: "slider",
        min: props.min,
        max: props.max,
        step: props.step,
        range: props.range,
        marks: props.marks,
      };

    case "ElRate":
      return {
        ...baseConfig,
        type: "rate",
        max: props.max,
        allowHalf: props.allowHalf,
        lowThreshold: props.lowThreshold,
        highThreshold: props.highThreshold,
      };

    default:
      return null;
  }
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
  while (instance && !name.startsWith("El")) {
    const children = instance.$children || [];
    const childInstance = children[0];
    if (!childInstance) break;
    instance = childInstance;
    name = instance.$options.name;
  }
  return instance;
}
