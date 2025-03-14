<script>
import { create } from "core";
import { omit } from "lodash-es";
import grid from "../grid/index.vue";
import cell from "pak/grid/cell.vue";
import formItem from "./formItem";
import position from "core/components/position";
import Render from "core/components/render";
import tooltip from "../tooltip/tooltip.vue";
import { generateRules } from "core";
export default create({
  name: "form-item",
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
    this.formCtx.$on("handleChild", (method, prop, params) => {
      if (!method) return;
      if (prop) {
        if (prop !== this.item.prop) return;
        if (!this[method])
          return console.error(`不存在方法${method},prop-${this.item.prop}`);
        this[method](params);
      } else {
        this[method](params);
      }
    });
  },
  methods: {
    resetField(isCondition) {
      const config = this.getComponentConfig();
      if (isCondition && (config?.disabled || this.disabled)) {
        return;
      }
      this.$refs.formItem?.resetField();
    },
    getComponentConfig(callBack) {
      const config = this.$refs.render?.getComponentConfig();
      callBack && callBack(config);
      return config;
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
            disabled: true,
          },
        };
      }
    },
    disabled() {
      return this.isDetail || this.item.disabled || this.elForm?.disabled;
    },
    isDetail() {
      if (this.col.isDetail === false) return false;
      return this.formCtx.isDetail || this.col.detail;
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
    generateRules() {
      return generateRules(this.item, this.formCtx.formScope);
    },
    rules() {
      return this.generateRules.rules;
    },
    rawRules() {
      return this.generateRules.rawRules;
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
      if (this.hasFormChildren) {
        names.push("has-form-children");
      }
      if (this.item.class) {
        names.push(this.item.class);
      }
      if (this.rules.required) names.push("is-required");
      if (this.isDetail) names.push("is-detail");
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
              : this.formCtx.value[this.item.prop]
          }
        >
          <Render
            ref="render"
            value={this.formCtx.value[this.item.prop]}
            onInput={(e) => {
              this.$set(this.formCtx.value, this.item.prop, e);
            }}
            props={this.item}
            item={this.item}
            slots={this.formCtx.slots}
            mode={this.formOptions.mode}
            scope={this.formCtx.formScope}
            config={this.formOptions}
            rawRules={this.rawRules}
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
          <position
            class="form-label"
            ellipsis={this.labelOverTip ? true : false}
            slotName={this.item.prop}
            slotSuffixes={this.mode ? [this.mode, "label"] : ["label"]}
            render={this.item.labelRender}
            slots={this.formCtx.slots}
            scope={this.formCtx.formScope}
          >
            {this.item.label}
          </position>
        </tooltip>
      );
      const hasTooltip =
        this.item.tooltip ||
        this.item.tooltipRender ||
        this.formCtx.slots[`${this.item.prop}-tooltip`];
      const tooltipVNode = (
        <el-tooltip effect="dark" placement="top">
          <position
            slot="content"
            slotName={this.item.prop}
            slotSuffixes={this.mode ? [this.mode, "tooltip"] : ["tooltip"]}
            render={this.item.tooltipRender}
            slots={this.formCtx.slots}
            scope={this.formCtx.formScope}
          >
            {this.item.tooltip}
          </position>
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
      <this.formCtx.layoutCell props={this.item} attrs={this.item}>
        <el-form-item
          class={this.className}
          style={{
            "--label-width": this.item.labelWidth,
          }}
          ref="formItem"
          label={this.item.label}
          label-width={this.item.labelWidth}
          size={this.formOptions.size}
          prop={this.item.validateProp || this.item.prop}
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
