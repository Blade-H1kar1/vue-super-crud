import { checkVisibility } from "utils";
import { isFunction } from "lodash-es";

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
          this.singleSelect = newVal[this.valueKey];
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
    rowClick(row, column, event) {
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
        this.singleSelect = row[this.valueKey];
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

      this.$refs.tableRef.clearSelection();
      if (!this.selected?.length) return;
      this.list.forEach((row, index) => {
        const selectedIndex = this.selected.findIndex(
          (selected) => selected[this.valueKey] === row[this.valueKey]
        );
        if (selectedIndex > -1) {
          // 同步表格数据
          Object.assign(row, this.selected[selectedIndex]);
          this.$set(this.data, index, row);
          // 同步选中状态
          this.$refs.tableRef.toggleRowSelection(row, true);
          // 同步选中数据
          this.selected.splice(selectedIndex, 1, row);
        }
      });
    },
    selectionChange(arr) {
      this.selectionRow = arr;
      this.$emit("selection-change", arr);
    },
    select(selection, row) {
      this.$emit("select", selection, row);
      if (selection.indexOf(row) > -1) {
        selection.forEach((row) => {
          const exists = this.selected.some(
            (item) => item[this.valueKey] === row[this.valueKey]
          );
          if (!exists) {
            this.selected.push(row);
          }
        });
      } else {
        this.selected.splice(this.selected.indexOf(row), 1);
      }
    },
    selectAll(selection) {
      const currentPageKeys = new Set(
        this.list.map((item) => item[this.valueKey])
      );

      // 全选当前页
      if (selection.length > this.selected.length) {
        const newSelections = selection.filter(
          (item) =>
            !this.selected.some((s) => s[this.valueKey] === item[this.valueKey])
        );
        this.selected.push(...newSelections);
      }
      // 取消全选当前页
      else {
        // 只移除当前页的数据
        for (let i = this.selected.length - 1; i >= 0; i--) {
          if (currentPageKeys.has(this.selected[i][this.valueKey])) {
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
      this.$emit("select-all", selection);
    },
    removeSelection(row) {
      if (!this.selectionSelectable(row, row.$index)) {
        return;
      }
      const index = this.selected.findIndex(
        (item) => item[this.valueKey] === row[this.valueKey]
      );
      if (index > -1) {
        this.selected.splice(index, 1);
        this.$refs.tableRef.toggleRowSelection(row, false);
      }
    },
    removeSingleSelection() {
      this.$emit("update:selected", null);
      this.singleSelect = null;
    },
    clearSelection() {
      // 获取禁用的选中数据
      const disabledSelection = this.selected.filter((item) => {
        if (!this.selectionSelectable(item, item.$index)) {
          return true;
        }
      });
      this.selected.splice(0, this.selected.length, ...disabledSelection);
      this.$refs.tableRef.clearSelection();

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
