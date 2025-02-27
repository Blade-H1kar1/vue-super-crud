<script>
import create from "core/create";
export default create({
  name: "position",
  props: {
    inline: {
      type: Boolean,
      default: true,
    },
    slotName: String,
    render: Function,
    slots: {
      type: Object,
      default() {
        return {};
      },
    },
    scope: {},
    ellipsis: Boolean,
  },
  computed: {
    leftSlot() {
      return this.slots[`${this.slotName}-left`] || this.$scopedSlots.left;
    },
    rightSlot() {
      return this.slots[`${this.slotName}-right`] || this.$scopedSlots.right;
    },
    topSlot() {
      return this.slots[`${this.slotName}-top`] || this.$scopedSlots.top;
    },
    bottomSlot() {
      return this.slots[`${this.slotName}-bottom`] || this.$scopedSlots.bottom;
    },
    hasPosition() {
      return this.topSlot || this.bottomSlot || this.leftSlot || this.rightSlot;
    },
    contentStyle() {
      if (!this.ellipsis) return {};
      return {
        "white-space": "nowrap",
        overflow: "hidden",
        "text-overflow": "ellipsis",
      };
    },
    // 动态计算grid布局样式
    gridStyle() {
      const areas = [];
      if (this.topSlot) {
        areas.push('"top top top"');
      }
      const middleRow = [
        this.leftSlot ? "left" : ".",
        "content",
        this.rightSlot ? "right" : ".",
      ].join(" ");
      areas.push(`"${middleRow}"`);

      if (this.bottomSlot) {
        areas.push('"bottom bottom bottom"');
      }
      const columns = [
        this.leftSlot ? "auto" : "0",
        "1fr",
        this.rightSlot ? "auto" : "0",
      ].join(" ");
      return {
        display: this.inline ? "inline-grid" : "grid",
        "grid-template-areas": areas.join("\n"),
        "grid-template-columns": columns,
        "align-items": "center",
      };
    },
  },
  render(h) {
    const renderContent = () => {
      if (this.slots[`${this.slotName}`]) {
        return this.slots[`${this.slotName}`](this.scope);
      }
      if (this.$scopedSlots.default) {
        return this.$scopedSlots.default(this.scope);
      }
      if (this.render) {
        return this.render(h, this.scope);
      }
    };
    const content = renderContent();
    if (
      !content &&
      !this.topSlot &&
      !this.leftSlot &&
      !this.rightSlot &&
      !this.bottomSlot
    )
      return null;
    return (
      <div
        class={[this.b([this.slotName || "position"])]}
        style={this.gridStyle}
      >
        {this.topSlot && <div class="top">{this.topSlot(this.scope)}</div>}
        {this.leftSlot && <div class="left">{this.leftSlot(this.scope)}</div>}
        {content && (
          <div class="content" style={this.contentStyle}>
            {content}
          </div>
        )}
        {this.rightSlot && (
          <div class="right">{this.rightSlot(this.scope)}</div>
        )}
        {this.bottomSlot && (
          <div class="bottom">{this.bottomSlot(this.scope)}</div>
        )}
      </div>
    );
  },
});
</script>
