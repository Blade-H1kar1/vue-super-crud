import { debounce } from "lodash-es";
export default {
  data() {
    return {
      tableTop: 0,
      wrapperTop: 0,
      innerHeight: innerHeight,
    };
  },
  created() {
    this.handleResize = debounce(this.handleResize, 200);
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.getClientTop();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
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
      const defaultHeight =
        this.defaultHeight -
        (this.tableTop - this.wrapperTop) -
        this.footerHeight;
      return (
        Math.max(
          Math.ceil(this.innerHeight - this.tableTop - calc),
          defaultHeight
        ) + "px"
      );
    },
    wrapperHeight() {
      if (!this.isAutoHeight) return "auto";
      const calc = this.crudOptions.calcHeight || 0;
      return (
        Math.max(
          Math.ceil(this.innerHeight - this.wrapperTop - calc),
          this.defaultHeight
        ) + "px"
      );
    },
    footerHeight() {
      if (this.crudOptions.pagination === false) return 0;
      if (!this.total) return 0;
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
          const tableTop = this.$refs.tableRef.$el.getBoundingClientRect().top;
          if (this.tableTop !== tableTop) this.tableTop = tableTop;
          const wrapperTop = this.$refs.wrapper.getBoundingClientRect().top;
          if (this.wrapperHeight !== wrapperTop) this.wrapperTop = wrapperTop;
        });
      }
    },
    handleResize() {
      this.innerHeight = innerHeight;
      this.getClientTop();
    },
  },
};
