import create from "core/create";
import init from "core/init";
import { omit, pick, mergeWith, isFunction } from "lodash-es";
import { batchMerge } from "utils/mergeTemp";
import Render from "core/components/render";
import scButton from "pak/button";
import {
  checkVisibility,
  setPx,
  resolveRender,
  findComponentInstance,
} from "utils";

export const vnodes = {};
export default (options = {}) => {
  return create({
    name: "dialog",
    mixins: [init("dialogOptions", options)],
    data() {
      return {
        visible: false,
        loading: false,
        value: {},
      };
    },
    created() {
      this.$nextTick(() => {
        if (isFunction(options.created)) {
          options.created(this);
        }
      });
    },
    mounted() {
      this.$nextTick(() => {
        if (isFunction(options.mounted)) {
          options.mounted(this);
        }
      });
    },
    computed: {
      dialogOptions() {
        let opt = this.resultOptions;
        // init时已删除presetType
        if (options.presetType) {
          opt.presetType = options.presetType;
        }
        opt = batchMerge("render", [opt], this, {}, true)[0];
        return opt;
      },
      dialogType() {
        return this.dialogOptions.drawer ? "elDrawer" : "elDialog";
      },
      footerTemps() {
        return {
          confirm: {
            icon: "el-icon-circle-check",
            label: "确定",
            type: "primary",
            onClick: this.confirm,
          },
          cancel: {
            icon: "el-icon-circle-close",
            label: "取消",
            onClick: this.cancel,
          },
          close: {
            label: "关闭",
            type: "primary",
            onClick: this.hide,
          },
        };
      },
      footerButtons() {
        const footer = { ...this.dialogOptions.footer };
        return footer
          ? batchMerge("btn.dialog", footer, { ctx: this }, this.footerTemps)
          : [];
      },
      showFooter() {
        return checkVisibility(
          this.dialogOptions.footer,
          null,
          this.footerButtons.length > 0
        );
      },
      omitProps() {
        return omit(this.dialogOptions, [
          "size",
          "beforeClose",
          "title",
          "fullscreen",
        ]);
      },
    },
    methods: {
      async confirm(params) {
        const cb = (p) => {
          this.visible = false;
          this.confirmCb(this, p);
        };
        const validateComponent = findComponentInstance(
          this,
          ["sc-crud", "sc-form", "ElForm"],
          10,
          "down"
        );
        if (validateComponent && validateComponent.validate) {
          await validateComponent.validate();
        }
        if (typeof this.dialogOptions.confirm === "function") {
          this.dialogOptions.confirm(cb, this, params);
        } else {
          cb();
        }
        return this;
      },
      cancel(params) {
        const cb = (p) => {
          this.visible = false;
          this.cancelCb(this, p);
        };
        if (typeof this.dialogOptions.cancel === "function") {
          this.dialogOptions.cancel(cb, this, params);
        } else {
          cb();
        }
        return this;
      },
      closed() {
        if (!this.dialogOptions.cache) {
          this.destroy();
        }
        if (isFunction(this.dialogOptions.closed)) {
          this.dialogOptions.closed(this);
        }
      },
      destroy() {
        this.$destroy();
        this.$el.remove();
      },
      hide() {
        this.visible = false;
        return this;
      },
      show(confirmCb = () => {}, cancelCb = () => {}) {
        this.visible = true;
        this.confirmCb = confirmCb;
        this.cancelCb = cancelCb;
        return this;
      },
    },
    render(h) {
      const on = {
        ...this.dialogOptions,
        "update:visible": (value) => {
          this.visible = value;
        },
        closed: this.closed,
      };
      const title = () => {
        return (
          <div
            class={[this.b("title")]}
            style={{ height: this.dialogOptions.drawer ? "" : "50px" }}
          >
            <span>{this.dialogOptions.title}</span>
            {this.dialogOptions.drawer ? null : (
              <span>
                {this.dialogOptions.fullscreen && (
                  <i title="最大化" class="el-icon-full-screen"></i>
                )}
                {this.dialogOptions.drag && (
                  <i title="拖拽" class="el-icon-rank dialog-drag"></i>
                )}
              </span>
            )}
          </div>
        );
      };
      const content = (h) => {
        return (
          <Render
            v-loading={this.loading}
            prop="value"
            props={this.dialogOptions}
            item={this.dialogOptions}
            scope={{
              ref: this,
              row: this,
            }}
            controlDefault={() => {
              return null;
            }}
          ></Render>
        );
      };
      const footer = (h) => {
        if (this.showFooter === false) return;
        const render = this.dialogOptions.footer.render;
        const buttonRender = () => {
          return this.footerButtons.map((item) => (
            <scButton
              props={item}
              attrs={omit(item, ["onClick"])}
              loading={this.loading}
              size={this.dialogOptions.size}
              onClick={() => item.onClick(this)}
              scope={this}
            ></scButton>
          ));
        };
        return (
          <div
            class={this.b("footer", this.dialogOptions.footer.align || "right")}
          >
            {render
              ? resolveRender(render, h, this, buttonRender)
              : buttonRender()}
          </div>
        );
      };
      return (
        <this.dialogType
          v-scDialogDrag={this.dialogOptions.drag}
          v-scDialogDragHeight={this.dialogOptions.dragSize}
          v-scDialogFullscreen={this.dialogOptions.fullscreen}
          class={[this.b(), this.dialogOptions.class]}
          size={setPx(this.dialogOptions.width || "600px")}
          width={setPx(this.dialogOptions.width || "600px")}
          visible={this.visible}
          beforeClose={this.cancel}
          close-on-click-modal={false}
          props={this.omitProps}
          on={on}
          scopedSlots={{
            title,
          }}
        >
          <div class={[this.b("body"), this.showFooter ? "has-footer" : ""]}>
            {content(h)}
          </div>
          {footer(h)}
        </this.dialogType>
      );
    },
  });
};
