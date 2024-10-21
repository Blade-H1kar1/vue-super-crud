<script>
import { isVNode } from "utils";
import { isFunction } from "lodash-es";
import position from "./position.vue";
export default {
  name: "render",
  props: {
    prop: String,
    render: Function,
    item: Object,
    slots: Object,
    scope: {
      type: Object,
      default() {
        return {};
      },
    },
    position: Boolean, // 是否渲染位置
    positionGap: Number, // 位置渲染的间隙
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
      const slot = slots[prop];
      if (slot) return slot(scope);
    },
    getRender(h, scope) {
      const render = this.render;
      if (render) {
        const VNode = isFunction(render) ? this.render(h, scope) : render;
        if (VNode) {
          return isVNode(VNode) ? VNode : <span>{VNode}</span>;
        }
      }
    },
    getDefaultRender(h, scope) {
      if (Array.isArray(this.$slots.default)) {
        return <span>{this.$slots.default}</span>;
      }
      return this.$slots.default;
    },
  },
  render(h) {
    const chains = this.interruptibleCompose(
      this.getSlot,
      this.getRender,
      this.getDefaultRender
    );
    const VNode = chains(h, {
      ...this.scope,
      item: this.item,
      config: this.config,
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
