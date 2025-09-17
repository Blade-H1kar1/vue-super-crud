import { checkVisibility } from "utils";
import { isFunction, merge, isEqual } from "lodash-es";

/**
 * 表格选择功能混入
 * 提供单选和多选功能，支持键盘操作和行点击选择
 * 支持分页情况下的选中状态保持
 */
export default {
  props: {
    /**
     * 选中的数据，可以是对象（单选）或数组（多选）
     * 通过 .sync 修饰符双向绑定
     */
    selected: {
      type: [Object, Array],
    },
  },
  data() {
    return {
      singleSelect: null,
      selectionRow: [],
      shiftOrAltDown: false,
      CtrlDown: false,
      EscDown: false,
    };
  },
  mounted() {
    if (this.showSelection) {
      this.$el.addEventListener("keydown", this.keyDown, { passive: true });
      this.$el.addEventListener("keyup", this.keyUp, { passive: true });
    }
  },
  beforeDestroy() {
    if (this.showSelection) {
      this.$el.removeEventListener("keydown", this.keyDown);
      this.$el.removeEventListener("keyup", this.keyUp);
    }
  },
  watch: {
    // 监听外部传入的选中值变化
    selected: {
      handler(newVal, oldVal) {
        if (this.showSelection) {
          this.$nextTick(() => {
            this.updateSelection();
          });
        } else if (this.showSingleSelection) {
          if (newVal) {
            this.singleSelect = newVal[this.operateKey];
          } else {
            this.singleSelect = null;
          }
        }
      },
      immediate: true,
      deep: true, // 添加深度监听，确保对象内部属性变化也能被捕获
    },
  },
  computed: {
    /**
     * 是否显示多选功能
     * @returns {Boolean}
     */
    showSelection() {
      return checkVisibility(this.crudOptions.selection);
    },

    /**
     * 是否显示单选功能
     * @returns {Boolean}
     */
    showSingleSelection() {
      return checkVisibility(this.crudOptions.singleSelection);
    },

    /**
     * 多选配置
     * @returns {Object}
     */
    selection() {
      return {
        dataSyncSelected: this.crudOptions.dataSyncSelected,
        ...this.crudOptions.selection,
      };
    },

    /**
     * 单选配置
     * @returns {Object}
     */
    singleSelection() {
      return this.crudOptions.singleSelection;
    },
    maxSelectionRow() {
      if (this.selectionRow.length == 0) return null;
      return this.selectionRow.reduce((start, end) => {
        return start.$index > end.$index ? start : end;
      });
    },
    minSelectionRow() {
      if (this.selectionRow.length == 0) return null;
      return this.selectionRow.reduce((start, end) => {
        return start.$index < end.$index ? start : end;
      });
    },
    operateKey() {
      return this.selection.spanProp || this.valueKey;
    },
    selectedOperateKeys() {
      return this.selected && this.selected.length > 0
        ? this.selected.map((item) => item[this.operateKey])
        : [];
    },
  },
  methods: {
    keyDown(event) {
      const key = event.keyCode;
      switch (key) {
        case 17: // Ctrl键
          this.CtrlDown = true;
          // 改变鼠标样式为指针
          document.body.style.cursor = "pointer";
          break;
        case 16: // Shift键
          this.shiftOrAltDown = true;
          // 改变鼠标样式为多选
          document.body.style.cursor = "cell";
          // 禁止文本选中
          document.onselectstart = () => false;
          document.body.style.userSelect = "none";
          break;
        case 27: // Esc键
          this.EscDown = true;
          break;
      }
    },

    keyUp(event) {
      const key = event.keyCode;
      switch (key) {
        case 17: // Ctrl键
          this.CtrlDown = false;
          // 恢复默认鼠标样式
          document.body.style.cursor = "";
          break;
        case 16: // Shift键
          this.shiftOrAltDown = false;
          // 恢复默认鼠标样式
          document.body.style.cursor = "";
          // 恢复文本选中
          document.onselectstart = null;
          document.body.style.userSelect = "";
          break;
        case 27: // Esc键
          this.EscDown = false;
          break;
      }
    },
    rowClassName_({ row, rowIndex, column, columnIndex }) {
      let rowName = this.crudOptions.rowClassName
        ? this.crudOptions.rowClassName.call(null, {
            row,
            column,
            rowIndex,
            columnIndex,
          })
        : "";
      return rowName;
    },
    selectRowClick(row, column, event) {
      if (
        this.showSingleSelection &&
        this.singleSelection.ctrlSelect !== false &&
        this.CtrlDown
      ) {
        if (isFunction(this.singleSelection.selectable)) {
          const selectable = this.singleSelection.selectable(row, row.$index);
          if (!selectable) {
            return;
          }
        }
        this.singleSelect = row[this.operateKey];
        this.$emit("update:selected", row);
        return;
      }
      if (!this.showSelection) return;

      if (!this.selectionSelectable(row, row.$index)) {
        return;
      }

      let refsElTable = this.$refs.tableRef;
      if (this.selection.ctrlSelect !== false && this.CtrlDown) {
        refsElTable.toggleRowSelection(row);
        this.select(this.selectionRow, row);
        return;
      }

      if (this.selection.shiftSelect !== false && this.shiftOrAltDown) {
        let maxAndmin = this.getmaxAndminObj(
          row.$index,
          this.maxSelectionRow?.$index ?? row.$index,
          this.minSelectionRow?.$index ?? 0
        );
        refsElTable.clearSelection();
        this.clearSelection();
        for (let index = maxAndmin.min; index <= maxAndmin.max; index++) {
          refsElTable.toggleRowSelection(this.list[index], true);
        }
        this.select(this.selectionRow, row);
        this.shiftOrAltDown = false;
      }
    },
    getmaxAndminObj(cur = 0, max, min) {
      let n = cur,
        mx = max,
        mi = min;
      if (n > mx) {
        return {
          min: mi,
          max: n,
        };
      } else if (n < mx && n > mi) {
        return {
          min: mi,
          max: n,
        };
      } else if (n < mi) {
        return {
          min: n,
          max: mx,
        };
      } else if (n == mi || n == mx) {
        return {
          min: mi,
          max: mx,
        };
      }
    },
    /**
     * 更新表格选中状态
     * 根据 selected 属性更新表格的选中状态
     * 处理分页情况下的选中状态保持
     */
    updateSelection() {
      if (!this.$refs.tableRef) return;
      if (this._isInternalUpdateSelection) return;
      if (!this._isPaging) {
        this.$refs.tableRef.clearSelection();
      }
      if (!this.selected?.length) return;

      // 创建操作键的映射，提高查找效率
      const selectedKeyMap = new Map();
      this.selected.forEach((item, index) => {
        const key = item[this.operateKey];
        if (key !== undefined) {
          selectedKeyMap.set(key, { item, index });
        }
      });

      const updatedSelected = [];
      // 处理当前页数据
      this.list.forEach((row) => {
        const key = row[this.operateKey];
        if (key !== undefined && selectedKeyMap.has(key)) {
          const { item } = selectedKeyMap.get(key);
          if (this.selection.dataSyncSelected) {
            merge(row, item);
          }
          updatedSelected.push(row);
          // 同步选中状态
          this.$refs.tableRef.toggleRowSelection(row, true);
          // 标记已处理
          selectedKeyMap.delete(key);
        }
      });

      // 添加不在当前页的选中项
      selectedKeyMap.forEach(({ item }) => {
        updatedSelected.push(item);
      });

      // 更新选中数组
      if (updatedSelected.length > 0 || this.selected.length > 0) {
        this.selected.splice(0, this.selected.length, ...updatedSelected);
        this.updateSelected();
      }

      this._isPaging = false;
    },
    selectionChange(arr) {
      this.selectionRow = arr;
    },
    select(selection, row) {
      if (!this.selected) return;

      // 基础验证
      if (row[this.operateKey] === undefined) {
        console.error(
          `[CRUD Error] row.${this.operateKey}不存在，没有唯一值无法进行选中数据绑定，请设置正确的valueKey`
        );
        return;
      }

      // 安全性检查
      const rowIndex = this.list.findIndex((item) => item === row);
      if (rowIndex !== -1 && this.getRowErrorType) {
        const errorType = this.getRowErrorType(rowIndex);
        if (errorType) {
          const errorMessages = {
            MISSING_ID: "[CRUD Error] 该行缺失ID字段，无法选中",
            DUPLICATE_ID: "[CRUD Error] 该行ID与其他行重复，无法选中",
          };
          console.error(
            errorMessages[errorType] || "[CRUD Error] 该行数据异常，无法选中"
          );
          return;
        }
      }

      // 检查是否可选
      if (!this.selectionSelectable(row, row.$index)) {
        return;
      }

      // 执行选中操作
      if (selection.indexOf(row) > -1) {
        this.addSelection(row);
      } else {
        this.removeSelection(row);
      }
    },
    selectAll(selection) {
      if (!this.selected) return;

      // 检查是否有问题行
      if (this.invalidRows && this.invalidRows.size > 0) {
        const missingCount = Array.from(this.invalidRows.values()).filter(
          (type) => type === "MISSING_ID"
        ).length;
        const duplicateCount = Array.from(this.invalidRows.values()).filter(
          (type) => type === "DUPLICATE_ID"
        ).length;

        let message = "当前页面存在异常数据，将跳过问题行";
        if (missingCount > 0 && duplicateCount > 0) {
          message += `（缺失ID ${missingCount}行，重复ID ${duplicateCount}行）`;
        } else if (missingCount > 0) {
          message += `（缺失ID ${missingCount}行）`;
        } else if (duplicateCount > 0) {
          message += `（重复ID ${duplicateCount}行）`;
        }

        console.error(`[CRUD Error] ${message}`);
      }

      const isAllSelected = this.$refs.tableRef.store.states.isAllSelected;
      const currentPageKeys = new Set(
        this.list.map((item) => item[this.operateKey])
      );

      // 批量处理以提高性能
      if (isAllSelected) {
        // 收集需要添加的行
        const rowsToAdd = [];
        selection.forEach((row) => {
          // 跳过有问题的行
          const rowIndex = this.list.findIndex((item) => item === row);
          if (
            this.getRowErrorType &&
            rowIndex !== -1 &&
            this.getRowErrorType(rowIndex)
          ) {
            return;
          }

          // 检查是否已存在
          const existingIndex = this.selected.findIndex(
            (item) => item[this.operateKey] === row[this.operateKey]
          );
          if (
            existingIndex === -1 &&
            this.selectionSelectable(row, row.$index)
          ) {
            rowsToAdd.push(row);
          }
        });

        // 批量添加行
        if (rowsToAdd.length > 0) {
          this.selected.push(...rowsToAdd);
          this.updateSelected();
        }
      } else {
        // 取消全选当前页 - 收集需要保留的行
        const rowsToKeep = this.selected.filter((item) => {
          // 如果不在当前页或不可选，则保留
          if (
            !currentPageKeys.has(item[this.operateKey]) ||
            !this.selectionSelectable(item, item.$index)
          ) {
            return true;
          }
          return false;
        });

        // 只有当数量变化时才更新
        if (rowsToKeep.length !== this.selected.length) {
          this.selected.splice(0, this.selected.length, ...rowsToKeep);
          this.updateSelected();
        }
      }
    },
    addSelection(row) {
      if (!this.selected) return;

      // 检查操作键是否存在
      const operateKeyValue = row[this.operateKey];
      if (operateKeyValue === undefined) {
        console.error(`[CRUD Error] 无法添加选中项：${this.operateKey} 不存在`);
        return;
      }

      if (this.selection.spanProp) {
        // 先移除相同 operateKey 的行
        this.removeSelection(row);

        // 收集需要添加的行
        const itemsToAdd = [];
        const itemsToSelect = [];

        this.list.forEach((item) => {
          if (item[this.operateKey] === operateKeyValue) {
            itemsToAdd.push(item);
            itemsToSelect.push(item);
          }
        });

        // 批量添加和选中
        if (itemsToAdd.length > 0) {
          this.selected.push(...itemsToAdd);
          this.updateSelected();

          this.$nextTick(() => {
            if (this.$refs.tableRef) {
              itemsToSelect.forEach((item) => {
                this.$refs.tableRef.toggleRowSelection(item, true);
              });
            }
          });
        }
      } else {
        // 检查是否已存在
        if (this.selectedOperateKeys.indexOf(operateKeyValue) === -1) {
          this.selected.push(row);
          this.updateSelected();

          this.$nextTick(() => {
            if (this.$refs.tableRef) {
              this.$refs.tableRef.toggleRowSelection(row, true);
            }
          });
        }
      }
    },
    removeSelection(row) {
      if (!this.selectionSelectable(row, row.$index)) {
        return;
      }
      if (!this.selected) return;

      // 检查操作键是否存在
      const operateKeyValue = row[this.operateKey];
      if (operateKeyValue === undefined) {
        console.error(`[CRUD Error] 无法移除选中项：${this.operateKey} 不存在`);
        return;
      }

      if (this.selection.spanProp) {
        // 收集需要移除的项和取消选中的项
        const itemsToDeselect = [];
        const indicesToRemove = [];

        // 找出所有需要移除的项
        this.selected.forEach((item, index) => {
          if (item[this.operateKey] === operateKeyValue) {
            indicesToRemove.push(index);
            itemsToDeselect.push(item);
          }
        });

        // 从后向前移除，避免索引变化
        if (indicesToRemove.length > 0) {
          // 按索引从大到小排序
          indicesToRemove.sort((a, b) => b - a);

          // 移除选中项
          indicesToRemove.forEach((index) => {
            this.selected.splice(index, 1);
          });

          this.updateSelected();

          // 取消表格选中状态
          this.$nextTick(() => {
            if (this.$refs.tableRef) {
              itemsToDeselect.forEach((item) => {
                this.$refs.tableRef.toggleRowSelection(item, false);
              });
            }
          });
        }
      } else {
        const index = this.selectedOperateKeys.indexOf(operateKeyValue);
        if (index > -1) {
          const itemToDeselect = this.selected[index];
          this.selected.splice(index, 1);
          this.updateSelected();

          this.$nextTick(() => {
            if (this.$refs.tableRef) {
              this.$refs.tableRef.toggleRowSelection(
                itemToDeselect || row,
                false
              );
            }
          });
        }
      }
    },
    removeSingleSelection() {
      this.$emit("update:selected", null);
      this.singleSelect = null;
    },
    clearSelection() {
      this.$refs.tableRef.clearSelection();
      this.selectionRow = [];
      if (!this.selected) return;

      // 获取禁用的选中数据
      const disabledSelection = this.selected.filter(
        (item) => !this.selectionSelectable(item, item.$index)
      );

      // 只有当数量变化时才更新
      if (disabledSelection.length !== this.selected.length) {
        this.selected.splice(0, this.selected.length, ...disabledSelection);
        this.updateSelected();

        // 恢复禁用的选中数据
        if (disabledSelection.length) {
          this.$nextTick(() => {
            disabledSelection.forEach((item) => {
              if (this.$refs.tableRef) {
                this.$refs.tableRef.toggleRowSelection(item, true);
              }
            });
          });
        }
      }
    },
    selectionSelectable(row, index) {
      if (isFunction(this.selection.selectable)) {
        const selectable = this.selection.selectable(row, index);
        if (!selectable) {
          return false;
        }
      }
      return true;
    },
    updateSelected() {
      // 设置标志位，防止循环更新
      this._isInternalUpdateSelection = true;
      // 使用防抖处理，避免频繁触发更新
      this._debounceUpdateSelected =
        this._debounceUpdateSelected ||
        this.debounceMethod(() => {
          this.$emit("update:selected", this.selected);
          this.$nextTick(() => {
            this._isInternalUpdateSelection = false;
          });
        }, 50);
      this._debounceUpdateSelected();
    },

    /**
     * 防抖函数
     * 在指定时间内多次调用只执行最后一次
     * @param {Function} fn 需要防抖的函数
     * @param {Number} delay 延迟时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
    debounceMethod(fn, delay) {
      let timer = null;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(context, args);
        }, delay);
      };
    },
  },
};
