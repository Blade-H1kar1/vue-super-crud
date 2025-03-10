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
  created() {
    const span = this.col.spanProp || this.col.sameRowSpan;
    span && this.ctx.sameRowSpans.push(span);
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

    const defaultColumn = (slots, type) => (
      <el-table-column
        ref="column"
        key={this.col.type}
        prop={this.col.type}
        type={type}
        fixed={this.defaultFixed}
        props={this.col}
        on={{
          "hook:mounted": this.bindColumnConfig,
        }}
        scopedSlots={slots}
      />
    );
    if (this.ctx.showSingleSelection) {
      return defaultColumn({
        default: (scope) => {
          let selectable = false;
          if (isFunction(this.ctx.singleSelection.selectable)) {
            selectable = !this.ctx.singleSelection.selectable(
              scope.row,
              scope.$index
            );
          }
          return (
            <el-radio
              v-model={this.ctx.singleSelect}
              label={scope.row[this.ctx.operateKey]}
              disabled={selectable}
              onChange={() => {
                this.ctx.$emit("update:selected", scope.row);
              }}
            >
              {"  "}
            </el-radio>
          );
        },
      });
    }
    const span = this.col.spanProp || this.col.sameRowSpan;
    if (this.col.type === "index" && (isFunction(this.col.index) || span)) {
      return defaultColumn(
        {
          default: (scope) => {
            if (span) {
              const sameRowMap = this.ctx.sameRowMap[span] || {};

              const rowValue = scope.row[span] || "";

              const map = sameRowMap?.[rowValue]?.find(
                (g) =>
                  scope.$index >= g.firstIndex &&
                  scope.$index < g.firstIndex + g.span
              );
              const spanIndex = map?.spanIndex || scope.$index;
              if (this.col.render) {
                return this.col.render(spanIndex + 1);
              }
              return spanIndex + 1;
            }
            return this.col.index(scope.$index, scope);
          },
        },
        this.col.type
      );
    }
    return defaultColumn(
      {
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
      },
      this.col.type
    );
  },
};
</script>
