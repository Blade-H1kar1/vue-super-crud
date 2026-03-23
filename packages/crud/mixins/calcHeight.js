import { debounce } from "lodash-es";
import { checkVisibility } from "utils";
export default {
  data() {
    return {
      tableTop: 0,
      wrapperTop: 0,
      innerHeight: innerHeight,
      observer: null,
    };
  },
  created() {
    this.handleResize = debounce(this.handleResize, 200);
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    if (this.isAutoHeight) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.getClientTop();
          }
        });
      });
      this.observer.observe(this.$refs.tableRef?.$el);
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
    this.observer?.disconnect();
  },
  computed: {
    defaultHeight() {
      return this.crudOptions.defaultHeight || 200;
    },
    isAutoHeight() {
      return this.crudOptions.height === "auto";
    },
    tableHeight() {
      if (!this.isAutoHeight) return this.crudOptions.height;
      const calc = (this.crudOptions.calcHeight || 0) + this.footerHeight;
      return (
        Math.max(
          Math.ceil(this.innerHeight - this.tableTop - calc),
          this.defaultHeight
        ) + "px"
      );
    },
    wrapperHeight() {
      if (!this.isAutoHeight) return "auto";
      const calc = this.crudOptions.calcHeight || 0;
      if (this.tableTop - this.wrapperTop > this.defaultHeight) {
        return (
            Math.ceil(this.defaultHeight + (this.tableTop - this.wrapperTop)) + "px"
        );
      }
      return (
        Math.ceil(this.innerHeight - this.wrapperTop - calc) + "px"
      );
    },
    footerHeight() {
      if (
        checkVisibility(this.crudOptions.pagination, null, this._total > 0) ===
        false
      )
        return 0;
      return 50;
    },
  },
  updated() {
    this.getClientTop();
  },
  activated() {
    this.getClientTop();
  },
  methods: {
    getClientTop() {
      if (this.isAutoHeight) {
        this.$nextTick(() => {
          const tableRef = this.$refs.tableRef?.$el;
          if (!tableRef) return;
          const tableTop = tableRef?.getBoundingClientRect().top;
              if (this.tableTop !== tableTop) this.tableTop = tableTop;
              const wrapperTop =
                this.$refs.wrapper?.getBoundingClientRect().top;
              if (this.wrapperHeight !== wrapperTop)
                this.wrapperTop = wrapperTop;
        });
      }
    },
    handleResize() {
      this.innerHeight = innerHeight;
      this.getClientTop();
    },
  },
};
