<script>
import { create } from "core";
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
  mounted() {
    if (this.isDetail) {
      this.handleDetailMode();
    }
  },
  updated() {
    if (this.isDetail) {
      this.handleDetailMode();
    }
  },
  methods: {
    resetField() {
      this.$refs.formItem?.resetField();
    },
    getComponentConfig(callBack) {
      const config = this.$refs.render?.getComponentConfig();
      callBack && callBack(config);
      return config;
    },
    // 处理详情模式下的DOM操作
    handleDetailMode() {
      this.$nextTick(() => {
        if (!this.$el) return;
        // 移除所有tabIndex属性
        const elementsWithTabIndex = this.$el.querySelectorAll("[tabindex]");
        elementsWithTabIndex.forEach((el) => {
          el.removeAttribute("tabindex");
        });

        // 设置所有input为readonly
        const inputs = this.$el.querySelectorAll("input, textarea");
        inputs.forEach((input) => {
          input.setAttribute("readonly", "readonly");
          input.setAttribute("tabindex", "-1");
        });

        // 处理其他可聚焦元素
        const focusableElements = this.$el.querySelectorAll(
          "select, button, [contenteditable]"
        );
        focusableElements.forEach((el) => {
          el.setAttribute("tabindex", "-1");
        });
      });
    },
    // 显示错误提示
    handleMouseEnter(e) {
      const formItemComp = this.$refs.formItem;
      if (formItemComp && formItemComp.validateState === 'error') {
        const errorMsg = formItemComp.validateMessage;
        const formContent = e.target.querySelector('.el-form-item__content');
        this.formCtx.showErrorTooltip(formContent, errorMsg);
      }
    },
    handleMouseLeave() {
      this.formCtx.removeValidateTooltip();
    }
  },
  computed: {
    disabled() {
      return this.item.disabled || this.elForm?.disabled;
    },
    isDetail() {
      if (
        this.col.detail === false ||
        this.formCtx.formOptions.detail === false
      )
        return false;
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
      if (this.formOptions.colon) names.push("colon");
      if (this.formOptions.editTheme !== false && this.formCtx.isBorder) {
        names.push("edit-cell")
      }
      return names;
    },
    hasTooltip() {
      return (
        this.item.tooltip ||
        this.item.tooltipRender ||
        this.formCtx.slots[`${this.item.prop}-tooltip`]
      );
    },
    labelMaxWidth() {
      if (this.formOptions.labelPosition === "top") {
        return null;
      }
      const calcRequired = this.rules.required ? "11px" : "0px";
      const calcTip = this.hasTooltip ? "18px" : "0px";
      return `calc(100% - ${calcRequired} - ${calcTip})`;
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
            size={this.formOptions.size}
            rawRules={this.rawRules}
            isWatchFormatValue={true}
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
            data-prop={this.item.prop}
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
            style={{
              maxWidth: this.labelMaxWidth,
            }}
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
          nativeOn={this.formCtx.isBorder && this.rules.length && {
            mouseenter: this.handleMouseEnter,
            mouseleave: this.handleMouseLeave
          }}
        >
          {cellRender()}
        </el-form-item>
      </this.formCtx.layoutCell>
    );
  },
});
</script>
