import { isEqual, cloneDeep, isFunction, uniqueId } from "lodash-es";
import { executeFunction } from "utils";
export default {
  data() {
    this.crudMode;
    return {
      oldRowData: {},
      editX: null,
      editY: null,
      pendingChanges: new Map(), // 存储所有未保存的更改
    };
  },
  computed: {
    refreshAfterOperation() {
      return this.crudOptions.refreshAfterOperation;
    },
    isEdit() {
      return this.freeEdit || this.rowEdit || this.cellEdit || this.batchEdit;
    },
    is$Edit() {
      return this.rowEdit || this.batchRowEdit || this.batchEdit;
    },
    freeEdit() {
      return this.crudOptions.freeEdit;
    },
    cellEdit() {
      return this.crudOptions.cellEdit;
    },
    rowEdit() {
      return this.crudOptions.rowEdit || this.batchRowEdit;
    },
    batchRowEdit() {
      return this.crudOptions.batchRowEdit;
    },
    batchEdit() {
      return this.crudOptions.batchEdit;
    },
    // 是否存在新增
    hasAdd() {
      return this.list.some((item) => item.$add);
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
    disabledRowEdit(scope) {
      const isRowEdit = this.crudOptions.isRowEdit;
      if (
        isRowEdit !== undefined &&
        isFunction(isRowEdit) &&
        isRowEdit(scope) === false
      )
        return true;
      return false;
    },
    // 校验单元格编辑状态
    validateEdit(col = {}, scope = {}) {
      const editMode = (scope.row.$add ? "add" : "edit") || "edit";
      if (col[editMode] === false) return false;
      const isEdit = isFunction(col.isEdit)
        ? col.isEdit({ ...scope, mode: editMode })
        : col.isEdit;
      if (isEdit === false || this.disabledRowEdit(scope)) return false;
      const rowEdit = scope.row.$edit || scope.row.$add;
      // 行编辑
      if (this.is$Edit) {
        if (rowEdit) {
          return editMode;
        } else {
          return false;
        }
      }
      // 单元格编辑
      if (this.cellEdit) {
        if (rowEdit && this.editY === col.prop) {
          return editMode;
        } else {
          return false;
        }
      }
      // 自由编辑-列控制
      if (isEdit || this.freeEdit) {
        return editMode;
      } else {
        return false;
      }
    },
    isNotEditable(editX, editY) {
      return false;
      if (editX && editY) {
        if (editX === this.editX && editY === this.editY) return false;
      }
      if (this.editX === 0 || this.editX) {
        if (this.crudMode === "add") {
          this.$message("请先保存或取消新增数据");
          return true;
        }
        // { ...this.list[this.editX] }清除$index
        if (!isEqual({ ...this.list[this.editX] }, this.oldRowData)) {
          this.$message("请先保存或取消上一个编辑");
          return true;
        }
      }
      return false;
    },
    handleRowAdd(params, type) {
      if (this.rowEdit && this.isNotEditable()) return;
      let newRow = {};
      this.trueRenderColumns.forEach((col) => {
        if (newRow[col.prop] === undefined) {
          if (col.initValue) {
            newRow[col.prop] = col.initValue;
          } else {
            newRow[col.prop] = "";
          }
        }
      });
      this.runBefore(
        ["add"],
        (data) => {
          newRow = Object.assign(newRow, data, params);
          newRow.$add = "add_" + uniqueId();

          type = type || this.crudOptions.rowAddType;
          this._processRowAddType = type;
          if (type === "first") {
            this.list.unshift(newRow);
          } else if (type === "last") {
            this.list.push(newRow);
          }
          setTimeout(() => {
            this.$refs.tableFormRef.clearValidate();
          }, 0);
        },
        { row: newRow }
      );
    },
    handleRowEdit(scope) {
      if (this.isNotEditable()) return;

      this.runBefore(
        ["edit"],
        (data) => {
          if (data) {
            this.$set(this.list, scope.$index, data);
          } else {
            this.$set(scope.row, "$edit", cloneDeep(scope.row));
          }
        },
        scope
      );
    },
    handleBatchRowEdit() {
      this.runBefore(["batchEdit"], () => {
        const list = cloneDeep(this.list);
        this.list.forEach((item, index) => {
          if (this.disabledRowEdit({ row: item, $index: index })) return;
          !item.$edit && this.$set(item, "$edit", list[index]);
        });
      });
    },
    handleRowSave(scope) {
      this.validateField(scope.$index).then(() => {
        this.changeLoading(true);
        const isAdd = scope.row.$add ? true : false;
        const callBack = (row) => {
          // 存在用户传入的row时，覆盖scope.row
          row && this.$set(this.list, scope.$index, row);

          this.$set(scope.row, isAdd ? "$add" : "$edit", null);
          // 缓存未保存的行
          this.savePendingState();
          this.refreshAfterOperation && this.getList();
          this.changeLoading();
          this.editY = null;
        };
        this.runBefore(["save"], callBack, scope, this.changeLoading);
      });
    },
    // 保存所有未保存的状态
    savePendingState() {
      this.list.forEach((row) => {
        if (row.$edit || row.$add) {
          const key = row[this.valueKey] || row.$add;
          if (key) {
            this.pendingChanges.set(key, {
              type: row.$add ? "add" : "edit",
              data: { ...row },
            });
          }
        }
      });
    },
    handleBatchRowSave(changeBatchButton) {
      this.validate().then(() => {
        this.changeLoading(true);
        const callBack = () => {
          this.list.forEach((item) => {
            item.$edit && this.$set(item, "$edit", null);
          });
          changeBatchButton();
          this.refreshAfterOperation && this.getList();
          this.changeLoading();
        };
        this.runBefore(
          ["batchSave"],
          callBack,
          this.list.filter((i) => i.$edit || i.$add, this.changeLoading)
        );
      });
    },
    handleRowCancel(scope) {
      this.runBefore(
        ["cancel"],
        () => {
          if (scope.row.$add) {
            this.list.splice(scope.$index, 1);
          } else {
            Object.keys(scope.row).forEach((key) => {
              if (key !== "$edit")
                this.$set(scope.row, key, scope.row.$edit[key]);
            });
            this.$set(scope.row, "$edit", null);
          }
          this.editY = null;
          this.clearErrorMsg(scope.$index, scope.column.property);
        },
        scope
      );
    },
    handleBatchRowCancel() {
      this.runBefore(["batchCancel"], () => {
        this.list.forEach((item, index) => {
          item.$edit && this.$set(this.list, index, item.$edit);
        });
      });
    },
    handleBatchDelete() {
      if (this.selectionRow.length === 0) {
        return this.$message.warning("请选择要删除的数据");
      }
      const handleDelete = () => {
        this.changeLoading(true);
        const callBack = () => {
          const deleteIndex = this.selectionRow.map((item) => item.$index);
          this.list = this.list.filter(
            (item) => !deleteIndex.includes(item.$index)
          );
          this.refreshAfterOperation && this.getList();
          this.changeLoading();
        };
        this.runBefore(
          ["batchDelete"],
          callBack,
          this.selectionRow,
          this.changeLoading
        );
      };
      if (this.crudOptions.batchDeleteMsgTip === false) {
        handleDelete();
      } else {
        const batchDeleteMsgTip =
          executeFunction(
            this.crudOptions.batchDeleteMsgTip,
            this.selectionRow
          ) || `是否删除选中的 ${this.selectionRow.length} 条数据?`;
        this.$confirm(batchDeleteMsgTip, "提示", {
          type: "warning",
        }).then(async () => {
          handleDelete();
        });
      }
    },
    handleDelete(scope) {
      const handleDelete = () => {
        this.changeLoading(true);
        const callBack = () => {
          this.list.splice(scope.$index, 1);
          this.refreshAfterOperation && this.getList();
          this.changeLoading();
        };
        this.runBefore(["delete"], callBack, scope, this.changeLoading);
      };
      if (this.crudOptions.deleteMsgTip === false) {
        handleDelete();
      } else {
        const deleteMsgTip =
          executeFunction(this.crudOptions.deleteMsgTip, scope) ||
          `是否删除序号为${scope.$index + 1}的数据?`;
        this.$confirm(deleteMsgTip, "提示", {
          type: "warning",
        }).then(async () => {
          handleDelete();
        });
      }
    },
    handleCellEdit(scope, column) {
      let row = scope.row;
      if (this.cellEdit) {
        if (this.isNotEditable(row.$index, column.prop)) return;

        if (this.editY) return;
        this.runBefore(
          ["edit"],
          (data) => {
            this.$set(scope.row, "$edit", cloneDeep(scope.row));
            this.editY = column.prop;
            if (data) {
              this.$set(this.list[row.$index], column.prop, data);
            }
          },
          scope
        );
      }
    },
  },
};
