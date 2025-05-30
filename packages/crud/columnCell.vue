<script>
import create from "core/create";
import { generateRules } from "core";
import Render from "core/components/render";
import { bem } from "src/utils/bem";
import { defaultRender } from "core";

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
    const findTreeProp = (
      tree,
      targetId,
      { key = "id", childrenKey = "children", path = "" }
    ) => {
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node[key] === targetId) {
          return path + i;
        }
        if (node[childrenKey] && node[childrenKey].length > 0) {
          const childPath = `${path}${i}.${childrenKey}.`;
          const result = findTreeProp(node[childrenKey], targetId, {
            key,
            path: childPath,
          });
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
          findTreeProp(ctx.list, scope.row[topProps.valueKey], {
            key: topProps.valueKey,
            childrenKey: topProps.childrenKey,
          }) +
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
    const cellRender = (item, editMode, rawRules, formProp) => {
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
          data-full-prop={formProp}
          data-prop={item.prop}
        ></Render>
      );
    };

    const cellDefaultRender = (item) => {
      const _scope = {
        ...scope,
        item,
        $value: {
          get: scope.row[item.prop],
        },
      };
      return defaultRender.formatter(h, _scope);
    };

    const isDefaultRender = (item) => {
      if (
        item.comp ||
        item.render ||
        ctx.extendsScopedSlots[item.prop] ||
        item.position ||
        item.formatData
      ) {
        return false;
      }
      return true;
    };

    // 主渲染逻辑
    const isEditing = scope.row.$edit;
    const editMode = ctx.isTriggerEdit
      ? isEditing && ctx.validateEdit(col, scope)
      : ctx.validateEdit(col, scope);
    const item = getItem(editMode);
    const formProp = getFormProp(item);
    const { rules, rawRules } = generateRules(item, scope);
    const isValidate = editMode && rules.length;
    const CompName = editMode && isValidate ? "el-form-item" : "div";
    let VNode;

    if (isDefaultRender(item) && !editMode) {
      VNode = cellDefaultRender(item);
    } else {
      VNode = cellRender(item, editMode, rawRules, formProp);
    }
    return (
      <CompName
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
        on={{
          "hook:destroyed": () => {
            ctx.clearErrorMsg(scope.row, item.prop);
          },
        }}
      >
        {VNode}
      </CompName>
    );
  },
});
</script>
