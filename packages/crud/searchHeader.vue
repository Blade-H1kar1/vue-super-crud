<script>
import { isEmptyData } from "utils";
import { create } from "core";
import Render from "core/components/render";
import { isFunction, merge, isPlainObject, get } from "lodash-es";
export default create({
  name: "crud-search-header",
  props: {
    item: {},
  },
  mixins: [],
  inject: ["ctx"],
  provide() {
    return {
      searchHeader: this,
      controlCtx: null,
    };
  },
  data() {
    return {
      active: false,
    };
  },
  created() {
    this.$emit("update:isSearch", this.isSearch());
    this.ctx.$on("closeSearchPopover", (prop) => {
      if (prop === this.item.prop) return;
      this.closePopover();
    });
    this.$watch(
      () =>
        this.item.validateProp
          ? get(this.ctx.query, this.item.validateProp)
          : this.ctx.query[this.item.prop],
      (val) => {
        this.$emit("update:isSearch", this.isSearch());
      },
      {
        deep: true,
      }
    );
  },
  computed: {
    searchHeader() {
      return this.ctx.crudOptions.searchHeader;
    },
    mergeConfig() {
      return merge({}, this.searchHeader, this.item);
    },
    componentStrategy() {
      return [
        {
          rule: "*input",
          comp: {
            nativeOn: {
              keyup: (e) => {
                if (e.keyCode === 13) {
                  this.search();
                }
              },
            },
            on: {
              clear: () => {
                this.search();
              },
            },
          },
        },
        {
          rule: "*select",
          comp: {
            on: {
              change: (val) => {
                this.isChange = true;
              },
              "visible-change": (val) => {
                if (!val && this.isChange) {
                  this.isChange = false;
                  this.search();
                }
              },
            },
          },
        },
        {
          rule: "*cascader",
          comp: {
            on: {
              change: (val) => {
                this.isChange = true;
              },
              "visible-change": (val) => {
                if (!val && this.isChange) {
                  this.isChange = false;
                  this.search();
                }
              },
            },
          },
        },
        {
          rule: "*date-picker",
          comp: {
            on: {
              change: (val) => {
                this.search();
              },
            },
          },
        },
      ];
    },
  },
  methods: {
    closePopover() {
      this.$refs.popover && this.$refs.popover.doClose();
    },
    search(val) {
      if (this.justSearched) return;
      this.justSearched = true;
      this.ctx.handleSearch();
      this.closePopover();
      setTimeout(() => {
        this.justSearched = false;
      }, 200);
    },
    reset() {
      if (isFunction(this.item.reset)) this.item.reset();
      this.ctx.handleReset(this.item.prop);
      this.closePopover();
    },
    popClick(e) {
      e.stopPropagation();
    },
    isSearch() {
      const value = this.item.validateProp
        ? get(this.ctx.query, this.item.validateProp)
        : this.ctx.query[this.item.prop];
      if (Array.isArray(value) && value.length) {
        return value.every((item) => !isEmptyData(item));
      }
      if (isPlainObject(value) && Object.keys(value).length) {
        return Object.values(value).every((item) => !isEmptyData(item));
      }
      return !isEmptyData(value);
    },
  },
  render(h) {
    const contentRender = () => {
      return (
        <Render
          props={this.item}
          item={this.item}
          slots={this.ctx.extendsScopedSlots}
          scope={{
            row: this.ctx.query,
          }}
          mode="searchHeader"
          size={this.ctx.crudOptions.size}
          compStrategy={this.componentStrategy}
          commonCompStrategy={{
            mounted: (scope, ref) => {
              this.instance = ref;
            },
          }}
          defaultComp={{
            name: "el-input",
            props: {
              clearable: true,
            },
          }}
        ></Render>
      );
    };
    const footer = () => {
      return (
        <div style="display: flex; align-items: center;">
          {this.mergeConfig.searchBtn && (
            <el-button
              icon="el-icon-search"
              type="primary"
              onClick={this.search}
              style="margin-left: 10px;"
            ></el-button>
          )}
          {this.mergeConfig.resetBtn && (
            <el-button
              icon="el-icon-refresh-right"
              onClick={this.reset}
              style="margin-left: 10px;"
            ></el-button>
          )}
        </div>
      );
    };
    return (
      <el-popover
        popper-class={this.b()}
        ref="popover"
        placement="bottom"
        trigger="click"
        props={this.mergeConfig}
        onShow={() => {
          this.ctx.$emit("closeSearchPopover", this.item.prop);
          this.ctx.showPopperNum++;
          this.$nextTick(() => {
            this.instance?.$el.querySelector("input")?.focus();
          });
        }}
        onHide={() => {
          this.isSearch && this.search();
          if (this.ctx.showPopperNum > 0) {
            this.ctx.showPopperNum--;
          }
        }}
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
