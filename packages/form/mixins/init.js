import { set, get } from "lodash-es";
import { formInitQueue, getInitValue, propUtils } from "../utils/formHelpers";

export default {
  data() {
    return {
      isInitializing: false,
      formBind: {},
    };
  },

  watch: {
    value() {
      // value重新赋值时需要再初始化
      if (!this.isInitializing && !formInitQueue.isProcessing) {
        this.initFormValue();
      }
    },
  },

  methods: {
    // 表单初始化
    async initFormValue() {
      if (this.isInitializing) return;

      await formInitQueue.add(async () => {
        this.isInitializing = true;

        try {
          await this.$nextTick();
          let form = { ...this.value };

          this.trueRenderColumns.forEach((col) => {
            if (propUtils.get(form, col.prop) === undefined) {
              const initValue = getInitValue(col);
              propUtils.set(form, col.prop, initValue);
            }
          });

          this.setControl();
          this.$emit("input", form);
          await this.$nextTick();
          this.clearValidate();
        } finally {
          this.isInitializing = false;
        }
      });
    },

    // 设置表单控制绑定
    setControl() {
      this.trueRenderColumns.forEach((column) => {
        let prop = column.prop;
        let bind = column.deepProp;
        if (!this.formBind[prop]) {
          let bindList = [];
          if (bind) {
            // 浅层值改变修改深层，深层改变修改浅层
            let formProp = this.$watch("value." + prop, (n, o) => {
              if (n != o) set(this.value, bind, n);
            });
            let formDeep = this.$watch("value." + bind, (n, o) => {
              if (n != o) this.$set(this.value, prop, n);
            });
            bindList.push(formProp);
            bindList.push(formDeep);
            this.$set(this.value, prop, get(this.value, bind));
          }
          this.formBind[prop] = bindList;
        }
      });
    },
  },
};
