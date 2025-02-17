<script>
import { isFunction } from "lodash-es";
export default {
  inject: ["ctx"],
  props: {
    col: Object,
  },
  watch: {
    col() {
      this.bindColumnConfig();
    },
  },
  computed: {
    crudOptions() {
      return this.ctx.crudOptions;
    },
    defaultFixed() {
      return this.fixed;
    },
    showColumn() {
      if (this.ctx.setOptions.hidden.includes(this.col.prop)) return false;
      return true;
    },
    fixed() {
      if (this.col.fixed) return this.col.fixed;
      const fixed = this.ctx.setOptions.fixed[this.col.prop];
      if (fixed) return fixed;
    },
  },
  methods: {
    bindColumnConfig() {
      const columnConfig = this.$refs.column?.columnConfig;
      if (columnConfig) {
        columnConfig.col = this.col;
      }
    },
  },
  render(h) {
    if (!this.showColumn) return null;
    if (isFunction(this.col.index) || this.col.sameRowSpan) {
      return (
        <el-table-column
          ref="column"
          key={this.col.type}
          prop={this.col.type}
          fixed={this.defaultFixed}
          props={this.col}
          on={{
            "hook:mounted": this.bindColumnConfig,
          }}
          scopedSlots={{
            default: (scope) => {
              const sameRowSpan = this.col.sameRowSpan;
              if (sameRowSpan) {
                const sameRowMap = this.ctx.sameRowMap[sameRowSpan] || {};
                const rowValue = scope.row[sameRowSpan] || "";
                const spanIndex =
                  sameRowMap[rowValue]?.spanIndex || scope.$index;
                return spanIndex + 1;
              }
              return this.col.index(scope.$index, scope);
            },
          }}
        ></el-table-column>
      );
    }
    return (
      <el-table-column
        ref="column"
        type={this.col.type}
        key={this.col.type}
        prop={this.col.type}
        fixed={this.defaultFixed}
        props={this.col}
        scopedSlots={{
          default:
            this.col.render || this.ctx.$scopedSlots[this.col.type]
              ? (scope) => {
                  if (this.col.render) {
                    return this.col.render(scope);
                  }
                  if (this.ctx.$scopedSlots[this.col.type]) {
                    return this.ctx.$scopedSlots[this.col.type](scope);
                  }
                }
              : null,
        }}
        on={{
          "hook:mounted": () => {
            const columnConfig = this.$refs.column?.columnConfig;
            if (columnConfig) {
              columnConfig.col = this.col;
            }
          },
        }}
      />
    );
  },
};
</script>
