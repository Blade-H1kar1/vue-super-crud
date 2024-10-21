import { batchMerge } from "utils/mergeTemp";
import { isFunction } from "lodash-es";
export default {
  computed: {
    ctxMenu() {
      return this.crudOptions.contextMenu;
    },
  },
  created() {
    this.buttonList = [];
  },
  methods: {
    openContextMenu(row, column, event) {
      if (!this.ctxMenu) return;
      const items = [];
      const scope = {
        row,
        $index: row.$index,
        column,
        ctx: this,
      };
      if (this.ctxMenu.handles && this.ctxMenu.handles.length > 0) {
        const col = column.col;
        let merges = batchMerge("btn.crud.contextMenu", this.ctxMenu, {
          ...scope,
          event,
        });
        merges = this.checkHiddenButtons("contextMenu", merges);
        items.push(...merges);
      }
      if (this.ctxMenu.actionBtn) {
        items.push(...this.getActionButton(scope));
      }
      if (items.length === 0) return;
      event.preventDefault();
      event.stopPropagation();
      this.$contextmenu({
        items,
        event,
        minWidth: 100,
      });
    },
    getActionButton(scope) {
      let custom = this.buttonList[scope.$index] || [];
      return custom.map(({ hidden, ...item }) => {
        Object.keys(item).forEach((key) => {
          if (key === "onClick") {
            const rawClick = item[key];
            item[key] = () => rawClick(scope);
          } else if (isFunction(item[key]) && key !== "onClick") {
            item[key] = item[key](scope);
          }
        });
        return item;
      });
    },
  },
};
