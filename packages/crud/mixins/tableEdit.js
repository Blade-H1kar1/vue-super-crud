import { isEqual, cloneDeep, isFunction, uniqueId } from "lodash-es";
import { executeFunction } from "utils";
import EditState from "../utils/EditState";
import { focusFormElement } from "../utils/focus";

export default {
  data() {
    return {
      editState: null,
      _documentClickHandler: null,
    };
  },
  created() {},
  watch: {
    editConfig: {
      handler() {
        this.initEditState();
        this.updateEditState();
        this.bindTriggerEvent();
      },
      immediate: true,
    },
  },
  destroyed() {
    if (this._documentClickHandler) {
      document.removeEventListener("click", this._documentClickHandler);
    }
  },
  computed: {
    editConfig() {
      return this.processEditConfig();
    },
    noSaveEditMap() {
      if (this.noSaveEditList.length === 0) return;
      return this.noSaveEditList.reduce((pre, cur) => {
        pre[cur[this.valueKey]] = cur;
        return pre;
      }, {});
    },
  },
  methods: {
    // 初始化编辑状态
    initEditState() {
      if (this.editState) return;
      const { mode, isRowEdit, exclusive, trigger } = this.editConfig;
      // 初始化编辑状态管理器
      this.editState = new EditState({
        valueKey: this.valueKey,
        columns: this.trueRenderColumns,
        mode,
        isRowEdit,
        exclusive: exclusive || trigger === "click" || trigger === "dblclick", // 根据 trigger 设置互斥
      });
      this.editState.on(
        "edit-status-change",
        ({ mode, rowKey, row, prop, type }) => {
          this.forceUpdate();
          if (prop && this.editConfig.autofocus) {
            prop =
              typeof this.editConfig.autofocus === "string"
                ? this.editConfig.autofocus
                : prop;
            setTimeout(() => {
              this.focusInput(rowKey, prop);
            }, 100);
          }
          this.$emit("editStatusChange", {
            mode,
            rowKey,
            row,
            prop,
            type,
          });
        }
      );
    },

    // 更新编辑状态
    updateEditState() {
      if (!this.editState) return;
      const { mode, isRowEdit, exclusive, trigger } = this.editConfig;
      this.editState.mode = mode;
      this.editState.exclusive =
        exclusive || trigger === "click" || trigger === "dblclick";
      this.editState.isRowEdit = isRowEdit;
    },

    // 处理编辑配置
    processEditConfig() {
      const {
        isRowEdit,
        addBtn,
        editBtn,
        viewBtn,
        rowAddBtn,
        footerAddBtn,
        batchDeleteBtn,
        deleteBtn,
      } = this.crudOptions;

      const editConfig = { ...this.crudOptions.editConfig };
      if (editConfig.mode !== "dialog") {
        // 将dialog配置映射到row配置
        editConfig.rowAdd = editConfig.add;
        delete editConfig.add;
        editConfig.rowEdit = editConfig.edit;
        delete editConfig.edit;
      }
      const config = {
        ...editConfig,
        add: addBtn || editConfig.add,
        edit: editBtn || editConfig.edit,
        view: viewBtn || editConfig.view,
        rowAdd: rowAddBtn || editConfig.rowAdd,
        lastAdd: footerAddBtn || editConfig.lastAdd,
        batchDelete: batchDeleteBtn || editConfig.batchDelete,
        delete: deleteBtn || editConfig.delete,
        isRowEdit: editConfig.isRowEdit || isRowEdit,
      };
      if (this.crudOptions.freeEdit) {
        config.mode = "free";
      }
      if (this.crudOptions.cellEdit) {
        config.mode = "cell";
      }
      if (this.crudOptions.rowEdit) {
        config.mode = "row";
        config.rowEdit = config.rowEdit || {};
      }
      if (this.crudOptions.batchEdit) {
        config.mode = "row";
        config.batch = config.batch || {};
      }
      if (this.crudOptions.batchRowEdit) {
        config.mode = "row";
        config.rowEdit = config.rowEdit || {};
        config.batch = config.batch || {};
      }
      if (
        config.mode === "cell" &&
        (config.trigger === "manual" || !config.trigger)
      ) {
        config.trigger = "click";
      }
      return config;
    },

    // 行编辑禁用
    disabledRowEdit(scope) {
      const isRowEdit = this.editConfig.isRowEdit;
      return (
        isRowEdit !== undefined &&
        isFunction(isRowEdit) &&
        isRowEdit(scope) === false
      );
    },

    // 校验单元格编辑状态
    validateEdit(col = {}, scope = {}) {
      return this._runWithoutDeps(() => {
        return this.editState.validateEdit(col, scope);
      });
    },

    // 行添加事件
    handleRowAdd(params, type) {
      type = type || this.crudOptions.rowAddType || "last";
      let newRow = {};
      this.trueRenderColumns.forEach((col) => {
        if (newRow[col.prop] === undefined) {
          newRow[col.prop] = col.initValue ?? "";
        }
      });

      this.runBefore(
        ["add"],
        (data) => {
          newRow = Object.assign(newRow, data, params);

          // 设置添加状态
          this.editState.setRowEditStatus(
            newRow,
            true,
            this.editConfig.mode === "row" ? "add" : "edit",
            {
              addType: type,
            }
          );

          if (type === "first") {
            this.list.unshift(newRow);
          } else {
            this.list.push(newRow);
          }
          setTimeout(() => {
            this.$refs.tableFormRef.clearValidate();
          }, 0);
        },
        { row: newRow }
      );
    },

    // 行编辑事件
    handleRowEdit(scope, prop) {
      this.runBefore(
        ["edit"],
        (data) => {
          if (data) {
            this.$set(this.list, scope.$index, data);
          }
          this.editState.setRowEditStatus(scope.row, true, "edit", {
            prop,
          });
        },
        scope
      );
    },

    // 行点击事件
    handleRowClick(scope, prop) {
      if (
        this.editConfig.mode === "row" &&
        this.editConfig.trigger === "click"
      ) {
        if (this.editState.isRowEditing(scope.row)) return;
        const editRow = this.editState.getEditingRows()[0]?.row;

        if (editRow) {
          this.handleRowSave({ row: editRow, $index: editRow.$index }, () => {
            this.handleRowEdit(scope, prop);
          });
        } else {
          this.handleRowEdit(scope, prop);
        }

        this._isClick = true;
        setTimeout(() => {
          this._isClick = false;
        }, 0);
      }
    },

    // 批量行编辑事件
    handleBatchRowEdit() {
      this.runBefore(["batchEdit"], (rows) => {
        const list = this.editConfig.batch?.isSelect
          ? this.selectionRow
          : rows || this.list;

        list.forEach((row, index) => {
          this.editState.setRowEditStatus(row, true, "edit");
        });
      });
    },

    // 行保存事件
    handleRowSave(scope, callback) {
      this.validateField(scope.$index).then(() => {
        this.changeLoading(true);
        const callBack = (row) => {
          if (row) {
            this.$set(this.list, scope.$index, row);
          }
          this.editState.setRowEditStatus(scope.row, false);
          this.changeLoading();
          callback && callback();
        };

        this.runBefore(["save"], callBack, scope, this.changeLoading);
      });
    },

    // 批量行保存事件
    handleBatchRowSave(changeBatchButton, topRows) {
      this.validate().then(() => {
        const editRows = this.editState
          .getEditingRows()
          .map((item) => item.row);
        this.changeLoading(true);
        const callBack = (rows) => {
          (topRows || rows || editRows).forEach((row) => {
            this.editState.setRowEditStatus(row, false);
          });
          changeBatchButton();
          this.changeLoading();

          if (this.editConfig.batch?.isSelect) {
            this.clearSelection();
          }
        };
        this.runBefore(["batchSave"], callBack, editRows, this.changeLoading);
      });
    },

    // 行取消事件
    handleRowCancel(scope) {
      this.runBefore(
        ["cancel"],
        () => {
          const editInfo = this.editState.getRowEditInfo(scope.row);

          if (editInfo?.type === "add") {
            this.list.splice(scope.$index, 1);
          } else if (editInfo?.data) {
            // 恢复原始数据
            Object.keys(editInfo.data).forEach((key) => {
              this.$set(scope.row, key, editInfo.data[key]);
            });
          }
          this.editState.setRowEditStatus(scope.row, false);
          this.clearErrorMsg(scope.$index, scope.column?.property);
        },
        scope
      );
    },

    // 批量行取消事件
    handleBatchRowCancel(topRows) {
      this.runBefore(["batchCancel"], (rows) => {
        (topRows || rows || this.list).forEach((row, index) => {
          if (this.editState.isRowEditing(row)) {
            const editInfo = this.editState.getRowEditInfo(row);
            if (editInfo?.data) {
              this.$set(this.list, index, editInfo.data);
            }
            this.editState.setRowEditStatus(row, false);
          }
        });

        if (this.editConfig.batch?.isSelect) {
          this.clearSelection();
        }
      });
    },

    // 批量行删除事件
    handleBatchDelete() {
      if (this.selectionRow.length === 0) {
        return this.$message.warning("请选择要删除的数据");
      }
      const handleDelete = () => {
        this.changeLoading(true);
        const callBack = () => {
          const deleteIndex = this.selectionRow.map((item) => item.$index);
          deleteIndex
            .sort((a, b) => b - a)
            .forEach((index) => {
              this.list.splice(index, 1);
            });

          this.changeLoading();
        };
        this.runBefore(
          ["batchDelete"],
          callBack,
          this.selectionRow,
          this.changeLoading
        );
      };
      handleDelete();
    },

    // 行删除事件
    handleDelete(scope) {
      const handleDelete = () => {
        this.changeLoading(true);
        const callBack = () => {
          this.list.splice(scope.$index, 1);

          this.changeLoading();
        };
        this.runBefore(["delete"], callBack, scope, this.changeLoading);
      };
      handleDelete();
    },

    // 单元格编辑事件
    handleCellEdit(scope, column) {
      if (this.editConfig.mode !== "cell") return;
      this.runBefore(
        ["edit"],
        (data) => {
          this.editState.setCellEditStatus(scope.row, column.prop);
          if (data) {
            this.$set(this.list[scope.$index], column.prop, data);
          }
        },
        scope,
        column
      );
    },

    // 单元格点击事件
    handleCellClick(scope, col) {
      if (
        this.editConfig.mode === "cell" &&
        this.editConfig.trigger === "click"
      ) {
        if (this.editState.isCellEditing(scope.row, col.prop)) return;
        const editCell = this.editState.getEditingCell();
        if (editCell) {
          this.handleCellSave(
            { row: editCell.row, $index: editCell.row.$index },
            col,
            () => {
              this.handleCellEdit(scope, col);
            }
          );
        } else {
          this.handleCellEdit(scope, col);
        }

        this._isCellClick = true;
        setTimeout(() => {
          this._isCellClick = false;
        }, 0);
      }
    },

    handleCellSave(scope, col, callback) {
      this.validateField(scope.$index).then(() => {
        this.changeLoading(true);
        const callBack = (data) => {
          if (data) {
            this.$set(scope.row, col.prop, data);
          }
          this.editState.clearAllEditStatus();
          this.changeLoading();
          callback && callback();
        };
        this.runBefore(
          ["save"],
          callBack,
          scope.row[col.prop],
          scope,
          col,
          this.changeLoading
        );
      });
    },

    // 判断点击是否在表格单元格内
    isClickInTableCell(element) {
      while (element && element !== this.$el) {
        // 1. 检查是否是表格单元格
        if (
          element.tagName.toLowerCase() === "td" &&
          element.classList.contains("el-table__cell")
        ) {
          return true;
        }
        element = element.parentElement;
      }
      return false;
    },

    // 判断点击是否在输入框清除按钮上
    isClickInputClear(element) {
      return (
        element.classList.contains("el-input__clear") ||
        element.classList.contains("el-icon-circle-close") ||
        (element.parentElement &&
          (element.parentElement.classList.contains("el-input__clear") ||
            element.parentElement.classList.contains("el-icon-circle-close")))
      );
    },

    // 绑定点击事件
    bindTriggerEvent() {
      if (this._documentClickHandler) return;
      this.$nextTick(() => {
        if (
          this.editConfig.trigger === "click" ||
          this.editConfig.trigger === "dblclick"
        ) {
          this._documentClickHandler = (e) => {
            const target = e.target;
            const isClickInCell = this.isClickInTableCell(target);
            const isClickInputClear = this.isClickInputClear(target);
            if (!isClickInCell && !isClickInputClear && !this._isClick) {
              if (this.editConfig.mode === "row") {
                const editRow = this.editState.getEditingRows()[0]?.row;
                if (editRow) {
                  const scope = {
                    row: editRow,
                    $index: editRow.$index,
                  };
                  this.handleRowSave(scope, () => {
                    this.editState.clearOtherEditingRows();
                    this.forceUpdate();
                  });
                } else {
                  this.editState.clearOtherEditingRows();
                  this.forceUpdate();
                }
              } else {
                const editCell = this.editState.getEditingCell();
                if (editCell) {
                  this.handleCellSave(
                    { row: editCell.row, $index: editCell.row.$index },
                    editCell.prop,
                    () => {
                      this.editState.clearAllEditStatus();
                      this.forceUpdate();
                    }
                  );
                } else {
                  this.editState.clearAllEditStatus();
                  this.forceUpdate();
                }
              }
            }
          };

          document.addEventListener("click", this._documentClickHandler);
        }
      });
    },

    // 聚焦输入框
    focusInput(rowKey, prop) {
      // 通过 data 属性定位到当前单元格
      const cell = this.$el
        .querySelector(".el-table__body")
        .querySelector(`[data-row-key="${rowKey}"][data-prop="${prop}"]`);

      if (!cell) return;
      focusFormElement(cell);
    },

    // 最后添加事件
    handleLastAdd() {
      if (this.editConfig.mode === "dialog") {
        this.handleAdd((this.editConfig.lastAdd || {}).addType || "last");
      } else {
        this.handleRowAdd(
          {},
          (this.editConfig.lastAdd || {}).addType || "last"
        );
      }
    },
  },
};
