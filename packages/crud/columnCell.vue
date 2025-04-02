<script>
import create from "core/create";
import { generateRules } from "core";
import Render from "core/components/render";
import { bem } from "src/utils/bem";

export default create({
  functional: true,
  name: "crud-cell",
  props: {
    col: Object,
    scope: Object,
    ctx: Object,
    topProps: Object,
  },
  render(h, context) {
    const { props, data } = context;
    const { col, scope, ctx, topProps } = props;

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
      if (topProps.isTree) {
        return (
          "list." +
          findTreeProp(ctx.list, scope.row[topProps.valueKey]) +
          "." +
          item.prop
        );
      }
      return "list." + scope.$index + "." + (item.validateProp || item.prop);
    };

    // 获取渲染项
    const getItem = (editMode) => {
      const props = { ...col };
      return (editMode && props[editMode]) || props;
    };

    // 单元格渲染
    const cellRender = (item, editMode, rawRules) => {
      return (
        <Render
          props={item}
          item={item}
          slots={topProps.extendsScopedSlots}
          mode={editMode}
          scope={scope}
          size={topProps.size}
          rawRules={rawRules}
          defaultRender={topProps.defaultRender}
          controlDefault={(defaultRender, scope) => {
            if (editMode === "add" || editMode === "edit") {
              return defaultRender.input;
            }
          }}
          data-row-key={scope.row[topProps.valueKey]}
          data-prop={col.prop}
        ></Render>
      );
    };

    // 主渲染逻辑
    const editMode = ctx.validateEdit(col, scope);
    const item = getItem(editMode);
    const formProp = getFormProp(item);
    const { rules, rawRules } = generateRules(item, scope);
    const isValidate = editMode && rules.length;
    const CompName = editMode ? "el-form-item" : "div";
    const VNode = cellRender(item, editMode, rawRules);
    return (
      <CompName
        key={scope.$index + item.prop}
        class={[
          rules.required && editMode ? "is-required" : "",
          b([col.align || "center"]),
          col.showOverflowTooltip && "sc-over-ellipsis",
        ]}
        label-width={item.labelWidth}
        size={topProps.size}
        prop={formProp}
        rules={rules}
        style="width:100%"
      >
        {VNode}
      </CompName>
    );
  },
});
</script>
