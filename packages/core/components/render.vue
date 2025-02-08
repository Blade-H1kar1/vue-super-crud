<script>
import { isComponent, isVNode } from "utils";
import Comp from "./comp.vue";
import {
  cloneDeep,
  isFunction,
  isPlainObject,
  merge,
  get,
  de,
} from "lodash-es";
import { mergeTemp } from "utils/mergeTemp";
import { defaultRender as _defaultRender } from "core";
import DictMixin from "../dict/mixin";
import position from "./position.vue";
import { isEmptyData } from "utils";
import {
  getMockConfig,
  generateMockData,
  generateCustomMockData,
} from "../mock/index";
export default {
  name: "render",
  props: {
    value: {},
    prop: {
      type: String,
      default: "value",
    },
    comp: [Object, Function],
    render: Function,
    item: Object,
    raw: Object, // 未加工的item
    slots: Object,
    mode: [String, Boolean],
    scope: {},
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    controlDefault: Function, // 控制已有的默认渲染
    defaultRender: Function, // 自定义默认渲染
    position: Boolean, // 是否渲染位置
    compStrategy: Array, // 渲染策略
    commonCompStrategy: Object, // 公共组件策略
    defaultComp: Object, // 默认组件
    rawRules: Array, // 未加工的rules
  },
  inject: {
    $h: {
      default: undefined,
    },
    formCtx: { default: undefined },
    elForm: {
      default: "",
    },
  },
  mixins: [DictMixin],
  computed: {
    $value: {
      get() {
        const input = this.item.formatData?.input;
        if (input) return input(this.value, this.scope);
        return this.value;
      },
      set(value) {
        this._isSettingValue = true;
        this.setFormatValue(value);
      },
    },
  },
  created() {
    // if (this.item.formatData) {
    //   setTimeout(() => {
    //     this.$watch("value", (val) => {
    //       if (this._isSettingValue) return (this._isSettingValue = false);
    //       this._isSettingValue = true;
    //       this.setFormatValue(val);
    //     });
    //   }, 0);
    // }
    if (this.compStrategy) {
      this.matcher = this.createMatcher(this.compStrategy);
    }
    if (this.formCtx) {
      this.formCtx.$on("mockData", () => {
        if ((this.elForm || {}).disabled || !isEmptyData(this.$value)) return;
        if (this.item.mock) {
          const mockValue = generateCustomMockData(this.item.mock, this.scope);
          mockValue && this.setFormatValue(mockValue);
          return;
        }
        const mockValue = generateMockData(getMockConfig(this.$vnode), {
          pattern: this.getPattern(),
        });
        mockValue && this.setFormatValue(mockValue);
      });
    }
  },
  methods: {
    getPattern() {
      const rules = this.rawRules;
      if (rules) {
        const pattern = rules.find((rule) => rule.regular);
        if (pattern) return pattern.regular;
      }
    },
    setFormatValue(value) {
      const output = this.item.formatData?.output;
      if (output) {
        const outputValue = output(value, this.scope, (prop, val) => {
          this.$set(this.scope.row, prop, val);
        });
        const getFormatValue = this.item.formatData.getFormatValue;
        if (getFormatValue && typeof getFormatValue === "string") {
          this.scope.row[getFormatValue] = value;
        } else if (getFormatValue) {
          this.scope.row["$" + this.prop] = value;
        }
        if (outputValue !== undefined) this.$emit("input", outputValue);
      } else {
        this.$emit("input", value);
      }
    },
    interruptibleCompose(...funcs) {
      return funcs.reduce((f1, f2) => {
        return function (...args) {
          var result = f1.apply(this, args);
          return result ? result : f2.apply(this, args);
        };
      });
    },
    getSlot(h, scope) {
      const slots = this.slots;
      const prop = this.prop;
      const mode = this.mode;
      if (isFunction(slots)) slots = slots();
      if (slots) {
        let slotName;
        if (prop && mode) {
          slotName = `${prop}-${mode}`;
        } else if (prop && !mode) {
          slotName = prop;
        } else if (!prop && mode) {
          slotName = mode;
        }
        const slot = slots[slotName];
        if (slot) return slot(scope);
      }
    },
    getRender(h, scope) {
      const render = this.render;
      if (render) {
        const VNode = isFunction(render) ? this.render(h, scope) : render;
        if (VNode) {
          return isVNode(VNode) ? VNode : <span>{VNode}</span>;
        }
      }
    },
    // 合并一个函数和一个对象（或两个函数）
    mergeFunctionAndObject(t, s, scope) {
      if (!s) {
        if (isFunction(t)) return t(scope);
        return t;
      }
      if (isFunction(t) && isFunction(s))
        return Object.assign(s(scope), t(scope));
      if (isFunction(t) && isPlainObject(s)) return Object.assign(s, t(scope));
      if (isPlainObject(t) && isFunction(s)) return Object.assign(s(scope), t);
      return t;
    },
    createMatcher(strategies) {
      const exactMatches = new Map();
      const suffixMatches = new Map();
      const functionMatches = [];
      strategies.forEach(({ rule, comp }) => {
        if (typeof rule === "string") {
          if (rule.startsWith("*")) {
            suffixMatches.set(rule.slice(1).toLowerCase(), comp);
          } else {
            exactMatches.set(rule, comp);
          }
        } else if (typeof rule === "function") {
          functionMatches.push({ rule, comp });
        }
      });
      return (name, comp, scope) => {
        if (typeof name === "string") {
          // 精确匹配
          const exactMatch = exactMatches.get(name);
          if (exactMatch) return exactMatch;

          // 后缀匹配
          const nameLower = name.toLowerCase();
          for (const [suffix, comp] of suffixMatches) {
            if (nameLower.endsWith(suffix)) {
              return comp;
            }
          }
        }
        // 函数匹配
        if (isFunction(name)) {
          return functionMatches.find(({ rule }) => rule(name, comp, scope))
            ?.comp;
        }
      };
    },
    getComponent(h, scope) {
      if (this.comp || this.defaultComp) {
        let comp = this.comp || this.defaultComp;
        comp =
          typeof comp === "string" || isComponent(comp)
            ? { name: comp }
            : this.mergeFunctionAndObject(comp, this.raw?.comp, scope);
        if (this.compStrategy) {
          const strategy = this.matcher(
            isComponent(comp.name) ? comp.name.name : comp.name,
            comp,
            scope
          );
          if (strategy || this.commonCompStrategy) {
            comp = merge(comp, this.commonCompStrategy, strategy);
          }
        }
        return (
          <Comp
            v-model={this.$value}
            props={{ ...comp, comp }}
            prop={this.prop}
            size={this.config.size}
            config={this.config}
            scope={scope}
          />
        );
      }
    },
    getDefaultRender(h, scope) {
      if (this.$scopedSlots.default) {
        return this.$scopedSlots.default(scope);
      }
      if (isFunction(this.defaultRender)) {
        return this.defaultRender(h, scope);
      }
      if (this.controlDefault) {
        const renderFunc = this.controlDefault(_defaultRender, scope);
        const VNode = renderFunc && renderFunc(h, scope);
        if (VNode) return VNode;
      }
      return _defaultRender.formatter(h, scope);
    },
  },
  render(h) {
    const chains = this.interruptibleCompose(
      this.getSlot,
      this.getRender,
      this.getComponent,
      this.getDefaultRender
    );
    const VNode = chains(h, {
      ...this.scope,
      item: this.item,
      mode: this.mode,
      config: this.config,
      dict: this.dictData,
      self: this,
      $value: {
        get: this.$value,
        set: this.setFormatValue,
      },
    });

    if (this.position) {
      return (
        <position slotName={this.prop} slots={this.slots} scope={this.scope}>
          {VNode}
        </position>
      );
    }
    return VNode;
  },
};
</script>
