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
    contextMenuTemps(scope, divided, isHeader) {
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
            // 防止数据为空，无法分析组件生成mock数据
            if (this.data.length === 0) {
              this.data.push({
                temp_mock: true,
              });
              // 设置临时mock标志
              this._tempMock = true;
            }
            this.showMockDialog = true;
          },
        },
        clearMock: {
          label: "清除临时mock数据",
          icon: "el-icon-delete",
          hidden: !this.data.some((item) => item.$mock),
          onClick: () => {
            this.clearMock();
          },
        },
        reset: {
          label: "重置",
          icon: "el-icon-refresh",
          hidden: isHeader,
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
          this.contextMenuTemps(scope, actionBtns.length, false)
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
    openContextHerderMenu(column, event) {
      if (checkVisibility(this.ctxMenu) === false) return;
      const items = [];
      if (this.ctxMenu) {
        let merges = batchMerge(
          "btn.crud.contextMenu",
          this.ctxMenu,
          {},
          this.contextMenuTemps({ event }, 0, true)
        );
        merges = this.checkHiddenButtons("contextMenu", merges);
        items.push(...merges);
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
      let actionButtons = this.buttonList[scope.$index] || [];
      const btnEl = this.$el.querySelectorAll(".sc-crud-action-column")[
        scope.$index
      ];

      return actionButtons
        .filter(({ hidden, ...item }) => {
          // 直接通过 label 属性查找按钮
          const button = btnEl.querySelector(`button[label="${item.label}"]`);
          if (!button) return false;

          // 检查按钮是否可见
          const style = window.getComputedStyle(button);
          return style.display !== "none";
        })
        .map(({ hidden, ...item }) => {
          if (item.children) {
            item.children.forEach((child) => {
              const click = child.onClick;
              child.onClick = () => {
                click && click(scope);
              };
            });
          } else {
            item.onClick = () => {
              const button = btnEl.querySelector(
                `button[label="${item.label}"]`
              );
              if (button) button.click();
            };
          }

          return item;
        });
    },
  },
};
