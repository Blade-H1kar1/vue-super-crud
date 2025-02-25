<script>
import create from "core/create";
import { generateRules } from "core";
import Render from "core/components/render";
export default create({
  name: "crud-cell",
  props: {
    col: Object,
    scope: Object,
  },
  inject: ["ctx"],
  methods: {
    findTreeProp(tree, targetId, path = "") {
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.id === targetId) {
          return path + i;
        }
        if (node.children && node.children.length > 0) {
          const childPath = `${path}${i}.children.`;
          const result = this.findTreeProp(node.children, targetId, childPath);
          if (result !== null) {
            return result;
          }
        }
      }
      return null;
    },
    getFormProp(item) {
      if (!item.prop) return;
      if (this.ctx.isTree) {
        return (
          "list." +
          this.findTreeProp(this.ctx.data, this.scope.row[this.ctx.valueKey]) +
          "." +
          item.prop
        );
      }
      return (
        "list." + this.scope.$index + "." + (item.validateProp || item.prop)
      );
    },
    getItem(editMode) {
      const col = this.col;
      const scopeProps = this.ctx.controlScopeProps(
        col.prop,
        editMode,
        this.scope
      );
      const props = scopeProps ? Object.assign({}, col, scopeProps) : col;
      return (editMode && props[editMode]) || props;
    },
    cellRender(item, editMode, rawRules) {
      return (
        <Render
          props={item}
          item={item}
          slots={this.ctx.extendsScopedSlots}
          mode={editMode}
          scope={this.scope}
          config={this.ctx.crudOptions}
          rawRules={rawRules}
          defaultRender={this.ctx.crudOptions.defaultRender}
          controlDefault={(defaultRender, scope) => {
            if (editMode === "add" || editMode === "edit") {
              return defaultRender.input;
            }
          }}
        ></Render>
      );
    },
    cellEditRender(item, editMode, rawRules) {
      const calssNames = [];
      if (editMode) {
        calssNames.push(this.b("edit", "active"));
      } else {
        calssNames.push(this.b("edit", "hover"));
        calssNames.push(this.b("edit"));
      }
      return (
        <div
          class={calssNames}
          onClick={() => {
            if (!editMode) {
              this.ctx.handleCellEdit(this.scope, item);
            }
          }}
        >
          {this.cellRender(item, editMode, rawRules)}
          {this.cellSaveIcon(item, editMode)}
        </div>
      );
    },
    cellSaveIcon(item, editMode) {
      if (editMode) {
        return (
          <div class="save-icon">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-check"
              onClick={(e) => {
                e.stopPropagation();
                this.ctx.handleRowSave(this.scope);
              }}
            ></el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-close"
              onClick={(e) => {
                e.stopPropagation();
                this.ctx.handleRowCancel(this.scope);
              }}
            ></el-button>
          </div>
        );
      }
    },
  },
  render(h) {
    // if (this.scope.row.$defer) return this.cellVnode;

    const editMode = this.ctx.validateEdit(this.col, this.scope);
    const item = this.getItem(editMode);
    const formProp = this.getFormProp(item);
    const { rules, rawRules } = generateRules(item, this.scope);
    const isValidate = editMode && rules.length;
    const compName = isValidate ? "el-form-item" : "div";
    this.cellVnode = (
      <compName
        key={this.scope.$index + item.prop}
        class={[
          rules.required && editMode ? "is-required" : "",
          this.b([this.col.align || "center"]),
        ]}
        label-width={item.labelWidth}
        size={this.ctx.crudOptions.size}
        prop={formProp}
        rules={rules}
        style="width:100%"
      >
        {this.ctx.cellEdit
          ? this.cellEditRender(item, editMode, rawRules)
          : this.cellRender(item, editMode, rawRules)}
      </compName>
    );
    return this.cellVnode;
  },
});
</script>

<style lang="scss" scoped></style>
