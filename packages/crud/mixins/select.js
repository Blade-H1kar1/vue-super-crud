import { checkVisibility } from "utils";
import { isFunction, merge } from "lodash-es";

export default {
  props: {
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
    };
  },
  mounted() {
    if (this.selection) {
      window.addEventListener("keydown", this.keyDown, false);
      window.addEventListener("keyup", this.keyUp, false);
    }
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
  },
  watch: {
    // 监听外部传入的选中值变化
    selected: {
      handler(newVal, oldVal) {
        // 是否完全更新数据
        const isUpdated = newVal !== oldVal;
        if (isUpdated && this.showSelection) {
          this.$nextTick(() => {
            this.updateSelection();
          });
        } else if (newVal && this.showSingleSelection) {
          this.singleSelect = newVal[this.operateKey];
        }
      },
      immediate: true,
    },
  },
  computed: {
    showSelection() {
      return checkVisibility(this.crudOptions.selection);
    },
    showSingleSelection() {
      return checkVisibility(this.crudOptions.singleSelection);
    },
    selection() {
      return this.crudOptions.selection;
    },
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
      return this.selected.map((item) => item[this.operateKey]);
    },
  },
  methods: {
    keyDown(event) {
      let key = event.keyCode;
      switch (key) {
        case 17:
          this.CtrlDown = true;
          // 改变鼠标样式为指针
          document.body.style.cursor = "pointer";
          break;
        case 16 || 18:
          this.shiftOrAltDown = true;
          // 改变鼠标样式为多选
          document.body.style.cursor = "cell";
          // 禁止文本选中
          document.onselectstart = () => false;
          document.body.style.userSelect = "none";
          break;
        case 27:
          this.EscDown = true;
          break;
      }
    },

    keyUp(event) {
      let key = event.keyCode;
      switch (key) {
        case 17:
          this.CtrlDown = false;
          // 恢复默认鼠标样式
          document.body.style.cursor = "";
          break;
        case 16 || 18:
          this.shiftOrAltDown = false;
          // 恢复默认鼠标样式
          document.body.style.cursor = "";
          // 恢复文本选中
          document.onselectstart = null;
          document.body.style.userSelect = "";
          break;
        case 27:
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
      // var findRow = this.selectionRow.find((c) => c.$index == row.$index);
      // if (findRow) {
      //   rowName = "current-row " + rowName;
      // }
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
    // 更新选中状态
    updateSelection() {
      if (!this.$refs.tableRef) return;

      // this.$refs.tableRef.clearSelection();
      if (!this.selected?.length) return;

      const updatedSelected = [];
      this.list.forEach((row, index) => {
        const selectedIndex = this.selectedOperateKeys.indexOf(
          row[this.operateKey]
        );
        if (selectedIndex > -1) {
          if (this.crudOptions.dataSyncSelected) {
            merge(row, this.selected[selectedIndex]);
          }
          updatedSelected.push(row);
          // 同步选中状态
          this.$refs.tableRef.toggleRowSelection(row, true);
        }
      });

      // 保留不在当前页的选中项
      this.selected.forEach((item) => {
        const inCurrentPage = this.list.some(
          (row) => row[this.operateKey] === item[this.operateKey]
        );
        if (!inCurrentPage) {
          updatedSelected.push(item);
        }
      });

      // 更新选中数组
      this.selected.splice(0, this.selected.length, ...updatedSelected);
    },
    selectionChange(arr) {
      this.selectionRow = arr;
    },
    select(selection, row) {
      if (!this.selected) return;
      if (row[this.operateKey] === undefined) {
        console.error(
          `[CRUD Error] row.${this.operateKey}不存在，没有唯一值无法进行选中数据绑定，请设置正确的valueKey`
        );
        return;
      }
      if (selection.indexOf(row) > -1) {
        this.addSelection(row);
      } else {
        this.removeSelection(row);
      }
    },
    selectAll(selection) {
      if (!this.selected) return;
      const isAllSelected = this.$refs.tableRef.store.states.isAllSelected;
      const currentPageKeys = new Set(
        this.list.map((item) => item[this.operateKey])
      );
      if (isAllSelected) {
        selection.forEach((row) => {
          if (this.selected.indexOf(row) === -1) {
            this.selected.push(row);
          }
        });
      }
      // 取消全选当前页
      else {
        // 只移除当前页的数据
        for (let i = this.selected.length - 1; i >= 0; i--) {
          if (currentPageKeys.has(this.selected[i][this.operateKey])) {
            if (
              this.selectionSelectable(
                this.selected[i],
                this.selected[i].$index
              )
            ) {
              this.selected.splice(i, 1);
            }
          }
        }
      }
    },
    addSelection(row) {
      if (!this.selected) return;
      if (this.selection.spanProp) {
        this.removeSelection(row);
        this.list.forEach((item) => {
          if (item[this.operateKey] === row[this.operateKey]) {
            this.selected.push(item);
            this.$refs.tableRef.toggleRowSelection(item, true);
          }
        });
      } else {
        if (this.selectedOperateKeys.indexOf(row[this.operateKey]) === -1) {
          this.selected.push(row);
          this.$refs.tableRef.toggleRowSelection(row, true);
        }
      }
    },
    removeSelection(row) {
      if (!this.selectionSelectable(row, row.$index)) {
        return;
      }
      if (!this.selected) return;
      if (this.selection.spanProp) {
        for (let i = this.selected.length - 1; i >= 0; i--) {
          const item = this.selected[i];
          if (item[this.operateKey] === row[this.operateKey]) {
            this.selected.splice(i, 1);
            this.$refs.tableRef.toggleRowSelection(item, false);
          }
        }
      } else {
        const index = this.selectedOperateKeys.indexOf(row[this.operateKey]);
        if (index > -1) {
          this.selected.splice(index, 1);
          this.$refs.tableRef.toggleRowSelection(row, false);
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
      const disabledSelection = this.selected.filter((item) => {
        if (!this.selectionSelectable(item, item.$index)) {
          return true;
        }
      });
      this.selected.splice(0, this.selected.length, ...disabledSelection);

      // 恢复禁用的选中数据
      if (disabledSelection.length) {
        disabledSelection.forEach((item) => {
          this.$refs.tableRef.toggleRowSelection(item, true);
        });
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
  },
};
