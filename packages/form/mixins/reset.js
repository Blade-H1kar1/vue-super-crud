import { getResetValueByType, propUtils } from "../utils/formHelpers";

export default {
  methods: {
    // 重置表单
    reset(empty = true, excludeFields = []) {
      if (empty) {
        this.completelyClear(excludeFields);
      } else {
        this.$refs.formRef && this.$refs.formRef.resetFields();
      }
      this.$emit("reset", this.value);
    },

    // 完全清空表单
    completelyClear(excludeFields = []) {
      const newFormValue = this.value;
      this.trueRenderColumnsBeforeFilter.forEach((col) => {
        const prop = col.prop;
        if (excludeFields.includes(prop)) {
          return;
        }
        // 优先使用列配置的初始值
        if (col.initValue !== undefined) {
          propUtils.set(newFormValue, prop, col.initValue);
          return;
        }
        const currentValue = propUtils.get(this.value, prop);
        const resetValue = getResetValueByType(currentValue, col);
        propUtils.set(newFormValue, prop, resetValue);
      });
      this.$nextTick(() => {
        this.clearValidate();
      });
    },

    // 重置指定字段
    resetField(props, empty = true) {
      const propsArray = Array.isArray(props) ? props : [props];

      propsArray.forEach((prop) => {
        if (empty) {
          const column = this.columnsMap[prop];
          const currentValue = propUtils.get(this.value, prop);
          const resetValue = getResetValueByType(currentValue, column);
          propUtils.set(this.value, prop, resetValue);
        } else {
          // 通知子组件执行重置
          this.$emit("handleChild", "resetField", prop);
        }
      });
    },
  },
};
