<script>
import { isComponent, isVNode } from "utils";
import Comp from "./comp.vue";
import { cloneDeep, isFunction, isPlainObject, merge, get } from "lodash-es";
import { mergeTemp } from "utils/mergeTemp";
import { defaultRender as _defaultRender, initDict } from "core";
import position from "./position.vue";
export default {
  name: "render",
  props: {
    value: {},
    prop: {
      type: String,
      default: "value",
    },
    comp: [Object, Function],
    render: Function,
    item: Object,
    raw: Object, // 未加工的item
    slots: Object,
    mode: [String, Boolean],
    scope: {},
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    controlDefault: Function, // 控制已有的默认渲染
    defaultRender: Function, // 自定义默认渲染
    position: Boolean, // 是否渲染位置
    positionGap: Number, // 位置渲染的间隙
  },
  mixins: [initDict],
  computed: {
    $value: {
      get() {
        const input = this.item.formatData?.input;
        if (input) return input(this.value, this.scope);
        return this.value;
      },
      set(value) {
        const output = this.item.formatData?.output;
        if (output) {
          const formatValue = output(value, this.scope, (prop, value) => {
            this.$set(this.scope.row, prop, value);
          });
          if (this.item.formatData.formatValue) {
            this.scope.row["$" + this.prop] = value;
          }
          if (formatValue !== undefined) this.$emit("input", formatValue);
        } else {
          this.$emit("input", value);
        }
      },
    },
  },
  methods: {
    interruptibleCompose(...funcs) {
      return funcs.reduce((f1, f2) => {
        return function (...args) {
          var result = f1.apply(this, args);
          return result ? result : f2.apply(this, args);
        };
      });
    },
    getSlot(h, scope) {
      const slots = this.slots;
      const prop = this.prop;
      const mode = this.mode;
      if (isFunction(slots)) slots = slots();
      if (slots) {
        let slotName;
        if (prop && mode) {
          slotName = `${prop}-${mode}`;
        } else if (prop && !mode) {
          slotName = prop;
        } else if (!prop && mode) {
          slotName = mode;
        }
        const slot = slots[slotName];
        if (slot) return slot(scope);
      }
    },
    getRender(h, scope) {
      // render: (h) =>  (<div ref="ref"></div>)如果外部render函数接收了内部实例h函数再渲染的虚拟dom时，注册的ref是注册在内部实例上。render: () => (<div ref="ref"></div>) 如果没有接收内部实例h函数，jsx插件会默认使用外部实例的h函数渲染虚拟dom，所以注册的ref会注册到外部实例的ref上
      const render = this.render;
      if (render) {
        const VNode = isFunction(render) ? this.render(h, scope) : render;
        if (VNode) {
          return isVNode(VNode) ? VNode : <span>{VNode}</span>;
        }
      }
    },
    // 合并一个函数和一个对象（或两个函数）
    mergeFunctionAndObject(t, s, scope) {
      if (!s) {
        if (isFunction(t)) return t(scope);
        return t;
      }
      if (isFunction(t) && isFunction(s))
        return Object.assign(s(scope), t(scope));
      if (isFunction(t) && isPlainObject(s)) return Object.assign(s, t(scope));
      if (isPlainObject(t) && isFunction(s)) return Object.assign(s(scope), t);
      return t;
    },
    getComponent(h, scope) {
      if (this.comp) {
        let comp = {};
        if (typeof this.comp == "string" || isComponent(this.comp)) {
          comp.name = this.comp;
        } else {
          // 如果存在一方为函数时，执行函数再将comp与未加工raw.comp重新合并
          comp = this.mergeFunctionAndObject(this.comp, this.raw?.comp, scope);
        }
        return (
          <Comp
            v-model={this.$value}
            props={{ ...comp, comp }}
            size={this.config.size}
            h={this.config.h}
            config={this.config}
            scope={scope}
          />
        );
      }
    },
    getDefaultRender(h, scope) {
      if (this.$scopedSlots.default) {
        return this.$scopedSlots.default(scope);
      }
      if (isFunction(this.defaultRender)) {
        return this.defaultRender(h, scope);
      }
      if (this.controlDefault) {
        const renderFunc = this.controlDefault(_defaultRender, scope);
        const VNode = renderFunc && renderFunc(h, scope);
        if (VNode) return VNode;
      }
      return _defaultRender.formatter(h, scope);
    },
  },
  render(h) {
    // 替换为外部的h函数，用于绑定ref
    if (this.config.h) h = this.config.h;

    const chains = this.interruptibleCompose(
      this.getSlot,
      this.getRender,
      this.getComponent,
      this.getDefaultRender
    );
    const VNode = chains(h, {
      ...this.scope,
      item: this.item,
      mode: this.mode,
      config: this.config,
      dict: this.dictProxy,
      self: this,
    });
    if (this.position) {
      return (
        <position
          prop={this.prop}
          item={this.item}
          slots={this.slots}
          scope={this.scope}
          gap={this.positionGap}
        >
          {VNode}
        </position>
      );
    }
    return VNode;
  },
};
</script>
