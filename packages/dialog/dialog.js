import create from "core/create";
import init from "core/init";
import { omit, pick, mergeWith, isFunction } from "lodash-es";
import { batchMerge } from "utils/mergeTemp";
import config from "src/config/dialog";
import Render from "core/components/render";

export const vnodes = {};
export default (options = {}) => {
  return create({
    name: "dialog",
    mixins: [
      init("dialog", config, options),
      omit(options, [
        "created",
        "mounted",
        "render",
        "confirm",
        "cancel",
        "closed",
        "destroy",
        "hide",
        "show",
      ]),
    ],
    data() {
      return {
        fullscreen: false,
        visible: false,
        loading: false,
        value: {},
        vnode: null,
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
        opt = batchMerge("render", [opt], this);
        opt = opt[0];
        if (this.vnode) {
          // 删除 自定义指令防止重复执行
          delete this.vnode.data;
          opt.render = () => this.vnode;
        }
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
        };
      },
      footerButtons() {
        const footer = { ...this.dialogOptions.footer };
        let buttons = [];
        const merges = batchMerge(
          "btn.dialog",
          footer,
          { ctx: this },
          this.footerTemps
        );
        buttons.push(...merges);
        return buttons;
      },
      showFooter() {
        if (this.dialogOptions.footer === false) return false;
        if (this.dialogOptions.footer.hidden) return false;
        if (this.dialogOptions.footer.show === false) return false;
        return this.footerButtons.length > 0;
      },
      omitProps() {
        return omit(this.dialogOptions, ["size", "beforeClose", "title"]);
      },
    },
    methods: {
      confirm(params) {
        const cb = () => {
          this.visible = false;
          this.confirmCb(params);
        };
        if (typeof this.dialogOptions.confirm === "function") {
          this.dialogOptions.confirm(cb, params);
        } else {
          cb();
        }
        return this;
      },
      cancel() {
        const cb = () => {
          this.visible = false;
          this.cancelCb();
        };
        if (typeof this.dialogOptions.cancel === "function") {
          this.dialogOptions.cancel(cb);
        } else {
          cb();
        }
        return this;
      },
      closed() {
        if (!this.dialogOptions.cache) {
          this.destroy();
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
                <i
                  title="最大化"
                  onClick={() => (this.fullscreen = !this.fullscreen)}
                  class={[
                    this.fullscreen ? "el-icon-news" : "el-icon-full-screen",
                  ]}
                ></i>
                {this.dialogOptions.drag ? (
                  <i title="拖拽" class="el-icon-rank dialog-drag"></i>
                ) : null}
              </span>
            )}
          </div>
        );
      };
      const content = (h) => {
        return (
          <Render
            v-model={this.value}
            v-loading={this.loading}
            props={this.dialogOptions}
            item={this.dialogOptions}
            config={this.dialogOptions}
            scope={{
              ref: this,
            }}
            controlDefault={() => {
              return null;
            }}
          ></Render>
        );
      };
      const footer = (h) => {
        if (this.showFooter === false) return;
        return (
          <div
            class={[
              this.b("footer"),
              this.b("footer", this.dialogOptions.footer.align || "right"),
            ]}
          >
            {this.footerButtons.map((item) => (
              <el-button
                loading={this.loading}
                size={this.dialogOptions.size}
                type={item.type}
                icon={item.icon}
                onClick={() => item.onClick(this)}
              >
                {item.label}
              </el-button>
            ))}
          </div>
        );
      };
      return (
        <this.dialogType
          v-scDialogDrag={this.dialogOptions.drag}
          v-scDialogDragHeight={this.dialogOptions.dragSize}
          class={[this.b(), this.dialogOptions.class]}
          size={this.dialogOptions.width || "600px"}
          width={this.dialogOptions.width || "600px"}
          fullscreen={this.fullscreen}
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
