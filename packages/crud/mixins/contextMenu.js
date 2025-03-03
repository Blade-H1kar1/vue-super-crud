import { batchMerge } from "utils/mergeTemp";
import { isFunction } from "lodash-es";
import { checkVisibility } from "utils";
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
    contextMenuTemps(scope, divided) {
      return {
        copy: {
          label: "复制内容",
          icon: "el-icon-document-copy",
          onClick: () => {
            let save = function (e) {
              e.clipboardData.setData(
                "text/plain",
                scope.event.target.innerText
              );
              e.preventDefault(); //阻止默认行为
            };
            document.addEventListener("copy", save); //添加一个copy事件
            document.execCommand("copy"); //执行copy方法
            document.removeEventListener("copy", save); //移除copy事件
            this.$message.success("复制成功");
          },
        },
        mock: {
          label: "生成测试数据",
          icon: "el-icon-magic-stick",
          onClick: () => {
            this.$emit("mockData");
          },
        },
        reset: {
          label: "重置",
          icon: "el-icon-refresh",
          onClick: () => {
            this.reset();
          },
          divided,
        },
      };
    },
    openContextMenu(row, column, event) {
      if (checkVisibility(this.ctxMenu) === false) return;
      const items = [];
      const scope = {
        row,
        $index: row.$index,
        column,
        ctx: this,
        event,
      };
      const actionBtns = this.getActionButton(scope);
      if (this.ctxMenu) {
        let merges = batchMerge(
          "btn.crud.contextMenu",
          this.ctxMenu,
          scope,
          this.contextMenuTemps(scope, actionBtns.length)
        );
        merges = this.checkHiddenButtons("contextMenu", merges);
        items.push(...merges);
      }
      if (this.ctxMenu.actionBtn) {
        items.push(...actionBtns);
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
