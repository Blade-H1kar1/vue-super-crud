<script>
import create from "core/create";
import { generateRules } from "core";
import Render from "core/components/render";
import { bem } from "src/utils/bem";

export default {
  functional: true,
  name: "crud-cell",
  props: {
    col: Object,
    scope: Object,
    ctx: Object,
  },
  render(h, context) {
    const { props, data } = context;
    const { col, scope, ctx } = props;

    const b = (...args) => bem("sc-crud-cell", ...args);

    // 辅助函数
    const findTreeProp = (tree, targetId, path = "") => {
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.id === targetId) {
          return path + i;
        }
        if (node.children && node.children.length > 0) {
          const childPath = `${path}${i}.children.`;
          const result = findTreeProp(node.children, targetId, childPath);
          if (result !== null) {
            return result;
          }
        }
      }
      return null;
    };

    // 获取表单属性
    const getFormProp = (item) => {
      if (!item.prop) return;
      if (ctx.isTree) {
        return (
          "list." +
          findTreeProp(ctx.data, scope.row[ctx.valueKey]) +
          "." +
          item.prop
        );
      }
      return "list." + scope.$index + "." + (item.validateProp || item.prop);
    };

    // 获取渲染项
    const getItem = (editMode) => {
      const scopeProps = ctx.controlScopeProps(col.prop, editMode, scope);
      const props = scopeProps ? Object.assign({}, col, scopeProps) : col;
      return (editMode && props[editMode]) || props;
    };

    // 单元格渲染
    const cellRender = (item, editMode, rawRules) => {
      return (
        <Render
          props={item}
          item={item}
          slots={ctx.extendsScopedSlots}
          mode={editMode}
          scope={scope}
          config={ctx.crudOptions}
          rawRules={rawRules}
          defaultRender={ctx.crudOptions.defaultRender}
          controlDefault={(defaultRender, scope) => {
            if (editMode === "add" || editMode === "edit") {
              return defaultRender.input;
            }
          }}
          data-row-key={scope.row[ctx.valueKey]}
          data-prop={col.prop}
        ></Render>
      );
    };

    // 编辑模式下的单元格渲染
    const cellEditRender = (item, editMode, rawRules) => {
      const classNames = [];
      if (editMode) {
        classNames.push(b("edit", "active"));
      } else {
        classNames.push(b("edit", "hover"));
        classNames.push(b("edit"));
      }

      return (
        <div
          class={classNames}
          onClick={() => {
            if (!editMode) {
              ctx.handleCellEdit(scope, item);
            }
          }}
        >
          {cellRender(item, editMode, rawRules)}
          {cellSaveIcon(item, editMode)}
        </div>
      );
    };

    // 保存图标渲染
    const cellSaveIcon = (item, editMode) => {
      if (editMode) {
        return (
          <div class="save-icon">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-check"
              onClick={(e) => {
                e.stopPropagation();
                ctx.handleRowSave(scope);
              }}
            ></el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-close"
              onClick={(e) => {
                e.stopPropagation();
                ctx.handleRowCancel(scope);
              }}
            ></el-button>
          </div>
        );
      }
    };

    // 主渲染逻辑
    const editMode = ctx.validateEdit(col, scope);
    const item = getItem(editMode);
    const formProp = getFormProp(item);
    const { rules, rawRules } = generateRules(item, scope);
    const isValidate = editMode && rules.length;
    const CompName = editMode ? "el-form-item" : "div";
    const VNode = ctx.cellEdit
      ? cellEditRender(item, editMode, rawRules)
      : cellRender(item, editMode, rawRules);
    return (
      <CompName
        key={scope.$index + item.prop}
        class={[
          rules.required && editMode ? "is-required" : "",
          b([col.align || "center"]),
        ]}
        label-width={item.labelWidth}
        size={ctx.crudOptions.size}
        prop={formProp}
        rules={rules}
        style="width:100%"
      >
        {VNode}
      </CompName>
    );
  },
};
</script>
