import { isEqual, cloneDeep, isFunction, uniqueId } from "lodash-es";
import { executeFunction } from "utils";
import EditState from "../utils/EditState";
import { focusFormElement } from "../utils";

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
      handler(v, ov) {
        if (!isEqual(v, ov)) {
          this.initEditState();
          this.updateEditState();
          this.bindTriggerEvent();
          v && ov && this.transformData();
        }
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
    isTriggerEdit() {
      return ["row", "cell"].includes(this.editConfig.mode);
    },
  },
  methods: {
    // 初始化编辑状态
    initEditState() {
      const { mode, isRowEdit, exclusive, trigger } = this.editConfig;
      if (this.editState) return;
      // 初始化编辑状态管理器 - 单例模式
      this.editState = new EditState({
        valueKey: this.valueKey,
        columns: this.trueRenderColumns,
        mode,
        isRowEdit,
        exclusive: exclusive || trigger === "click" || trigger === "dblclick", // 根据 trigger 设置互斥
      });
      this.editState.on(
        "edit-status-change",
        ({ isEditing, mode, rowKey, row, prop, type }) => {
          row.$edit = isEditing;
          if (prop && this.editConfig.autofocus) {
            prop =
              typeof this.editConfig.autofocus === "string"
                ? this.editConfig.autofocus
                : prop;
            setTimeout(() => {
              this.focusInput(rowKey || row._internalId, prop);
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
      this.editState.trigger = trigger;
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
      // 兼容旧版本配置
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
      // 设置默认编辑配置
      if (
        config.mode === "cell" &&
        (config.trigger === "manual" || !config.trigger)
      ) {
        config.trigger = "dblclick";
      }
      if (
        config.mode === "row" &&
        config.trigger === "manual" &&
        config.rowEdit === undefined
      ) {
        config.rowEdit = {};
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
    // 校验编辑模式
    validateEditMode(mode) {
      if (this.editConfig.disabled) return false;
      return mode ? this.editConfig.mode === mode : this.editConfig.mode;
    },
    // 校验单元格编辑状态
    validateEdit(col = {}, scope = {}) {
      if (!col.isEdit && !this.editConfig.mode) return false;
      // 评估列的编辑条件
      const canEdit =
        typeof col.isEdit === "function" ? col.isEdit(scope) : col.isEdit;
      if (canEdit === false || this.editConfig.disabled) return false;
      if (this.editConfig.mode) {
        return this._runWithoutDeps(() => {
          return this.editState.validateEdit(col, scope, canEdit);
        });
      } else {
        return canEdit ? "edit" : false;
      }
    },

    // 行添加事件
    handleRowAdd(params, type, parentRow) {
      type = type || this.crudOptions.rowAddType || "last";
      let newRow = {
        $add: true,
        $edit: true,
      };
      if (this.isTree) {
        newRow[this.valueKey] = "new_" + uniqueId();
      }

      this.initRow(newRow);

      this.runBefore(
        ["add"],
        (data) => {
          newRow = Object.assign(newRow, data, params);
          if (parentRow) {
            newRow.$parentId = parentRow[this.valueKey];
            newRow.$parent = parentRow;
            newRow.$level = parentRow.level + 1;
            if (!parentRow[this.childrenKey]) {
              this.$set(parentRow, this.childrenKey, []);
            }
            newRow.$parent = parentRow;
            if (type === "first") {
              parentRow[this.childrenKey].unshift(newRow);
            } else {
              parentRow[this.childrenKey].push(newRow);
            }
          } else {
            // 处理顶层数据的添加
            if (type === "first") {
              this.list.unshift(newRow);
            } else {
              this.list.push(newRow);
            }
          }

          // 设置添加状态
          this.editState.setRowEditStatus(
            newRow,
            true,
            this.editConfig.mode === "row" ? "add" : "edit",
            {
              addType: type,
            }
          );

          setTimeout(() => {
            this.$refs.tableFormRef.clearValidate();
          }, 0);
        },
        { row: newRow, parentRow }
      );
    },

    // 行编辑事件
    handleRowEdit(scope, prop) {
      const oldRow = cloneDeep(scope.row);
      this.runBefore(
        ["edit"],
        (data) => {
          if (data) {
            for (const key in data) {
              scope.row[key] = data[key];
            }
          }
          this.editState.setRowEditStatus(scope.row, true, "edit", {
            prop,
            oldRow,
          });
        },
        scope
      );
    },

    // 行点击事件
    handleRowClick(scope, prop, trigger) {
      if (this.validateEditMode("row") && this.editConfig.trigger === trigger) {
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

        if (this.isTree) {
          const allNodes = [];
          const processNodes = (nodes) => {
            nodes.forEach((node) => {
              allNodes.push(node);
              if (node[this.childrenKey] && node[this.childrenKey].length > 0) {
                processNodes(node[this.childrenKey]);
              }
            });
          };
          processNodes(list);
          allNodes.forEach((node) => {
            this.editState.setRowEditStatus(node, true, "edit", {
              oldRow: cloneDeep(node),
            });
          });
        } else {
          list.forEach((row, index) => {
            this.editState.setRowEditStatus(row, true, "edit", {
              oldRow: cloneDeep(row),
            });
          });
        }
      });
    },

    // 行保存事件
    handleRowSave(scope, callback) {
      this.validateField({ row: scope.row }).then(() => {
        this.changeLoading(true);
        const callBack = (data) => {
          if (data) {
            for (const key in data) {
              scope.row[key] = data[key];
            }
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
          if (this.isTree) {
            // 处理树形数据的保存
            const processNodes = (nodes) => {
              nodes.forEach((row) => {
                if (this.editState.isRowEditing(row)) {
                  if (row.$parent) {
                    const index = this.getNodeIndex(row);
                    if (index !== -1 && rows) {
                      // 如果后端返回了更新后的数据，则使用后端数据更新
                      const updatedRow = rows.find(
                        (r) => r[this.valueKey] === row[this.valueKey]
                      );
                      if (updatedRow) {
                        this.$set(
                          row.$parent[this.childrenKey],
                          index,
                          updatedRow
                        );
                      }
                    }
                  }
                  this.editState.setRowEditStatus(row, false);
                }
                // 递归处理子节点
                if (row[this.childrenKey] && row[this.childrenKey].length > 0) {
                  processNodes(row[this.childrenKey]);
                }
              });
            };
            processNodes(topRows || this.list);
          } else {
            (topRows || rows || editRows).forEach((row) => {
              this.editState.setRowEditStatus(row, false);
            });
          }

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
            if (scope.row.$parent) {
              const index = this.getNodeIndex(scope.row);
              if (index !== -1) {
                scope.row.$parent[this.childrenKey].splice(index, 1);
              }
            } else {
              const index = this.list.indexOf(scope.row);
              index !== -1 && this.list.splice(index, 1);
            }
          } else if (editInfo?.data) {
            // 恢复原始数据
            if (scope.row.$parent) {
              const index = this.getNodeIndex(scope.row);
              if (index !== -1) {
                this.$set(
                  scope.row.$parent[this.childrenKey],
                  index,
                  editInfo.data
                );
              }
            } else {
              Object.keys(editInfo.data).forEach((key) => {
                key !== this.childrenKey &&
                  this.$set(scope.row, key, editInfo.data[key]);
              });
            }
          }
          this.editState.setRowEditStatus(scope.row, false);
          this.clearErrorMsg(scope.row, scope.column?.property);
        },
        scope
      );
    },

    // 批量行取消事件
    handleBatchRowCancel(topRows) {
      this.runBefore(["batchCancel"], (rows) => {
        const processCancelNodes = (nodes) => {
          nodes.forEach((row, index) => {
            if (this.editState.isRowEditing(row)) {
              const editInfo = this.editState.getRowEditInfo(row);
              if (editInfo?.data) {
                let children = [];
                if (row[this.childrenKey]) {
                  children = [...row[this.childrenKey]];
                }
                this.$set(nodes, index, editInfo.data);
                if (children.length > 0) {
                  this.$set(nodes[index], this.childrenKey, children);
                }
              }
              this.editState.setRowEditStatus(row, false);
            }
            // 递归处理子节点
            if (row[this.childrenKey] && row[this.childrenKey].length > 0) {
              processCancelNodes(row[this.childrenKey]);
            }
          });
        };

        // 处理需要取消编辑的节点
        processCancelNodes(topRows || rows || this.list);

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
          this.selectionRow
            .sort((a, b) => b.$index - a.$index)
            .forEach((row) => {
              if (row.$parent) {
                const parent = row.$parent;
                const children = parent[this.childrenKey] || [];
                const index = children.indexOf(row);
                if (index !== -1) {
                  children.splice(index, 1);
                }
              } else {
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              }
            });
          this.changeLoading();
        };
        this.callDeleteApi(this.selectionRow);
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
          if (scope.row.$parent) {
            const index = this.getNodeIndex(scope.row);
            if (index !== -1) {
              scope.row.$parent[this.childrenKey].splice(index, 1);
            }
          } else {
            this.list.splice(scope.$index, 1);
          }
          this.changeLoading();
        };
        this.callDeleteApi(scope.row);
        this.runBefore(["delete"], callBack, scope, this.changeLoading);
      };
      handleDelete();
    },

    // 单元格编辑事件
    handleCellEdit(scope, column) {
      if (!this.validateEditMode("cell")) return;
      // 评估列的编辑条件
      const canEdit =
        typeof column.isEdit === "function"
          ? column.isEdit(scope)
          : column.isEdit;
      if (column.isEdit !== undefined && !canEdit) {
        this.$message.warning("当前单元格不允许编辑");
        return;
      }
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
    handleCellClick(scope, col, trigger) {
      if (
        this.validateEditMode("cell") &&
        this.editConfig.trigger === trigger
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
      this.validateField({ row: scope.row }).then(() => {
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
          this.validateEditMode() &&
          (this.editConfig.trigger === "click" ||
            this.editConfig.trigger === "dblclick")
        ) {
          this._documentClickHandler = (e) => {
            const target = e.target;
            const isClickInCell = this.isClickInTableCell(target);
            const isClickInputClear = this.isClickInputClear(target);
            if (!isClickInCell && !isClickInputClear && !this._isClick) {
              if (this.validateEditMode("row")) {
                const editRow = this.editState.getEditingRows()[0]?.row;
                if (editRow) {
                  const scope = {
                    row: editRow,
                    $index: editRow.$index,
                  };
                  this.handleRowSave(scope, () => {
                    this.editState.clearOtherEditingRows();
                  });
                } else {
                  this.editState.clearOtherEditingRows();
                }
              } else if (this.validateEditMode("cell")) {
                const editCell = this.editState.getEditingCell();
                if (editCell) {
                  this.handleCellSave(
                    { row: editCell.row, $index: editCell.row.$index },
                    this.columnsMap[editCell.prop],
                    () => {
                      this.editState.clearAllEditStatus();
                    }
                  );
                } else {
                  this.editState.clearAllEditStatus();
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
      if (this.validateEditMode("dialog")) {
        this.handleAdd((this.editConfig.lastAdd || {}).addType || "last");
      } else {
        this.handleRowAdd(
          {},
          (this.editConfig.lastAdd || {}).addType || "last"
        );
      }
    },
    getNodeIndex(row) {
      if (!row.$parent) return null;
      const parent = row.$parent;
      const children = parent[this.childrenKey] || [];
      const index = children.indexOf(row);
      return index;
    },
  },
};
