import { debounce } from "lodash-es";
export default {
  data() {
    return {
      errorContent: "",
      listError: {},
    };
  },
  created() {
    this.activateTooltip = debounce(
      (tooltip) => tooltip.handleShowPopper(),
      50
    );
  },
  methods: {
    createListError(prop, valid, msg) {
      if (!this.listError[prop])
        this.$set(this.listError, prop, { valid: false, msg: "" });
      this.listError[prop].valid = !valid;
      this.listError[prop].msg = msg;
    },
    validateIsError(index, prop) {
      return this.listError[[`list.${index}.${prop}`]]?.valid;
    },
    clearErrorMsg(index, prop) {
      this.$set(this.listError, `list.${index}.${prop}`, {
        valid: false,
        msg: "",
      });
    },
    cellMouseEnter(row, column, cell, event) {
      if (column.property === "action") return;
      const col = column.col;
      if (!col) return;
      // col.form?.prop || col.prop 优先form下的prop
      this.errorContent = this.listError[
        [`list.${row.$index}.${col?.form?.prop || col?.prop}`]
      ]?.msg;
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
              if (
                this.crudOptions.validateMsg &&
                Object.keys(this.listError).length
              ) {
                const msg = this.listError[Object.keys(this.listError).shift()]
                  ?.msg;
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
      this.listError = {};
      this.errorContent = "";
    },
  },
};
