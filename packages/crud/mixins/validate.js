import { debounce, get, omit } from "lodash-es";
import { findTreeNodePath } from "../utils";
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
    handleValidateError(fullProp, msg, isValid = true) {
      const cell = this.$el
        .querySelector(".el-table__body")
        .querySelector(`[data-full-prop="${fullProp}"]`);
      if (!cell) return;

      // 向上查找父元素直到找到 el-table__cell
      let targetCell = cell;
      let loopCount = 0;
      const maxLoops = 5;

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
        this.errorMap.set(fullProp, msg);
        this.showErrorTooltip(cell);
      } else {
        // 移除错误状态
        targetCell.classList.remove("error-badge");
        this.errorMap.delete(fullProp);
        this.cellMouseLeave();
      }
    },
    createListError(prop, valid, msg) {
      this.handleValidateError(prop, msg, valid);
    },
    clearErrorMsg(row, prop) {
      const targetPath =
        "list." +
        findTreeNodePath(this.list, (node) => node === row, "children") +
        "." +
        prop;
      this.handleValidateError(targetPath, "", true);
    },
    cellMouseEnter(row, column, cell, event) {
      const el = cell.querySelector("[data-full-prop]");
      if (!el) return;
      this.showErrorTooltip(el);
    },
    showErrorTooltip(el) {
      const targetPath = el.getAttribute("data-full-prop");
      this.errorContent = this.errorMap.get(targetPath);
      const tooltip = this.$refs.tooltip;
      tooltip.referenceElm = el;
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
    validateField(params) {
      const options = typeof params === "number" ? { index: params } : params;
      return this._validateField(options);
    },
    _validateField(options = {}) {
      return new Promise((resolve, reject) => {
        const { index, id, row, prop } = options;

        // 查找目标行的路径
        let targetPath = null;

        if (index !== undefined) {
          // 通过索引直接定位
          targetPath = `list.${index}`;
        } else if (id) {
          // 通过 ID 查找路径
          targetPath =
            "list." +
            findTreeNodePath(
              this.list,
              (node) => node[this.valueKey] === id,
              "children"
            );
        } else if (row) {
          // 通过对象引用查找路径
          targetPath =
            "list." +
            findTreeNodePath(this.list, (node) => node === row, "children");
        }

        if (!targetPath) {
          reject(new Error("未找到目标行"));
          return;
        }

        // 获取需要校验的字段
        const fields = this.$refs.tableFormRef.fields.filter((field) => {
          const fieldPath = field.prop.split(".");

          // 如果指定了具体字段，则只校验该字段
          if (prop) {
            return field.prop === `${targetPath}.${prop}`;
          }

          // 否则校验该行所有字段
          return fieldPath.slice(0, -1).join(".") === targetPath;
        });

        if (fields.length === 0) {
          resolve();
          return;
        }

        // 执行校验
        const validates = [];
        const errors = [];

        const validatePromises = fields.map((field) => {
          return new Promise((fieldResolve) => {
            field.validate("", (errorMsg) => {
              if (errorMsg) {
                validates.push(false);
                errors.push({
                  field: field.prop.split(".").pop(),
                  message: errorMsg,
                });
              } else {
                validates.push(true);
              }
              fieldResolve();
            });
          });
        });

        // 等待所有字段校验完成
        Promise.all(validatePromises).then(() => {
          if (validates.every((v) => v)) {
            resolve({
              valid: true,
              path: targetPath,
            });
          } else {
            reject({
              valid: false,
              path: targetPath,
              errors: errors,
            });
          }
        });
      });
    },
    clearValidate() {
      this.$refs.tableFormRef.clearValidate();
      this.errorMap.clear();
      this.errorContent = "";
      const cells =
        this.$el
          .querySelector(".el-table__body")
          .querySelectorAll(".error-badge") || [];
      cells.forEach((c) => {
        c.classList.remove("error-badge");
      });
    },
  },
};
