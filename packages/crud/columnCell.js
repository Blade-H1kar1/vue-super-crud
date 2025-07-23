import { generateRules, defaultRender } from "core";
import Render from "core/components/render";
import { bem } from "src/utils/bem";
import { get } from "lodash-es";

// 查找树形数据中的属性路径
export function findTreeProp(
  tree,
  targetId,
  { key = "id", childrenKey = "children", path = "" }
) {
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
}

// 获取表单属性
export function getFormProp(item, topProps, ctx, scope) {
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
}

// 获取渲染项
export function getItem(col, editMode) {
  const props = { ...col };
  return (editMode && props[editMode]) || props;
}

// 单元格渲染
export function cellRender(
  h,
  item,
  editMode,
  rawRules,
  formProp,
  topProps,
  scope
) {
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
}

// 默认单元格渲染
export function cellDefaultRender(h, item, scope) {
  const _scope = {
    ...scope,
    item,
    $value: {
      get: get(scope.row, item.prop),
    },
  };
  return defaultRender.formatter(h, _scope);
}

// 判断是否使用默认渲染
export function isDefaultRender(item, ctx) {
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
}

// 主渲染函数
export function columnCell(h, { col, scope, ctx, topProps }) {
  const b = (...args) => bem("sc-crud-cell", ...args);

  const isEditing = scope.row.$edit;
  const editMode = ctx.isTriggerEdit
    ? isEditing && ctx.validateEdit(col, scope)
    : ctx.validateEdit(col, scope);
  const item = getItem(col, editMode);
  const formProp = getFormProp(item, topProps, ctx, scope);
  const { rules, rawRules } = generateRules(item, scope);
  const isValidate = editMode && rules.length;
  const CompName = editMode && isValidate ? "el-form-item" : "div";
  const canCellEdit =
    ctx.validateEditMode("cell") &&
    !editMode &&
    typeof col.isEdit === "function" &&
    col.isEdit(scope);
  let VNode;

  if (isDefaultRender(item, ctx) && !editMode) {
    VNode = cellDefaultRender(h, item, scope);
  } else {
    VNode = cellRender(h, item, editMode, rawRules, formProp, topProps, scope);
  }

  return (
    <CompName
      class={[
        typeof col.required === "function" && rules.required && editMode
          ? "is-required"
          : "",
        canCellEdit ? "is-disabled__edit" : "",
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
}

// 延迟渲染函数
export function delayColumnCell(h, { col, scope, ctx, topProps }) {
  if (scope.row.$delay && !scope.row.$delay.includes(col.prop)) {
    const formProp = getFormProp(col, topProps, ctx, scope);
    // 返回简单渲染的占位内容
    return h("div", {
      attrs: {
        "data-row-key": scope.row[topProps.valueKey],
        "data-full-prop": formProp,
        "data-prop": col.prop,
      },
      style: {
        height: (topProps.itemSize || 40) + "px",
      },
      directives: [
        {
          name: "scObserveVisibility",
          value: {
            onVisible: () => {
              scope.row.$delay.push(col.prop);
            },
            rootClass: "el-table__body-wrapper",
            // 分批渲染配置
            batchConfig: topProps.delayRenderConfig,
          },
        },
      ],
    });
  }
  return columnCell(h, { col, scope, ctx, topProps });
}
