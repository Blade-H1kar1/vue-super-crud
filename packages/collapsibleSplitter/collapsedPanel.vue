<script>
export default {
  name: "CollapsedPanel",
  functional: true,
  props: {
    // 面板组件实例
    panel: {
      type: Object,
      required: true,
    },
    // 面板索引
    panelIndex: {
      type: Number,
      required: true,
    },
    // 折叠面板的CSS类
    collapsedPanelClass: {
      type: Array,
      required: true,
    },
    // 折叠面板的样式
    collapsedPanelStyle: {
      type: Object,
      required: true,
    },
    // 展开图标的CSS类
    expandIconClass: {
      type: String,
      required: true,
    },
    // 是否将追加内容放在前面
    shouldAppendFirst: {
      type: Boolean,
      default: false,
    },
    // 展开面板的回调函数
    onExpand: {
      type: Function,
      required: true,
    },
  },
  render(h, { props }) {
    const {
      panel,
      panelIndex,
      collapsedPanelClass,
      collapsedPanelStyle,
      expandIconClass,
      shouldAppendFirst,
      onExpand,
    } = props;

    // 获取panel组件的插槽内容
    const getCollapsedSlot = () => {
      const panelInstance = panel.componentInstance;
      if (panelInstance && panelInstance.getCollapsedSlot) {
        const slotContent = panelInstance.getCollapsedSlot();
        return slotContent && slotContent.length > 0 ? slotContent : null;
      }
      return null;
    };

    const getCollapsedAppendSlot = () => {
      const panelInstance = panel.componentInstance;
      if (panelInstance && panelInstance.getCollapsedAppendSlot) {
        const slotContent = panelInstance.getCollapsedAppendSlot();
        return slotContent && slotContent.length > 0 ? slotContent : null;
      }
      return null;
    };

    // 渲染折叠内容
    const renderCollapsedContent = () => {
      const collapsedSlot = getCollapsedSlot();
      return collapsedSlot || h("i", { class: expandIconClass });
    };

    // 渲染追加内容
    const renderAppendContent = () => {
      return getCollapsedAppendSlot();
    };

    // 根据shouldAppendFirst决定内容顺序
    const renderContent = () => {
      const collapsedContent = renderCollapsedContent();
      const appendContent = renderAppendContent();

      if (!appendContent) {
        return [collapsedContent];
      }

      return shouldAppendFirst
        ? [appendContent, collapsedContent]
        : [collapsedContent, appendContent];
    };

    return h(
      "div",
      {
        class: collapsedPanelClass,
        style: collapsedPanelStyle,
        on: {
          click: () => onExpand(panelIndex),
        },
        key: panelIndex + "collapsed",
      },
      renderContent()
    );
  },
};
</script>
