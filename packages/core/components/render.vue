<script>
import { isComponent, isVNode } from "utils";
import { compRender } from "./comp";
import {
  cloneDeep,
  isFunction,
  isPlainObject,
  merge,
  get,
  set,
} from "lodash-es";
import { mergeTemp } from "utils/mergeTemp";
import { defaultRender as _defaultRender } from "core";
import DictMixin from "../dict/mixin";
import position from "./position.vue";
import { isEmptyData, resolveRender } from "utils";
import {
  getComponentConfig,
  generateMockData,
  generateCustomMockData,
} from "../mock/index";
export default {
  name: "render",
  props: {
    value: {},
    prop: {
      type: String,
      default: "",
    },
    comp: [Object, Function],
    render: Function,
    item: Object,
    raw: Object, // 未加工的item
    slots: Object,
    mode: [String, Boolean],
    scope: {},
    size: String,
    controlDefault: Function, // 控制已有的默认渲染
    defaultRender: Function, // 自定义默认渲染
    position: Boolean, // 是否渲染位置
    compStrategy: Array, // 渲染策略
    commonCompStrategy: Object, // 公共组件策略
    defaultComp: Object, // 默认组件
    rawRules: Array, // 未加工的rules
    strategies: Object, // 策略
    isWatchFormatValue: Boolean, // 是否监听值变化精确变化格式化值
  },
  inject: {
    controlCtx: { default: undefined },
    elForm: {
      default: "",
    },
  },
  mixins: [DictMixin],
  computed: {
    $value: {
      get() {
        try {
          const input = this.item.formatData?.input;
          if (input) return input(this.getRow(), this.scope);
          return this.getRow();
        } catch (error) {
          console.error("获取格式化值失败:", error);
          return this.getRow();
        }
      },
      set(value) {
        try {
          this.setFormatValue(value);
        } catch (error) {
          console.error("设置格式化值失败:", error);
          this.setRow(this.prop, value);
        }
      },
    },
  },
  created() {
    if (this.compStrategy) {
      this.matcher = this.createMatcher(this.compStrategy);
    }
    if (this.controlCtx) {
      this.setupMockDataListener();
      this.initFormatValue();
    }
    if (this.item.formatData && this.isWatchFormatValue) {
      setTimeout(() => {
        this.isSettingValue = false;
        this.$watch("value", (val) => {
          // 防止重复触发
          if (this.isSettingValue) return;
          this.setFormatValue(this.$value);
        });
        this.setFormatValue(this.$value);
      }, 0);
    }
  },
  mounted() {
    if (this.item.ref && typeof this.item.ref === "function") {
      this.item.ref(this.$vnode.componentInstance);
    }
  },
  destroyed() {
    if (this.controlCtx && this.mockDataListener) {
      this.controlCtx.$off("mockData", this.mockDataListener);
      this.mockDataListener = null;
    }
  },
  methods: {
    initFormatValue() {
      if (this.item.formatData) {
        this.controlCtx.$on("dataChange", () => {
          if (this.isSettingValue) return;
          this.setFormatValue(this.$value);
        });
      }
    },
    setupMockDataListener() {
      this.mockDataListener = () => {
        if (
          (this.elForm || {}).disabled ||
          (!isEmptyData(this.$value) && this.$value !== 0)
        )
          return;
        const config = this.getComponentConfig();
        if (config && config.disabled) return;
        if (this.item.mock) {
          const mockValue = generateCustomMockData(this.item.mock, this.scope);
          mockValue && this.setFormatValue(mockValue);
          return;
        }

        const mockValue = generateMockData(config, {
          pattern: this.getPattern(),
        });
        !isEmptyData(mockValue) && this.setFormatValue(mockValue);
      };

      this.controlCtx.$on("mockData", this.mockDataListener);
    },
    getComponentConfig() {
      return getComponentConfig(this.$vnode);
    },
    getPattern() {
      const rules = this.rawRules;
      if (rules) {
        const pattern = rules.find((rule) => rule.regular);
        if (pattern) return pattern.regular;
      }
    },
    getRow() {
      if (!this.prop) return this.scope.row;
      return get(this.scope.row, this.prop);
    },
    // 设置行数据
    setRow(prop, val) {
      if (!prop) return;
      // 处理数组路径 ['a', 'b'] 或字符串路径 'a.b'
      const path = Array.isArray(prop) ? prop : prop.split(".");
      if (path.length > 1) {
        if (!get(this.scope.row, path)) {
          // 绑定深层响应式对象
          path.slice(0, -1).reduce((obj, key, index) => {
            // 如果当前key值不存在，创建一个新响应式对象
            if (!obj[key] || typeof obj[key] !== "object") {
              this.$set(obj, key, {});
            }
            return obj[key];
          }, this.scope.row);

          // 获取最后一层的父对象
          const parentObj = path
            .slice(0, -1)
            .reduce((obj, key) => obj[key], this.scope.row);

          this.$set(parentObj, path[path.length - 1], val);
        } else {
          set(this.scope.row, path, val);
          this.$set(this.scope.row, path[0], this.scope.row[path[0]]);
        }
      } else {
        // 触发响应式更新
        this.$set(this.scope.row, prop, val);
      }
    },
    setFormatValue(value) {
      const output = this.item.formatData?.output;
      if (output) {
        this.isSettingValue = true; // 设置标志
        const outputValue = output(value, this.scope, this.setRow);
        const formatValueProp = get(this.item, ["formatData", "formatValue"]);
        if (formatValueProp && typeof formatValueProp === "string") {
          this.setRow(formatValueProp, value);
        } else if (formatValueProp) {
          this.setRow("$" + this.prop, value);
        }
        if (outputValue !== undefined) {
          this.setRow(this.prop, outputValue);
        }
        this.$nextTick(() => {
          this.isSettingValue = false; // 重置标志
        });
      } else {
        this.setRow(this.prop, value);
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
      return resolveRender(this.render, h, scope);
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
        return compRender(
          h,
          { ...comp, comp, prop: this.prop, size: this.size, scope },
          this
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
    applyComponentSpecificModifications(vnode, scope) {
      if (!vnode) return vnode;

      // 从虚拟DOM中获取组件名称
      let compName;
      if (vnode.componentOptions && vnode.componentOptions.Ctor) {
        compName =
          vnode.componentOptions.Ctor.options.name ||
          (vnode.componentOptions.tag || "").toLowerCase();
      }

      // 如果无法获取组件名称，则返回原始vnode
      if (!compName) return vnode;

      // 如果提供了组件特定的修改配置
      if (this.strategies) {
        const modifier = this.strategies[compName];

        // 如果没有精确匹配，尝试后缀匹配
        let matchedModifier = modifier;
        if (!matchedModifier) {
          const compNameLower = compName.toLowerCase();
          // 查找所有以*开头的键，表示后缀匹配
          for (const key in this.strategies) {
            if (
              key.startsWith("*") &&
              compNameLower.endsWith(key.slice(1).toLowerCase())
            ) {
              matchedModifier = this.strategies[key];
              break;
            }
          }
        }

        if (typeof matchedModifier === "function") {
          // 允许通过函数完全控制VNode的修改
          return matchedModifier(vnode, scope, this);
        } else if (matchedModifier && typeof matchedModifier === "object") {
          // 应用预定义的修改
          if (matchedModifier.props && vnode.componentOptions) {
            vnode.componentOptions.propsData = {
              ...vnode.componentOptions.propsData,
              ...(typeof matchedModifier.props === "function"
                ? matchedModifier.props(scope)
                : matchedModifier.props),
            };
          }

          // 添加或修改事件
          if (matchedModifier.on && vnode.componentOptions) {
            vnode.componentOptions.listeners =
              vnode.componentOptions.listeners || {};
            Object.entries(matchedModifier.on).forEach(([event, handler]) => {
              const originalHandler = vnode.componentOptions.listeners[event];
              vnode.componentOptions.listeners[event] = originalHandler
                ? (...args) => {
                    originalHandler(...args);
                    handler(...args, scope, this);
                  }
                : (...args) => handler(...args, scope, this);
            });
          }

          // 添加或修改样式
          if (matchedModifier.style && vnode.data) {
            vnode.data.style = {
              ...(vnode.data.style || {}),
              ...(typeof matchedModifier.style === "function"
                ? matchedModifier.style(scope)
                : matchedModifier.style),
            };
          }

          // 添加或修改类名
          if (matchedModifier.class && vnode.data) {
            const newClass =
              typeof matchedModifier.class === "function"
                ? matchedModifier.class(scope)
                : matchedModifier.class;

            if (Array.isArray(vnode.data.class)) {
              vnode.data.class = [
                ...vnode.data.class,
                ...(Array.isArray(newClass) ? newClass : [newClass]),
              ];
            } else if (typeof vnode.data.class === "object") {
              vnode.data.class = { ...vnode.data.class, ...newClass };
            } else {
              vnode.data.class = newClass;
            }
          }

          // 添加或修改属性
          if (matchedModifier.attrs && vnode.data) {
            vnode.data.attrs = {
              ...(vnode.data.attrs || {}),
              ...(typeof matchedModifier.attrs === "function"
                ? matchedModifier.attrs(scope)
                : matchedModifier.attrs),
            };
          }
        }
      }

      return vnode;
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
      dict: this.dictData,
      self: this,
      $value: {
        get: this.$value,
        set: this.setFormatValue,
      },
    });

    if (this.position) {
      return (
        <position
          slotName={this.prop}
          slots={this.slots}
          scope={this.scope}
          style={{
            width: "100%",
          }}
        >
          {VNode}
        </position>
      );
    }
    return VNode;
  },
};
</script>
