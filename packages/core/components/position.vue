<script>
import create from "core/create";
import { resolveRender } from "utils";
export default create({
  name: "position",
  props: {
    inline: {
      type: Boolean,
      default: true,
    },
    slotName: String,
    slotSuffixes: {
      type: Array,
      default: () => [],
    },
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
    slotNames() {
      if (!this.slotName) return;
      // 如果没有后缀，直接返回原始slotName
      if (!this.slotSuffixes.length) return this.slotName;

      // 将所有后缀用'-'连接
      const suffix = this.slotSuffixes
        .filter(Boolean) // 过滤掉空值
        .join("-");

      // 如果有后缀，返回 slotName-suffix 格式
      return suffix ? `${this.slotName}-${suffix}` : this.slotName;
    },
    leftSlot() {
      return this.slots[`${this.slotNames}-left`] || this.$scopedSlots.left;
    },
    rightSlot() {
      return this.slots[`${this.slotNames}-right`] || this.$scopedSlots.right;
    },
    topSlot() {
      return this.slots[`${this.slotNames}-top`] || this.$scopedSlots.top;
    },
    bottomSlot() {
      return this.slots[`${this.slotNames}-bottom`] || this.$scopedSlots.bottom;
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
      if (this.slots[`${this.slotNames}`]) {
        return this.slots[`${this.slotNames}`](this.scope);
      }
      if (this.render) {
        return resolveRender(this.render, h, this.scope);
      }
      if (this.$scopedSlots.default) {
        return this.$scopedSlots.default(this.scope);
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
        class={[this.b([this.slotNames || "position"])]}
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
