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
      const cell = this.$el
        .querySelector(".el-table__body")
        .querySelector(
          `[data-row-key="${
            this.list[index][this.valueKey]
          }"][data-prop="${field}"]`
        );

      if (!cell) return;

      // 向上查找父元素直到找到 el-table__cell
      let targetCell = cell;
      let loopCount = 0;
      const maxLoops = 8;

      while (
        targetCell &&
        !targetCell.classList.contains("el-table__cell") &&
        loopCount < maxLoops
      ) {
        targetCell = targetCell.parentElement;
        loopCount++;
      }

      if (!targetCell || loopCount >= maxLoops) return;

      if (!isValid) {
        // 添加错误状态
        targetCell.classList.add("error-badge");
        this.errorMap.set(`${index}-${field}`, msg);
      } else {
        // 移除错误状态
        targetCell.classList.remove("error-badge");
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
    },
  },
};
