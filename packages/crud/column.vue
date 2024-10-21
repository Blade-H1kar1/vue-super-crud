<!-- <template>
  <el-table-column
    v-if="isShow"
    v-bind="col"
    :prop="col.prop"
    :fixed="fixed"
    :header-align="col.headerAlign || col.align || 'center'"
    :align="col.align || 'center'"
    :width="colWidth"
    :min-width="colMinWidth"
    :show-overflow-tooltip="showOverflowTooltip"
  >
    <template v-slot:header>
      <div
        class="sc-crud__column--header"
        :style="{ color: isSearch ? 'var(--color-primary)' : '' }"
      >
        <simpleRender
          :prop="`${col.prop}-label`"
          :render="col.labelRender"
          :item="col"
          :slots="ctx.$scopedSlots"
          :position="true"
          ><span v-html="col.label"></span
        ></simpleRender>
        <searchHeader
          v-if="showSearchHeader"
          :isSearch.sync="isSearch"
          :item="col.searchHeader"
        />
      </div>
    </template>
    <template v-slot="scope" v-if="!isDefaultColumn">
      <columnCell :col="col" :scope="scope"> </columnCell>
    </template>
    <column v-for="(sub, index) in col.children" :key="sub.label" :col="sub">
    </column>
  </el-table-column>
</template> -->

<script>
// TODO: 列的宽度默认最小为表头宽
import create from "core/create";
import calcColumnWidth from "./mixins/calcColumnWidth";
import columnCell from "./columnCell.vue";
import column from "./column.vue";
import searchHeader from "./searchHeader.vue";
import simpleRender from "core/components/simpleRender";
import { set, merge, isFunction } from "lodash-es";
import { executeFunctionByObject } from "utils";

export default {
  name: "column",
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
  components: { columnCell, column, searchHeader, simpleRender },
  computed: {
    isDefaultColumn() {
      return this.ctx.isDefaultColumn(this.col);
    },
    defaultMinWidth() {
      // 计算头部默认宽度
      const labelSpan = document.createElement("span");
      labelSpan.innerText = this.col.label;
      document.body.appendChild(labelSpan);
      let labelMinWidth = labelSpan.getBoundingClientRect().width + 20;
      this.col.search && (labelMinWidth += 20);
      this.col.sortable && (labelMinWidth += 25);
      document.body.removeChild(labelSpan);
      labelMinWidth = Math.round(labelMinWidth);
      return Math.max(labelMinWidth, 80);
    },
    showOverflowTooltip() {
      const col = this.col;
      if (col.showOverflowTooltip !== undefined) return col.showOverflowTooltip;
      return this.isDefaultColumn;
    },
    calcOpts() {
      return { ...this.ctx.crudOptions.calcColumnWidth, ...this.col };
    },
    colWidth() {
      return this.getColumnWidth(
        this.col.width,
        this.col.prop,
        this.ctx.data,
        this.calcOpts.widthType,
        this.calcOpts.widthFont,
        this.calcOpts.calcWidth
      );
    },
    colMinWidth() {
      if (!this.col.width) {
        return this.defaultMinWidth;
      }
      return this.getColumnWidth(
        this.col.minWidth,
        this.col.prop,
        this.ctx.data,
        this.calcOpts.widthType,
        this.calcOpts.widthFont,
        this.calcOpts.calcWidth
      );
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
      return (
        (this.col.search && this.ctx.crudOptions.searchHeader) ||
        (this.col.searchHeader && this.ctx.crudOptions.searchHeader)
      );
    },
  },
  methods: {
    genProxy(scope) {
      const editMode = this.ctx.validateEdit(this.col, scope);
      const scopeProps = this.ctx.controlScopeProps(
        this.col.prop,
        editMode,
        scope
      );
      const props = scopeProps ? merge({}, this.col, scopeProps) : this.col;
      let item = (editMode && props[editMode]) || props;
      return {
        ...item,
        editMode,
        item,
      };
    },
  },
  mounted() {
    if (this.$refs.column && this.$refs.column.columnConfig) {
      this.$refs.column.columnConfig.col = this.col;
    }
  },
  render(h) {
    const {
      col,
      ctx,
      showSearchHeader,
      showOverflowTooltip,
      isShow,
      isDefaultColumn,
      fixed,
      colWidth,
      colMinWidth,
    } = this;
    if (!isShow) return null;
    const scopedSlots = {
      default: !isDefaultColumn
        ? (scope) => {
            return <columnCell col={col} scope={scope} />;
          }
        : null,
      header: () => {
        return (
          <div
            class="sc-crud__column--header"
            style={{ color: this.isSearch ? "var(--color-primary)" : "" }}
          >
            <simpleRender
              prop={`${col.prop}-label`}
              render={col.labelRender}
              item={col}
              slots={ctx.$scopedSlots}
              position={true}
            >
              <span
                domProps={{
                  innerHTML: col.label,
                }}
              ></span>
            </simpleRender>
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
      },
    };
    return (
      <el-table-column
        ref="column"
        props={col}
        prop={col.prop}
        fixed={fixed}
        header-align={col.headerAlign || col.align || "center"}
        align={col.align || "center"}
        width={colWidth}
        min-width={colMinWidth}
        show-overflow-tooltip={showOverflowTooltip}
        scopedSlots={scopedSlots}
      >
        {col.children &&
          col.children.map((sub) => (
            <column key={sub.label + sub.prop} col={sub}></column>
          ))}
      </el-table-column>
    );
  },
};
</script>
