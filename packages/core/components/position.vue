<script>
import create from "core/create";
export default create({
  name: "position",
  props: {
    prop: String,
    // item: {
    //   type: Object,
    //   default() {
    //     return {};
    //   },
    // },
    slots: {
      type: Object,
      default() {
        return {};
      },
    },
    scope: {},
    gap: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    renderType() {
      const position = {
        left: this.getPosType("left").type,
        right: this.getPosType("right").type,
        top: this.getPosType("top").type,
        bottom: this.getPosType("bottom").type,
      };
      if (
        (position.left || position.right) &&
        (position.top || position.bottom)
      ) {
        return "all";
      }
      if (position.left || position.right) {
        return "x";
      }
      if (position.top || position.bottom) {
        return "y";
      }
    },
  },
  methods: {
    getPosType(pos) {
      const slotName = `${this.prop}-${pos}`;
      if (this.slots[slotName]) {
        return {
          type: "slot",
          render: this.slots[slotName],
        };
      }
      // if (this.item[pos + "Render"]) {
      //   return {
      //     type: "render",
      //     render: this.item[pos + "Render"],
      //   };
      // }
      return {
        type: null,
        render: null,
      };
    },
    getPositionRender(h, pos) {
      const compName = pos === "top" || pos === "bottom" ? "div" : "span";
      const posObj = this.getPosType(pos);
      if (!posObj.type) return;
      // if (posObj.type === "render") {
      //   return (
      //     <compName class={this.b(pos)}>
      //       {posObj.render(h, this.scope)}
      //     </compName>
      //   );
      // }
      if (posObj.type === "slot") {
        return (
          <compName class={this.b(pos)}>{posObj.render(this.scope)}</compName>
        );
      }
    },
  },
  render(h) {
    const defaultSlot = this.$slots.default;
    if (this.renderType === "all") {
      return (
        <span
          class={this.b()}
          style={{ "--sc-position-margin": `${this.gap}px` }}
        >
          {this.getPositionRender(h, "top")}
          <div class={this.b("center")}>
            {this.getPositionRender(h, "left")}
            {defaultSlot}
            {this.getPositionRender(h, "right")}
          </div>
          {this.getPositionRender(h, "bottom")}
        </span>
      );
    }
    if (this.renderType === "x") {
      return (
        <span
          class={this.b()}
          style={{ "--sc-position-margin": `${this.gap}px` }}
        >
          {this.getPositionRender(h, "left")}
          {defaultSlot}
          {this.getPositionRender(h, "right")}
        </span>
      );
    }
    if (this.renderType === "y") {
      return (
        <span
          class={this.b()}
          style={{ "--sc-position-margin": `${this.gap}px` }}
        >
          {this.getPositionRender(h, "top")}
          {defaultSlot}
          {this.getPositionRender(h, "bottom")}
        </span>
      );
    }
    if (Array.isArray(defaultSlot) && defaultSlot.length > 1) {
      return <span class={this.b()}>{this.$slots.default}</span>;
    }
    return this.$slots.default;
  },
});
</script>
