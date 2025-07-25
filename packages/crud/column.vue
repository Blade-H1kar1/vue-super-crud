<script>
import create from "core/create";
import calcColumnWidth from "./mixins/calcColumnWidth";
import { columnCell, delayColumnCell } from "./columnCell.js";
import column from "./column.vue";
import searchHeader from "./searchHeader.vue";
import position from "core/components/position";
import { get } from "lodash-es";
import { bem } from "src/utils/bem";
import { checkVisibility } from "utils";
// 调试时element-ui导入地址需要改成引入项目下的node_modules地址
import { TableColumn } from "element-ui";
// import { TableColumn } from "C:/Users/Administrator/Desktop/jhfCloud2/ruoyi-ui/lib";

TableColumn.destroyed = function () {
  if (!this.$parent) return;
  let parent = this.$parent;
  if (parent.$options.name === "sc-crud-column") {
    // 解决children动态变化时el-table的columns被错误删除的问题，因为给el-table-column多套了一层，导致饿了么内部parent取错，所以这里需要再往上取一层
    parent = parent.$parent;
  }
  this.owner.store.commit(
    "removeColumn",
    this.columnConfig,
    this.isSubColumn ? parent.columnConfig : null
  );
};

export default create({
  name: "crud-column",
  props: {
    col: Object,
  },
  inject: ["ctx"],
  mixins: [calcColumnWidth],
  data() {
    return {
      isSearch: false,
    };
  },
  components: { TableColumn, column, searchHeader, position },
  watch: {
    col() {
      this.bindColumnConfig();
    },
  },
  computed: {
    showOverflowTooltip() {
      const col = this.col;
      if (col.showOverflowTooltip !== undefined) return col.showOverflowTooltip;
      return this.ctx.isDefaultColumn(col);
    },
    calcOpts() {
      return { ...this.ctx.crudOptions.calcColumnWidth, ...this.col };
    },
    isShow() {
      // hiddenList 只隐藏列表
      if (this.col.hiddenList) return false;
      return !this.hidden;
    },
    hidden() {
      if (this.ctx.setOptions.hidden.includes(this.col.prop)) return true;
    },
    fixed() {
      if (this.col.fixed) return this.col.fixed;
      const fixed = this.ctx.setOptions.fixed[this.col.prop];
      if (fixed) return fixed;
    },
    showSearchHeader() {
      if (this.col.search?.hidden) return false;
      if (this.col.searchHeader?.hidden) return false;
      const show = checkVisibility(this.ctx.crudOptions.searchHeader);
      return (this.col.search && show) || (this.col.searchHeader && show);
    },
    showEditIcon() {
      if (this.ctx.validateEditMode("cell") && this.col.isEdit !== false) {
        return true;
      }
      return false;
    },
  },
  methods: {
    bindColumnConfig() {
      const columnConfig = this.$refs.column?.columnConfig;
      if (columnConfig) {
        columnConfig.col = { ...this.col };
        columnConfig.options = { ...this.ctx.crudOptions };
      }
    },
    getTopProps() {
      const options = this.ctx.crudOptions;
      return {
        isTree: this.ctx.isTree,
        childrenKey: this.ctx.childrenKey,
        valueKey: this.ctx.valueKey,
        extendsScopedSlots: this.ctx.extendsScopedSlots,
        isTriggerEdit: this.ctx.isTriggerEdit,
        size: options.size,
        itemSize: options.itemSize,
        delayRenderConfig: options.delayRenderConfig,
        defaultRender: options.defaultRender,
      };
    },
  },
  render(h) {
    const { col, ctx, showSearchHeader, showOverflowTooltip, isShow, fixed } =
      this;
    const isDefaultColumn = ctx.isDefaultColumn(col);
    if (!isShow) return null;
    // 优先使用本地存储的宽度
    const fixedWidth = ctx.setOptions.fixedWidth[col.prop];
    const topProps = this.getTopProps();
    const cellRender = (scope) => {
      return delayColumnCell(h, { col, scope, ctx, topProps });
    };
    const columnHeader = () => {
      return (
        <div
          class={[this.b(["header"])]}
          style={{ color: this.isSearch ? "var(--color-primary)" : "" }}
        >
          {this.showEditIcon && (
            <i
              class="el-icon-edit-outline"
              style="margin-right:5px;color:var(--color-primary)"
            ></i>
          )}
          <position
            slotName={`${col.prop}-header`}
            render={col.labelRender || col.headerRender}
            slots={ctx.$scopedSlots}
          >
            <span
              style="white-space: nowrap;" // 解决动态列因为换行导致el-table中updateElsHeight重新计算有误
              domProps={{
                innerHTML: col.label,
              }}
            ></span>
          </position>
          {showSearchHeader && (
            <searchHeader
              on={{
                "update:isSearch": (val) => {
                  this.isSearch = val;
                },
              }}
              item={col.searchHeader}
            />
          )}
        </div>
      );
    };

    return (
      <TableColumn
        ref="column"
        props={col}
        prop={col.prop}
        fixed={fixed}
        header-align={col.headerAlign || col.align || "center"}
        align={col.align || "center"}
        width={fixedWidth || col.width}
        min-width={col.minWidth}
        show-overflow-tooltip={showOverflowTooltip}
        scopedSlots={{
          default: !isDefaultColumn ? (scope) => cellRender(scope) : null,
          header: columnHeader,
        }}
        on={{
          "hook:mounted": () => {
            this.bindColumnConfig();
          },
        }}
      >
        {col.children &&
          col.children.map((sub) => {
            return <column key={sub.label + sub.prop} col={sub}></column>;
          })}
      </TableColumn>
    );
  },
});
</script>
