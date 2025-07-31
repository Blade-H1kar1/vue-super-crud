<template>
  <div :class="containerClass" :style="containerStyle">
    <template v-for="(panel, i) in panels">
      <!-- 面板内容 -->
      <div
        v-show="!collapsedPanels[i]"
        :class="panelClass"
        :style="panelStyle(panel, i)"
        :key="i"
      >
        <component :is="renderPanelComponent" :panel="panel" />
      </div>

      <!-- 折叠后的占位区域 -->
      <CollapsedPanel
        v-if="collapsedPanels[i]"
        :panel="panel"
        :panel-index="i"
        :collapsed-panel-class="collapsedPanelClass"
        :collapsed-panel-style="collapsedPanelStyle"
        :expand-icon-class="expandIconClass(i)"
        :should-append-first="shouldAppendFirst(i)"
        :on-expand="expandPanel"
        :key="i + 'collapsed'"
      />

      <!-- 分割线 -->
      <div
        v-if="shouldShowGutter(i)"
        :class="gutterClass"
        :style="gutterStyle"
        :key="i + 'gutter'"
        :data-prev-collapsed="collapsedPanels[i]"
        :data-next-collapsed="collapsedPanels[i + 1]"
        @click="handleGutterClick($event, i)"
        @mousemove="handleGutterMouseMove"
        @mouseleave="handleGutterMouseLeave"
      ></div>
    </template>
  </div>
</template>

<script>
import SplitterPanel from "./panel.vue";
// 折叠面板组件 - 使用render函数处理复杂的条件渲染逻辑
import CollapsedPanel from "./collapsedPanel.vue";
import { create } from "core";

