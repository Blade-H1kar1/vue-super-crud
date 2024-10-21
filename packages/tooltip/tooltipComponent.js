import create from "core/create";
export default (options = {}) => {
  return create({
    name: "tooltip",
    methods: {
      show() {
        if (!options.content) return;
        const tooltip = this.$refs.tooltip;
        tooltip.referenceElm = options.target;
        if (options.overflow) {
          const dom = options.target;
          const range = document.createRange();
          range.setStart(dom, 0);
          range.setEnd(dom, dom.childNodes.length);
          const rangeWidth = range.getBoundingClientRect().width;
          const selfWidth = dom.getBoundingClientRect().width;
          const isOverflowing =
            rangeWidth > selfWidth || dom.scrollWidth > dom.offsetWidth;
          if (!isOverflowing) return;
        }
        tooltip.setExpectedState(true);
        tooltip.handleShowPopper();
      },
      hide() {
        const tooltip = this.$refs.tooltip;
        tooltip.setExpectedState(false);
        tooltip.handleClosePopper();
        this.$destroy();
        this.$el.remove();
      },
    },
    render(h) {
      return (
        <el-tooltip ref="tooltip" props={options} attrs={options}></el-tooltip>
      );
    },
  });
};
