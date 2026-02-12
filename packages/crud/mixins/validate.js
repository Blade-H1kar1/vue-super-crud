import { debounce, get, omit } from "lodash-es";
import { findTreeNodePath } from "../utils";
import { generateRules } from "core";
import AsyncValidator from "async-validator";
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
    handleValidateError(key, fullProp, msg, isValid = true, showTip = true) {
      const cells = this.$el
        .querySelectorAll(
          key
            ? `[data-full-prop="${fullProp}"][data-row-key="${key}"]`
            : `[data-full-prop="${fullProp}"]`
        );
      if (!cells) return;

      // 向上查找父元素直到找到 el-table__cell
      let targetCells = [];
      cells.forEach((cell) => {
        targetCells.push(cell.closest('.el-table__cell'));
      });

      let loopCount = 0;
      const maxLoops = 5;

      if (!targetCells || loopCount >= maxLoops) return;

      if (!isValid) {
        // 添加错误状态
        targetCells.forEach((targetCell) => {
          targetCell.classList.add("error-badge");
        });
        this.errorMap.set(fullProp, msg);
        showTip && this.showErrorTooltip(targetCells[targetCells.length -1]);
      } else {
        // 移除错误状态
        targetCells.forEach((targetCell) => {
          targetCell.classList.remove("error-badge");
        });
        this.errorMap.delete(fullProp);
        showTip && this.cellMouseLeave();
      }
    },
    createListError(prop, valid, msg) {
      this.handleValidateError(null, prop, msg, valid);
    },
    clearErrorMsg(row, prop) {
      const targetPath =
        "list." +
        findTreeNodePath(this.list, (node) => node === row, this.childrenKey) +
        "." +
        prop;
      this.handleValidateError(null, targetPath, "", true);
    },
    triggerValidateTooltip(row, column, cell, event) {
      const el = cell.querySelector("[data-full-prop]");
      if (!el) return;
      this.showErrorTooltip(el);
    },
    showErrorTooltip(el) {
      if (this._manualValidate) return;
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
    removeValidateTooltip() {
      const tooltip = this.$refs.tooltip;
      if (tooltip) {
        tooltip.setExpectedState(false);
        tooltip.handleClosePopper();
      }
    },
    validate(callBack) {
      this._manualValidate = true;
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
          setTimeout(() => {
            this._manualValidate = false;
          }, 0);
        });
      });
    },
    validateField(params) {
      this._manualValidate = true;
      setTimeout(() => {
        this._manualValidate = false;
      }, 0);
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
              this.childrenKey
            );
        } else if (row) {
          // 通过对象引用查找路径
          targetPath =
            "list." +
            findTreeNodePath(
              this.list,
              (node) => node === row,
              this.childrenKey
            );
        }

        if (!targetPath) {
          console.error(new Error("未找到目标行"));
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
        this.$el.querySelectorAll(".error-badge") || [];
      cells.forEach((c) => {
        c.classList.remove("error-badge");
      });
    },
    // 校验所有数据，可用于本地分页等数据过滤情况
    async validateAll({ mode = "all", maxShow = 20 } = {}) {
      this.crudOptions.localSearch && this.handleReset();
      const errors = [];
      const childrenKey = this.childrenKey || "children";
      let firstErrorFullProp = null; // 记录第一个错误的fullProp

      // 递归遍历树形数据
      const traverse = async (nodes, parentPath = []) => {
        for (let i = 0; i < nodes.length; i++) {
          const row = nodes[i];
          const currentPath = [...parentPath, i]; // 用于 fullProp 路径
          for (const column of this.trueRenderColumns) {
            const col = column.form || column;
            const { rules } = generateRules(col, { row });
            if ((!rules || rules.length === 0) && col.required === undefined) {
              continue;
            }
            if (rules && rules.length > 0) {
              rules.forEach((rule) => delete rule.trigger);
            }
            const descriptor = { [col.prop]: rules };
            const validator = new AsyncValidator(descriptor);
            const model = { [col.prop]: get(row, col.prop) };
            await validator.validate(model, { firstFields: true }, (err) => {
              if (!err) return Promise.resolve();
              // 生成 fullProp 路径
              const pathStr = currentPath.join(".");
              const fullProp = `list.${pathStr}.${col.prop}`;
              // 触发高亮
              this.handleValidateError(
                row[this.valueKey] || row._internalId,
                fullProp,
                err[0].message,
                false,
                false
              );

              const msg = `第${currentPath.map((i) => i + 1).join("-")}行【${
                col.label || col.prop
              }】：${err[0].message}`;
              // 记录第一个错误的fullProp
              if (!firstErrorFullProp) {
                firstErrorFullProp = fullProp;
              }
              if (mode === "first") {
                this.$message.error(msg);
                throw {
                  path: pathStr,
                  prop: col.prop,
                  message: msg,
                };
              } else {
                errors.push({
                  path: pathStr,
                  prop: col.prop,
                  fullProp,
                  message: msg,
                });
              }
            });
          }
          // 递归子节点
          if (Array.isArray(row[childrenKey]) && row[childrenKey].length > 0) {
            await traverse(row[childrenKey], [...currentPath, childrenKey]);
          }
        }
      };

      try {
        await traverse(this.data);
      } catch (e) {
        // 只跳转到第一个错误
        if (firstErrorFullProp) {
          const cell = this.$el
            .querySelector(".el-table__body")
            .querySelector(`[data-full-prop="${firstErrorFullProp}"]`);
          if (cell) {
            cell.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
        // 弹窗内容
        if (errors.length) {
          const showErrors = errors
            .slice(0, maxShow)
            .map((e) => e.message)
            .join("<br/>");
          const moreTip =
            errors.length > maxShow
              ? `<div style="color:#f56c6c;margin-top:8px;">共${errors.length}条错误</div>`
              : "";
          this.$alert(
            `<div style="max-height:300px;overflow:auto;">${showErrors}</div>${moreTip}`,
            (this.crudOptions.validateTitle ||
              this.crudOptions.title ||
              "表格") + "校验错误",
            {
              dangerouslyUseHTMLString: true,
            }
          );
        }
        return Promise.reject(errors.length ? errors : e);
      }

      // 只跳转到第一个错误
      if (firstErrorFullProp) {
        const cell = this.$el
          .querySelector(".el-table__body")
          .querySelector(`[data-full-prop="${firstErrorFullProp}"]`);
        if (cell) {
          cell.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }

      if (errors.length) {
        // 弹窗内容
        let showErrorsArr = errors.slice(0, maxShow).map((e) => e.message);
        if (errors.length > maxShow) {
          showErrorsArr.push("……");
        }
        const showErrors = showErrorsArr.join("<br/>");
        const moreTip =
          errors.length > maxShow
            ? `<div style="color:#f56c6c;margin-top:8px;">共${errors.length}条错误</div>`
            : "";
        this.$alert(
          `<div style="max-height:300px;overflow:auto;">${showErrors}</div>${moreTip}`,
          (this.crudOptions.validateTitle || this.crudOptions.title || "表格") +
            "校验错误",
          {
            dangerouslyUseHTMLString: true,
            customClass: "sc-crud__validate-error-alert",
            showConfirmButton: false,
          }
        );
        return Promise.reject(errors);
      }
      return Promise.resolve();
    },
  },
};
