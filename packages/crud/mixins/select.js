export default {
  props: {
    selected: {
      type: Array,
    },
  },
  data() {
    return {
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
        if (isUpdated) {
          this.updateSelection();
        }
      },
      immediate: true,
    },
  },
  computed: {
    selection() {
      return this.crudOptions.selection;
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
          break;
        case 16 || 18:
          this.shiftOrAltDown = true;
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
          break;
        case 16 || 18:
          this.shiftOrAltDown = false;
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
      if (!this.selection) return;

      let refsElTable = this.$refs.tableRef;
      if (this.selection.ctrlSelect !== false && this.CtrlDown) {
        refsElTable.toggleRowSelection(row);
        return;
      }
      if (
        this.selection.shiftSelect !== false &&
        this.shiftOrAltDown &&
        this.selectionRow.length > 0
      ) {
        let maxAndmin = this.getmaxAndminObj(
          row.$index,
          this.maxSelectionRow.$index,
          this.minSelectionRow.$index
        );
        refsElTable.clearSelection();
        for (let index = maxAndmin.min; index <= maxAndmin.max; index++) {
          refsElTable.toggleRowSelection(this.list[index], true);
        }
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
      if (!this.selected?.length) return;
      this.$nextTick(() => {
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
      });
    },
    selectionChange(arr) {
      this.selectionRow = arr;
      this.$emit("selection-change", arr);
    },
    select(selection, row) {
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
      this.$emit("select", selection, row);
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
            this.selected.splice(i, 1);
          }
        }
      }
      this.$emit("select-all", selection);
    },
  },
};
