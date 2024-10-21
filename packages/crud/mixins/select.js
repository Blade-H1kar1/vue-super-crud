export default {
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
    selectionChange(arr) {
      this.selectionRow = arr;
      this.$emit("selection-change", arr);
    },
  },
};
