<script>
import { create } from "core";
import { omit } from "lodash-es";
import grid from "../grid/index.vue";
import cell from "pak/grid/cell.vue";
import formItem from "./formItem";
import simpleRender from "core/components/simpleRender";
import Render from "core/components/render";
import tooltip from "../tooltip/tooltip.vue";
export default create({
  name: "form",
  props: {
    col: Object,
    isFirstRow: Boolean,
  },
  inject: ["formCtx", "elForm"],
  provide() {
    return this.provide;
  },
  components: {
    cell,
    grid,
    formItem,
  },
  data() {
    return {};
  },
  created() {
    this.formCtx.$on("handleChild", (method, prop) => {
      if (!method) return;
      if (prop) {
        if (prop !== this.item.prop) return;
        if (!this[method])
          return console.error(`不存在方法${method},prop-${this.item.prop}`);
        this[method]();
      } else {
        this[method]();
      }
    });
  },
  methods: {
    resetField() {
      this.$refs.formItem.resetField();
    },
  },
  watch: {
    isDetail() {
      // 改变模式时，重置form，刷新item组件的provide
      this.formCtx.refreshForm();
    },
  },
  computed: {
    provide() {
      // 控制子组件单个禁用
      if (this.isDetail) {
        return {
          elForm: {
            ...this.elForm,
            disabled: this.isDetail,
          },
        };
      }
    },
    disabled() {
      return this.isDetail;
    },
    isDetail() {
      if (this.col.isDetail === false) return false;
      return this.formCtx.isDetail || this.col.isDetail;
    },
    item() {
      if (this.isDetail) {
        return this.col.detail || this.col;
      }
      return this.col;
    },
    formOptions() {
      return this.formCtx.formOptions;
    },
    rules() {
      return this.formCtx.generateRules(this.item, this.formCtx.getScope);
    },
    mode() {
      return this.item.mode || this.formOptions.mode;
    },

    labelOverTip() {
      return (
        this.formCtx.formOptions.labelOverTip ||
        this.formCtx.formOptions.labelOverTip === "" ||
        this.item.labelOverTip
      );
    },
    className() {
      const names = [];
      // 标签隐藏
      if (this.formOptions.hiddenLabel || this.item.hiddenLabel) {
        names.push("hidden-label");
      }
      // 标签粗细
      if (this.formCtx.isBorder || this.formOptions.shrinkLabel) {
        names.push("shrink-label");
      }
      // 标签超出隐藏
      if (this.labelOverTip) {
        names.push("label-over-tip");
      }
      if (this.hasFormChildren) {
        names.push("has-form-children");
      }
      if (this.item.class) {
        names.push(this.item.class);
      }
      if (this.rules.required) names.push("is-required");
      if (this.isDetail) names.push("sc--detail");
      if (this.isFirstRow) names.push("is-first-row");
      return names;
    },
    hasFormChildren() {
      return this.item.formItems && Array.isArray(this.item.formItems);
    },
  },
  render(h) {
    const cellRender = () => {
      if (this.hasFormChildren) {
        return (
          <this.formOptions.layout
            columns={this.item.columns || this.item.formItems.length}
            props={this.item}
          >
            {this.item.formItems.map((item) => {
              item.hiddenLabel = true;
              return <formItem item={item} props={item} />;
            })}
          </this.formOptions.layout>
        );
      }
      return (
        <tooltip
          hide={!this.item.contentTip}
          content={
            typeof this.item.contentTip === "string"
              ? this.item.contentTip
              : this.formCtx.form[this.item.prop]
          }
        >
          <Render
            value={this.formCtx.form[this.item.prop]}
            onInput={(e) => {
              this.$set(this.formCtx.form, this.item.prop, e);
              // 触发外部属性值改变
              this.$set(this.formCtx.value, this.item.prop, e);
            }}
            props={this.item}
            item={this.item}
            slots={this.formCtx.$scopedSlots}
            mode={this.formOptions.mode}
            scope={this.formCtx.getScope}
            config={this.formOptions}
            defaultRender={this.formOptions.defaultRender}
            controlDefault={(defaultRender, scope) => {
              if (
                this.item.formatter ||
                this.formCtx.isDetail ||
                this.item.detail
              ) {
                return (h, scope) => defaultRender.formatter(h, scope, true);
              }
              return defaultRender.input;
            }}
          ></Render>
        </tooltip>
      );
    };
    const labelRender = () => {
      const labelVNode = (
        <tooltip
          hide={!this.labelOverTip}
          content={
            typeof this.item.labelOverTip === "string"
              ? this.item.labelOverTip
              : this.item.label
          }
          overflow={true}
        >
          <simpleRender
            class="form-label"
            prop={`${this.item.prop}-label`}
            render={this.item.labelRender}
            item={this.item}
            slots={this.formCtx.slots}
            scope={this.formCtx.getScope}
            position={true}
          >
            {this.item.label}
          </simpleRender>
        </tooltip>
      );
      const hasTooltip =
        this.item.tooltip ||
        this.item.tooltipRender ||
        this.formCtx.slots[`${this.item.prop}-tooltip`];
      const tooltipVNode = (
        <el-tooltip effect="dark" placement="top">
          <simpleRender
            slot="content"
            prop={`${this.item.prop}-tooltip`}
            render={this.item.tooltipRender}
            item={this.item}
            slots={this.formCtx.slots}
            scope={this.formCtx.getScope}
          >
            {this.item.tooltip}
          </simpleRender>
          <i class="el-icon-question" />
        </el-tooltip>
      );
      return (
        <span>
          {labelVNode} {hasTooltip ? tooltipVNode : null}
        </span>
      );
    };
    return (
      <this.formCtx.layoutCell props={this.item}>
        <el-form-item
          class={this.className}
          style={{
            "--label-width": this.item.labelWidth,
          }}
          ref="formItem"
          label={this.item.label}
          label-width={this.item.labelWidth}
          size={this.formOptions.size}
          prop={this.item.prop}
          rules={this.rules}
          scopedSlots={{
            label: labelRender,
          }}
        >
          {cellRender()}
        </el-form-item>
      </this.formCtx.layoutCell>
    );
  },
});
</script>
