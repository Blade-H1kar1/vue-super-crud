<script>
import { set, omit, isArray, isFunction, isPlainObject } from "lodash-es";
import comp from "./comp.vue";
import { isVNode } from "utils";
export default {
  name: "comp",
  props: {
    value: {},
    setValue: {},
    prop: {},
    // 组件名
    name: {
      default: "el-input",
    },
    // 组件参数
    comp: Object,
    bind: [Object, Function],
    // 监听组件事件
    on: Object,
    // 插槽
    scopedSlots: Object,
    slots: Object,
    // 子元素
    children: {},
    // 传入的数据
    scope: Object,
    // 组件尺寸
    size: {},
    isChildren: Boolean, // 是否子组件
    nativeOn: Object, // 原生事件
    directives: {
      type: Object,
      default: () => ({}),
    }, // 指令
    created: Function, // 创建
    mounted: Function, // 挂载
    updated: Function, // 更新
    beforeDestroy: Function, // 销毁前
    destroyed: Function, // 销毁
    h: {},
  },
  components: {
    comp,
  },
  computed: {
    _on() {
      const events = {};
      let scope = {
        ...this.scope,
        ref: this.$refs.target,
      };
      if (this.on) {
        Object.entries(this.on).forEach(([key, handler]) => {
          events[key] = (...args) => handler?.(...args, scope);
        });
      }

      // 处理以 on 开头的事件配置
      Object.entries(this.omitProps)
        .filter(([key, value]) => /^on[A-Z]/.test(key) && isFunction(value))
        .forEach(([key, handler]) => {
          const eventName = key.slice(2).toLowerCase(); // 优化事件名转换
          events[eventName] = (...args) => handler?.(...args, scope);
        });

      return {
        ...events,
        input: (event) => {
          this.$emit("input", event);
          events.input && events.input(event);
        },
        change: (event) => {
          this.$emit("change", event);
          events.change && events.change(event);
        },
      };
    },
    _attrs() {
      // 优化属性过滤逻辑
      const componentProps =
        this.$options.components[this.compName]?.options?.props || {};
      return Object.fromEntries(
        Object.entries(this.omitProps).filter(([key]) => !componentProps[key])
      );
    },
    omitProps() {
      const omitKeys = Object.keys(this._props); // 忽略当前组件的props
      const props = omit(this.comp, omitKeys);
      if (isFunction(this.bind)) {
        return Object.assign(props, this.bind(this.scope));
      }
      return Object.assign(props, this.bind);
    },
    placeholder() {
      if (this.comp.placeholder) {
        return this.comp.placeholder;
      }
      if (this.name === "el-input") {
        return "请输入" + this.scope.item.label;
      }
      return "请选择" + this.scope.item.label;
    },
    compName() {
      if (this.isChildren || this.children) return this.name;
      const name = {
        "el-select": "sc-select",
        "el-checkbox-group": "sc-checkbox",
        "el-radio-group": "sc-radio",
        "el-switch": "sc-switch",
        "el-cascader": "sc-cascader",
      };
      if (this.comp.options && this.name === "el-input") {
        return "sc-select";
      }
      return name[this.name] || this.name;
    },
    clearable() {
      if (this.omitProps.clearable !== undefined) {
        return this.omitProps.clearable;
      }
      return true;
    },
    compSize() {
      return this.omitProps.size || this.size || (this.$ELEMENT || {}).size;
    },
  },
  created() {
    this.created && this.created(this.scope);
  },
  mounted() {
    this.mounted && this.mounted(this.scope, this.$refs.target);
  },
  updated() {
    this.updated && this.updated(this.scope, this.$refs.target);
  },
  beforeDestroy() {
    this.beforeDestroy && this.beforeDestroy(this.scope, this.$refs.target);
  },
  destroyed() {
    this.destroyed && this.destroyed(this.scope, this.$refs.target);
  },
  render(h) {
    const scopedSlots = {};

    if (this.scopedSlots || this.slots) {
      const slots = { ...this.scopedSlots, ...this.slots };
      for (const key in slots) {
        scopedSlots[key] = () => {
          return slots[key](h, this.scope);
        };
      }
    }
    const renderChildren = (children) => {
      if (children) {
        if (isFunction(children)) {
          if (children.length === 2) {
            children = children(h, this.scope);
            if (isVNode(children)) return children;
          } else {
            children = children(this.scope);
          }
        }
        if (isArray(children)) {
          return children.map((i) => {
            return (
              <comp
                props={{ ...i, comp: i }}
                scope={this.scope}
                isChildren={true}
              />
            );
          });
        } else if (isPlainObject(children) === "object") {
          return (
            <comp
              props={{ ...i, comp: i }}
              scope={this.scope}
              isChildren={true}
            />
          );
        } else {
          return children;
        }
      }
    };
    // 插入用来判断的具名插槽，防止组件判断条件为 v-if="$slots.prefix" 时不成立
    const fakeSlot = () => {
      return Object.keys(scopedSlots).map((slot) => <i slot={slot}></i>);
    };
    return (
      <this.compName
        placeholder={this.placeholder}
        size={this.compSize}
        disabled={this.omitProps.disabled ? true : false}
        attrs={this._attrs}
        props={this.omitProps}
        value={this.value}
        scope={this.scope}
        on={this._on}
        nativeOn={this.nativeOn}
        scopedSlots={scopedSlots}
        clearable={this.clearable}
        ref={(el) => {
          if (this.comp.ref) this.comp.ref(el);
          this.$refs.target = el;
        }}
        directives={this.directives}
      >
        {renderChildren(this.children)}
        {fakeSlot()}
      </this.compName>
    );
  },
};
</script>
