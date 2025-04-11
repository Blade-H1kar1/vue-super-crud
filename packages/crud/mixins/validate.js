import { debounce } from "lodash-es";
export default {
  data() {
    return {
      errorContent: "",
      errorMap: new Map(), // 存储错误信息
    };
  },
  created() {
    this.activateTooltip = debounce(
      (tooltip) => tooltip.handleShowPopper(),
      50
    );
  },
  methods: {
    handleValidateError(index, field, msg, isValid = true) {
      if (!isValid) {
        if (!this.list[index]["$error"]) {
          this.$set(this.list[index], "$error", [field]);
        } else if (!this.list[index]["$error"].includes(field)) {
          this.list[index]["$error"].push(field);
        }
        this.errorMap.set(`${index}-${field}`, msg);
      } else {
        if (this.list[index]["$error"]) {
          const fieldIndex = this.list[index]["$error"].indexOf(field);
          if (fieldIndex > -1) {
            this.list[index]["$error"].splice(fieldIndex, 1);
          }
        }
        this.errorMap.delete(`${index}-${field}`);
      }
    },
    createListError(prop, valid, msg) {
      const [_, index, field] = prop.split(".");
      this.handleValidateError(index, field, msg, valid);
    },
    validateIsError(index, col) {
      if (!col.required && !col.rules) return;
      const prop = col.form?.prop || col.prop;
      // 只依赖行级别的响应式数据
      const error = this.list[index] && this.list[index]["$error"];
      if (error && error.includes(prop)) {
        return this.errorMap.has(`${index}-${prop}`);
      }
      return false;
    },
    clearErrorMsg(index, prop) {
      this.handleValidateError(index, prop, "", true);
    },
    cellMouseEnter(row, column, cell, event) {
      if (column.property === "action") return;
      const col = column.col;
      if (!col) return;
      const prop = col.form?.prop || col.prop;
      this.errorContent = this.errorMap.get(`${row.$index}-${prop}`);
      const tooltip = this.$refs.tooltip;
      tooltip.referenceElm = cell;
      tooltip.$refs.popper && (tooltip.$refs.popper.style.display = "none");
      tooltip.doDestroy();
      if (!this.errorContent) return;
      tooltip.setExpectedState(true);
      this.activateTooltip(tooltip);
    },
    cellMouseLeave() {
      const tooltip = this.$refs.tooltip;
      if (tooltip) {
        tooltip.setExpectedState(false);
        tooltip.handleClosePopper();
      }
    },
    validate(callBack) {
      return new Promise((resolve, reject) => {
        this.$refs.tableFormRef.validate((valid, obj) => {
          if (!valid) {
            reject(obj);
            if (Object.keys(obj).length) {
              this.tbodyWrapEl = this.$el.querySelector(
                ".el-table__body-wrapper"
              );
              this.tbodyEl = this.tbodyWrapEl.querySelector("tbody");
              const tableListEl = this.tbodyEl.childNodes;
              const index = Object.keys(obj)[0].split(".")[1];
              tableListEl[index].scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              // 校验信息是否提示
              if (this.crudOptions.validateMsg && this.errorMap.size) {
                const firstErrorKey = Array.from(this.errorMap.keys())[0];
                const msg = this.errorMap.get(firstErrorKey);
                msg && this.$message.error(msg);
              }
            }
          } else {
            callBack && callBack(this.list);
            resolve({ list: this.list });
          }
        });
      });
    },
    validateField(index) {
      return new Promise((resolve, reject) => {
        const fields = this.$refs.tableFormRef.fields.filter(
          (field) => field.prop.split(".")[1] == index
        );
        const validates = [];
        fields.forEach((field) => {
          field.validate("", (v) => {
            if (v) {
              validates.push(false);
            } else {
              validates.push(true);
            }
          });
        });
        if (validates.every((i) => i)) {
          resolve();
        } else {
          reject();
        }
      });
    },
    clearValidate() {
      this.$refs.tableFormRef.clearValidate();
      this.errorMap.clear();
      this.errorContent = "";
      this.list.forEach((i) => {
        if (i["$error"]) i["$error"] = [];
      });
    },
  },
};
