<script>
import { isEmptyData } from "utils";
import { create } from "core";
import Render from "core/components/render";
import { isFunction, merge, isPlainObject } from "lodash-es";
export default create({
  name: "crud",
  props: {
    item: {},
  },
  mixins: [],
  inject: ["ctx"],
  provide() {
    return {
      searchHeader: this,
    };
  },
  data() {
    return {
      active: false,
    };
  },
  mounted() {
    this.$watch(
      () => this.$refs.popover.showPopper,
      (val) => {
        this.active = val;
        if (val) {
          this.ctx.showPopperNum++;
        } else {
          if (this.ctx.showPopperNum > 0) {
            this.ctx.showPopperNum--;
          }
        }
      }
    );
  },
  watch: {
    isSearch() {
      this.$emit("update:isSearch", this.isSearch);
    },
  },
  created() {
    this.$emit("update:isSearch", this.isSearch);
  },
  computed: {
    isSearch() {
      const value = this.ctx.query[this.item.prop];
      if (Array.isArray(value) && value.length) {
        return value.every((item) => !isEmptyData(item));
      }
      if (isPlainObject(value) && Object.keys(value).length) {
        return Object.values(value).every((item) => !isEmptyData(item));
      }
      return !isEmptyData(value);
    },
    searchHeader() {
      return this.ctx.crudOptions.searchHeader;
    },
    customProps() {
      let customProps = merge({}, this.searchHeader, this.item);
      if (customProps && typeof customProps.width === "string") {
        customProps.width = parseInt(customProps.width);
      }
      return customProps;
    },
  },
  methods: {
    closePopover() {
      this.$refs.popover && this.$refs.popover.doClose();
    },
    search(val) {
      this.ctx.$refs.searchRef.handleSearch();
      this.closePopover();
    },
    reset() {
      if (isFunction(this.item.reset)) this.item.reset();
      this.ctx.$refs.searchRef.handleReset(this.item.prop);
      this.closePopover();
    },
    popClick(e) {
      // e.stopPropagation();
    },
  },
  render(h) {
    const contentRender = () => {
      return (
        <Render
          v-model={this.ctx.query[this.item.prop]}
          props={this.item}
          item={this.item}
          slots={this.ctx.extendsScopedSlots}
          scope={{
            row: this.ctx.query,
          }}
          mode="searchHeader"
          config={this.ctx.crudOptions}
          defaultRender={this.searchHeader.defaultRender}
          controlDefault={(defaultRender, scope) => {
            return defaultRender.input;
          }}
        ></Render>
      );
    };
    const footer = () => {
      return (
        <div style="float: right;">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            onClick={this.search}
            style="margin-top: 5px;"
          ></el-button>
          <el-button
            icon="el-icon-refresh-right"
            size="mini"
            onClick={this.reset}
          ></el-button>
        </div>
      );
    };
    return (
      <el-popover
        popper-class={this.b("search-header")}
        ref="popover"
        placement="bottom"
        trigger="click"
        props={this.customProps}
        scopedSlots={{
          reference: () => (
            <i class="el-icon-search search-btn" onClick={this.popClick}></i>
          ),
        }}
      >
        {contentRender()}
        {footer()}
      </el-popover>
    );
  },
});
</script>
