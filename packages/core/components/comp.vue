<script>
import { set, omit, isArray, isFunction, isPlainObject } from "lodash-es";
import comp from "./comp.vue";
import { isVNode } from "utils";
export default {
  name: "comp",
  props: {
    value: {},
    setValue: {},
    // 组件名
    name: {
      default: "el-input",
    },
    // 组件参数
    comp: {
      default: undefined,
    },
    bind: [Object, Function],
    // 监听组件事件
    on: Object,
    // 插槽
    scopedSlots: {},
    slots: {},
    // 子元素
    children: {},
    // 传入的数据
    scope: Object,
    // 组件尺寸
    size: {},
    isChildren: Boolean, // 是否子组件
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
        ref: this.$refs[this.ref],
      };
      if (this.on) {
        const propsEvents = { ...this.on };
        for (const key in propsEvents) {
          events[key] = (...args) => {
            if (propsEvents[key]) {
              propsEvents[key](...args, scope);
            }
          };
        }
      }
      return {
        ...events,
        input: (event) => {
          this.$emit("input", event);
          events.input && events.input(event, scope);
        },
        change: (event) => {
          this.$emit("change", event);
          events.change && events.change(event, scope);
        },
      };
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
      if (this.$scOpt.genPlaceholder) {
        return this.$scOpt.genPlaceholder(this.scope);
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
    ref() {
      return this.comp.ref || "target";
    },
  },
  render(h) {
    if (this.h) h = this.h;
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
        attrs={this.omitProps}
        props={this.omitProps}
        value={this.value}
        scope={this.scope}
        on={this._on}
        scopedSlots={scopedSlots}
        clearable={this.clearable}
        ref={this.ref}
      >
        {renderChildren(this.children)}
        {fakeSlot()}
      </this.compName>
    );
  },
  methods: {},
};
</script>
