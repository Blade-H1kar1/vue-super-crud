<script>
import { set, omit, isArray, isFunction, isPlainObject } from "lodash-es";
import { isVNode } from "utils";
import Comp from "./comp.vue";

// 获取组件名称
function getCompName(name, isChildren, children, comp) {
  if (isChildren || children) return name;
  const nameMap = {
    "el-select": "sc-select",
    "el-checkbox-group": "sc-checkbox",
    "el-radio-group": "sc-radio",
    "el-switch": "sc-switch",
    "el-cascader": "sc-cascader",
  };
  if (comp.options && name === "el-input") {
    return "sc-select";
  }
  return nameMap[name] || name;
}

// 获取事件处理函数
function getOn(on, comp, scope, parent, props) {
  const events = {};
  if (on) {
    Object.entries(on).forEach(([key, handler]) => {
      events[key] = (...args) => handler?.(...args, scope);
    });
  }

  // 处理以 on 开头的事件配置
  Object.entries(comp)
    .filter(([key, value]) => /^on[A-Z]/.test(key) && isFunction(value))
    .forEach(([key, handler]) => {
      const eventName = key.slice(2).toLowerCase();
      events[eventName] = (...args) => handler?.(...args, scope);
    });

  return {
    ...events,
    input: (event) => {
      parent.$value = event;
      events.input && events.input(event);
    },
    change: (event) => {
      parent.$value = event;
      events.change && events.change(event);
    },
    "hook:mounted": () => {
      const instance = parent.$vnode.componentInstance.$children[0];
      if (props.mounted) {
        props.mounted(scope, instance);
      }
      if (props.ref) {
        props.ref(scope, instance);
      }
    },
  };
}

// 获取插槽
function getScopedSlots(scopedSlots, slots, h, scope) {
  const result = {};
  const allSlots = { ...scopedSlots, ...slots };

  for (const key in allSlots) {
    result[key] = () => allSlots[key](h, scope);
  }

  return result;
}

// 获取placeholder
function getPlaceholder(comp, name, scope) {
  if (comp.placeholder) {
    return comp.placeholder;
  }
  if (name === "el-input") {
    return "请输入" + scope.item.label;
  }
  return "请选择" + scope.item.label;
}

// 获取clearable
function getClearable(comp) {
  if (comp.clearable !== undefined) {
    return comp.clearable;
  }
  return true;
}

// 获取组件尺寸
function getCompSize(comp, size, ELEMENT) {
  return comp.size || size || (ELEMENT || {}).size;
}

// 渲染子元素
function renderChildren(children, h, scope) {
  if (!children) return null;

  if (isFunction(children)) {
    if (children.length === 2) {
      children = children(h, scope);
      if (isVNode(children)) return children;
    } else {
      children = children(scope);
    }
  }

  if (isArray(children)) {
    return children.map((child) => {
      if (isPlainObject(child)) {
        return h(Comp, {
          props: { ...child, comp: child, scope, isChildren: true },
        });
      }
      return child;
    });
  }

  return children;
}

// 生成假插槽
function fakeSlot(h, scopedSlots, slots) {
  const allSlots = { ...scopedSlots, ...slots };
  return Object.keys(allSlots).map((slot) => h("i", { slot }));
}

export default {
  name: "comp",
  functional: true,
  props: {
    value: {},
    prop: {},
    name: {
      default: "el-input",
    },
    comp: Object,
    bind: [Object, Function],
    on: Object,
    scopedSlots: Object,
    slots: Object,
    children: {},
    scope: Object,
    size: {},
    isChildren: Boolean,
    nativeOn: Object,
    directives: {
      type: Object,
      default: () => ({}),
    },
    created: Function,
    mounted: Function,
  },
  render(h, context) {
    const { props, data, parent } = context;
    const { name, comp, scope, isChildren, children, bind } = props;

    // 获取组件props
    const getComponentProps = (compName) => {
      const component = parent.$options.components[compName];
      return component?.options?.props || {};
    };

    // 处理bind属性
    let processedComp = comp;
    if (isFunction(bind)) {
      processedComp = { ...comp, ...bind(scope) };
    } else if (bind) {
      processedComp = { ...comp, ...bind };
    }

    // 获取组件名称
    const compName = getCompName(name, isChildren, children, processedComp);

    // 获取组件声明的props
    const componentProps = getComponentProps(compName);

    // 分离props和attrs
    const propsToPass = {};
    const attrsToPass = {};

    Object.entries(processedComp).forEach(([key, value]) => {
      if (componentProps[key]) {
        propsToPass[key] = value;
      } else if (!(key in props)) {
        attrsToPass[key] = value;
      }
    });

    // 生命周期钩子
    if (props.created) {
      props.created(scope);
    }
    return h(
      compName,
      {
        props: {
          ...propsToPass,
          value: props.value || parent.$value,
          scope,
        },
        attrs: {
          ...attrsToPass,
          size: getCompSize(processedComp, props.size, parent.$ELEMENT),
          placeholder: getPlaceholder(processedComp, compName, scope),
          clearable: getClearable(processedComp),
          disabled: processedComp.disabled ? true : false,
        },
        on: getOn(props.on, processedComp, scope, parent, props),
        nativeOn: props.nativeOn,
        scopedSlots: getScopedSlots(props.scopedSlots, props.slots, h, scope),
        directives: props.directives,
      },
      [
        renderChildren(children, h, scope),
        ...fakeSlot(h, props.scopedSlots, props.slots),
      ]
    );
  },
};
</script>