export default create({
  name: "collapse-splitter",
  components: {
    SplitterPanel,
    CollapsedPanel,
  },
  props: {
    layout: {
      type: String,
      default: "horizontal",
      validator: (value) => ["horizontal", "vertical"].includes(value),
    },
    gutterSize: {
      type: Number,
      default: 8,
    },
    gutterColor: {
      type: String,
      default: "var(--border-color-light)",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      panelStates: [],
    };
  },
  computed: {
    panels() {
      const panels = [];
      if (this.$slots.default) {
        this.$slots.default.forEach((child) => {
          if (
            child &&
            child.componentOptions &&
            child.componentOptions.tag === "sc-splitter-panel"
          ) {
            panels.push(child);
          }
        });
      }
      return panels;
    },
    containerClass() {
      return [this.b(), this.b(this.layout)];
    },
    containerStyle() {
      return {
        display: "flex",
        flexDirection: this.layout === "horizontal" ? "row" : "column",
      };
    },
    panelClass() {
      return this.b("panel");
    },
    collapsedPanelClass() {
      return [this.b("panel"), this.b("panel", "collapsed")];
    },
    collapsedPanelStyle() {
      return {
        flexGrow: "0",
        flexShrink: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        borderLeft:
          this.layout === "horizontal"
            ? "1px solid var(--border-color-light)"
            : "none",
        borderTop:
          this.layout === "vertical"
            ? "1px solid var(--border-color-light)"
            : "none",
        color: "var(--text-color-regular)",
        fontSize: "14px",
      };
    },
    gutterClass() {
      return [
        this.b("gutter"),
        this.b("gutter", this.layout),
        this.b("gutter", { disabled: this.disabled }),
      ];
    },
    gutterStyle() {
      const size = this.gutterSize + "px";
      return {
        [this.layout === "horizontal" ? "width" : "height"]: size,
        position: "relative",
        backgroundColor: this.gutterColor,
      };
    },

    renderPanelComponent() {
      return {
        props: ["panel"],
        render(h) {
          return this.panel;
        },
      };
    },

    // 获取折叠状态数组
    collapsedPanels() {
      return this.panelStates.map((state) => state.collapsed);
    },
    // 获取可见面板数量
    visiblePanelCount() {
      return this.panelStates.filter((state) => !state.collapsed).length;
    },
    isHorizontal() {
      return this.layout === "horizontal";
    },
  },
  mounted() {
    this.initializePanels();
  },
  methods: {
    initializePanels() {
      // 获取所有panel的size和collapsed属性
      const panelSizes = this.panels.map((panel) => {
        const propsData = panel.componentOptions?.propsData;
        return propsData?.size || null;
      });

      // 计算总的指定大小
      const specifiedSizes = panelSizes.filter((size) => size !== null);
      const totalSpecifiedSize = specifiedSizes.reduce(
        (sum, size) => sum + size,
        0
      );

      // 计算未指定大小的面板数量
      const unspecifiedCount = panelSizes.filter(
        (size) => size === null
      ).length;

      // 计算未指定大小面板的平均大小
      const remainingSize = Math.max(0, 100 - totalSpecifiedSize);
      const defaultSize =
        unspecifiedCount > 0 ? remainingSize / unspecifiedCount : 0;

      // 初始化面板状态对象
      this.panelStates = this.panels.map((panel, index) => {
        const propsData = panel.componentOptions?.propsData;
        const specifiedSize = propsData?.size;
        const isCollapsed = propsData?.collapsed || false; // 读取collapsed属性

        return {
          index,
          collapsed: isCollapsed, // 使用panel组件的collapsed属性
          size:
            specifiedSize !== null && specifiedSize !== undefined
              ? specifiedSize
              : defaultSize,
          originalSize:
            specifiedSize !== null && specifiedSize !== undefined
              ? specifiedSize
              : defaultSize, // 保存原始大小
          expandDirection: null, // 展开方向
          lastClickInfo: null, // 最后点击信息
        };
      });
    },



    shouldShowGutter(gutterIndex) {
      // 最后一个面板后不显示分割线
      if (gutterIndex >= this.panels.length - 1) return false;

      const currentPanel = this.panelStates[gutterIndex];
      const nextPanel = this.panelStates[gutterIndex + 1];

      // 如果相邻面板都折叠了，隐藏分割线
      if (currentPanel?.collapsed && nextPanel?.collapsed) {
        return false;
      }

      // 如果相邻面板都没有折叠，显示分割线
      if (!currentPanel?.collapsed && !nextPanel?.collapsed) {
        return true;
      }

      // 如果相邻面板有任一折叠，检查是否有面板扩大了
      if (currentPanel?.collapsed || nextPanel?.collapsed) {
        // 查找折叠的面板及其点击信息
        const collapsedPanel = this.panelStates.find(
          (p) => p.collapsed && p.lastClickInfo
        );
        if (!collapsedPanel) return false;

        const { index: collapsedIndex, lastClickInfo } = collapsedPanel;

        // 检查当前面板或下一个面板是否扩大了
        const currentPanelExpanded = this.shouldReceiveExtraSpace(
          gutterIndex,
          collapsedIndex,
          lastClickInfo
        );
        const nextPanelExpanded = this.shouldReceiveExtraSpace(
          gutterIndex + 1,
          collapsedIndex,
          lastClickInfo
        );

        // 只有当相邻面板有任一折叠并且自身扩大了才隐藏分割线
        return !(currentPanelExpanded || nextPanelExpanded);
      }

      return true;
    },

    calculatePanelSize(panelIndex) {
      const panel = this.panelStates[panelIndex];
      if (!panel || panel.collapsed) return 0;

      // 如果没有折叠面板，使用原始大小
      if (this.visiblePanelCount === this.panels.length) {
        return panel.originalSize;
      }

      // 查找折叠的面板及其点击信息
      const collapsedPanel = this.panelStates.find(
        (p) => p.collapsed && p.lastClickInfo
      );
      if (!collapsedPanel) {
        // 重新计算可见面板的大小分配
        const visiblePanels = this.panelStates.filter((p) => !p.collapsed);
        const totalOriginalSize = visiblePanels.reduce(
          (sum, p) => sum + p.originalSize,
          0
        );

        // 按比例分配100%的空间
        return totalOriginalSize > 0
          ? (panel.originalSize / totalOriginalSize) * 100
          : 100 / this.visiblePanelCount;
      }

      const { index: collapsedIndex, lastClickInfo } = collapsedPanel;

      // 智能分配折叠面板的空间
      const shouldGetExtraSpace = this.shouldReceiveExtraSpace(
        panelIndex,
        collapsedIndex,
        lastClickInfo
      );

      if (shouldGetExtraSpace) {
        // 获得额外空间的面板：原始大小 + 折叠面板的大小
        const collapsedPanelOriginalSize =
          this.panelStates[collapsedIndex].originalSize;
        return panel.originalSize + collapsedPanelOriginalSize;
      } else {
        // 保持原始大小
        return panel.originalSize;
      }
    },

    shouldReceiveExtraSpace(panelIndex, collapsedIndex, clickInfo) {
      if (!clickInfo) return false;

      const { clickSide } = clickInfo;
      const isFirstPanel = collapsedIndex === 0;
      const isLastPanel = collapsedIndex === this.panels.length - 1;

      if (isFirstPanel) return panelIndex === collapsedIndex + 1;
      if (isLastPanel) return panelIndex === collapsedIndex - 1;

      // 中间面板根据点击位置分配
      return clickSide === "left"
        ? panelIndex === collapsedIndex + 1
        : panelIndex === collapsedIndex - 1;
    },

    panelStyle(panel, i) {
      const panelState = this.panelStates[i];
      const panelSize = this.calculatePanelSize(i);
      const isCollapsed = panelState?.collapsed || false;
      const minSizeProp = this.isHorizontal ? "minWidth" : "minHeight";

      return {
        flexBasis: isCollapsed ? "0%" : `${panelSize}%`,
        flexGrow: isCollapsed ? "0" : "1",
        flexShrink: "1",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: isCollapsed ? "0" : "1",
        [minSizeProp]: isCollapsed ? "0" : "auto",
      };
    },
    handleGutterClick(event, gutterIndex) {
      const rect = event.target.getBoundingClientRect();
      const clickPosition = this.isHorizontal
        ? (event.clientX - rect.left) / rect.width
        : (event.clientY - rect.top) / rect.height;

      const targetPanelIndex =
        clickPosition < 0.5 ? gutterIndex : gutterIndex + 1;
      const clickSide = clickPosition < 0.5 ? "left" : "right";

      // 记录点击信息到目标面板
      const targetPanel = this.panelStates[targetPanelIndex];
      if (targetPanel) {
        targetPanel.lastClickInfo = {
          gutterIndex,
          clickSide,
          isHorizontal: this.isHorizontal,
        };
      }

      this.togglePanel(targetPanelIndex);
    },

    handleGutterMouseMove(event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const gutter = event.currentTarget;
      const position = this.isHorizontal
        ? (event.clientX - rect.left) / rect.width
        : (event.clientY - rect.top) / rect.height;

      // 移除所有悬停类
      gutter.classList.remove(
        "hover-left",
        "hover-right",
        "hover-top",
        "hover-bottom"
      );

      // 根据位置和布局添加相应的悬停类
      const hoverClass = this.getHoverClass(position);
      if (hoverClass) gutter.classList.add(hoverClass);
    },

    getHoverClass(position) {
      const isLeft = position < 0.5;
      if (this.isHorizontal) {
        return isLeft ? "hover-left" : "hover-right";
      }
      return isLeft ? "hover-top" : "hover-bottom";
    },

    handleGutterMouseLeave(event) {
      event.currentTarget.classList.remove(
        "hover-left",
        "hover-right",
        "hover-top",
        "hover-bottom"
      );
    },
    expandIconClass(index) {
      const panel = this.panelStates[index];
      const isFirst = index === 0;
      const isLast = index === this.panels.length - 1;
      const clickInfo = panel?.lastClickInfo;

      // 获取基础图标方向
      const getDirection = () => {
        if (isFirst) return this.isHorizontal ? "right" : "down";
        if (isLast) return this.isHorizontal ? "left" : "up";

        // 中间面板根据点击信息判断
        if (clickInfo?.clickSide === "left") {
          return this.isHorizontal ? "right" : "down";
        }
        return this.isHorizontal ? "left" : "up";
      };

      return `el-icon-arrow-${getDirection()}`;
    },

    // 判断是否应该将 append 插槽内容放在前面
    shouldAppendFirst(index) {
      const panel = this.panelStates[index];
      const isFirst = index === 0;
      const isLast = index === this.panels.length - 1;
      const clickInfo = panel?.lastClickInfo;

      // 获取基础图标方向
      const getDirection = () => {
        if (isFirst) return this.isHorizontal ? "right" : "down";
        if (isLast) return this.isHorizontal ? "left" : "up";

        // 中间面板根据点击信息判断
        if (clickInfo?.clickSide === "left") {
          return this.isHorizontal ? "right" : "down";
        }
        return this.isHorizontal ? "left" : "up";
      };

      const direction = getDirection();
      // 当图标方向为 right 时，append 内容在左侧（前面）
      // 当图标方向为 left 时，append 内容在右侧（后面）
      return direction === 'right';
    },
    // 折叠面板
    collapsePanel(index) {
      if (this.disabled || !this.panelStates[index]) return;

      this.$set(this.panelStates[index], "collapsed", true);
      this.emitPanelEvent("panel-collapse", index, true);
    },

    // 展开面板
    expandPanel(index) {
      if (this.disabled || !this.panelStates[index]) return;

      const panel = this.panelStates[index];
      this.$set(panel, "collapsed", false);
      this.$set(panel, "lastClickInfo", null); // 清除点击信息

      this.emitPanelEvent("panel-expand", index, false);
    },

    // 切换面板状态
    togglePanel(index) {
      const panel = this.panelStates[index];
      if (!panel) return;

      panel.collapsed ? this.expandPanel(index) : this.collapsePanel(index);
    },

    emitPanelEvent(eventName, index, collapsed) {
      this.$emit(eventName, {
        index,
        collapsed,
        collapsedPanels: this.collapsedPanels,
        panelStates: [...this.panelStates],
      });
    },
    // 展开所有面板
    expandAllPanels() {
      this.panelStates.forEach((panel) => {
        this.$set(panel, "collapsed", false);
        this.$set(panel, "lastClickInfo", null);
      });

      this.$emit("all-panels-expanded", {
        collapsedPanels: this.collapsedPanels,
        panelStates: [...this.panelStates],
      });
    },

    getPanelStates() {
      return [...this.panelStates];
    },
  },
  watch: {
    panels: {
      handler() {
        this.initializePanels();
      },
      immediate: false,
    },
  },
});
</script>
