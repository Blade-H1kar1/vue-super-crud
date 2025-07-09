import { getResetValueByType } from "../utils/formHelpers";

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
          this.setByProp(newFormValue, prop, col.initValue);
          return;
        }
        const currentValue = this.getByProp(this.value, prop);
        const resetValue = getResetValueByType(currentValue, col);
        this.setByProp(newFormValue, prop, resetValue);
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
          const currentValue = this.getByProp(this.value, prop);
          const resetValue = getResetValueByType(currentValue, column);
          this.setByProp(this.value, prop, resetValue);
        } else {
          // 通知子组件执行重置
          this.$emit("handleChild", "resetField", prop);
        }
      });
    },
  },
};
