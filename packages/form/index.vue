<template>
  <div
    :class="[
      b(),
      { 'sc-form--border': isDetail && isBorder, 'sc-form--group': isGroup },
    ]"
    :style="{ padding: formOptions.gap }"
    @contextmenu="handleContextMenu"
  >
    <div style="min-height: 0; position: relative;">
      <position
        slotName="title"
        :render="formOptions.titleRender"
        :slots="$scopedSlots"
        ><div v-if="formOptions.title" class="sc-title">
          {{ formOptions.title }}
        </div></position
      >
      <el-form
        v-loading="isLoading"
        :disabled="isDisabled"
        ref="formRef"
        :model="value"
        v-bind="formProps"
        :key="key"
        @submit.native.prevent
      >
        <template v-if="isGroup">
          <group
            v-for="(item, index) in columns"
            v-bind="item"
            :key="index"
            :border="!isBorder"
          >
            <component
              v-if="item.children"
              :is="formOptions.layout"
              v-bind="item"
              :style="{ padding: `0 ${item.gap}px` }"
            >
              <formItem
                v-for="(i, idx) in item.children"
                :key="idx"
                :col="i"
                v-bind="i"
                :is-first-row="idx <= firstRowLastCellIndex[index]"
                :ref="i.prop"
              ></formItem
            ></component>
            <position
              v-else
              :slotName="item.prop"
              :render="item.render"
              :slots="slots"
              :scope="formScope"
            />
          </group>
          <formAction />
        </template>
        <component
          ref="gridRef"
          v-else
          :is="formOptions.layout"
          v-bind="formOptions"
          :style="{ padding: `0 ${formOptions.gap}px` }"
        >
          <formItem
            v-for="(item, index) in columns"
            :key="index"
            :col="item"
            v-bind="item"
            :is-first-row="index <= firstRowLastCellIndex"
            :ref="item.prop"
          ></formItem>
          <cell
            v-for="n in emptyCount"
            :key="'empty' + n"
            style="visibility: hidden;"
          />
          <formAction />
        </component>
      </el-form>
    </div>
    <draftDrawer ref="draftDrawer" />
  </div>
</template>

<script>
// TODO 详情模式：增加 detail 配置详情单独渲染的组件
// TODO 提交清除hidden 字段
import { create, init, event, getSet } from "core";
import formItem from "./formItem.vue";
import grid from "../grid/index.vue";
import cell from "pak/grid/cell.vue";
import group from "../group/index.vue";
import formAction from "./formAction.vue";
import draftDrawer from "./draftDrawer.vue";
import contextMenu from "./contextMenu";
import {
  isFunction,
  isPlainObject,
  uniqueId,
  set,
  get,
  cloneDeep,
  merge,
  omit,
  pick,
} from "lodash-es";
import { mergeTemp } from "utils/mergeTemp";
import { isEmptyData, toCamelCase, filterColumns } from "utils";
import position from "core/components/position";
import formProps from "./props";

// 表单初始化队列
const formInitQueue = {
  promise: Promise.resolve(),
  isProcessing: false, // 添加标记表示队列是否正在处理
  add(callback) {
    this.isProcessing = true;
    const currentPromise = this.promise.then(async () => {
      try {
        await callback();
      } catch (error) {
        console.error("Form init error:", error);
      } finally {
        // 检查是否还有待处理的 promise
        if (this.promise === currentPromise) {
          this.isProcessing = false;
        }
      }
    });
    this.promise = currentPromise;
    return currentPromise;
  },
};
export default create({
  name: "form",
  components: {
    grid,
    cell,
    group,
    formItem,
    formAction,
    position,
    draftDrawer,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    scope: {
      type: Object,
      default: () => {
        return {};
      },
    },
    loading: {
      type: Boolean,
    },
    actionInLastCell: Boolean,
  },
  provide() {
    return {
      formCtx: this,
      controlCtx: this,
    };
  },
  mixins: [init("formOptions"), event, contextMenu, getSet],
  data() {
    return {
      key: 1,
      loadingStatus: false,
      formBind: {},
      isInitializing: false, // 添加初始化状态标记
      emptyCount: 0,
    };
  },
  created() {
    this.initFormValue();
  },
  mounted() {
    this.extendMethod(this.$refs.formRef);
    if (this.actionInLastCell) {
      this.emptyCount = this.calcEmptyCount();
      this.resizeObserver = new ResizeObserver(() => {
        this.emptyCount = this.calcEmptyCount();
      });
      this.resizeObserver.observe(this.$el);
    }
  },
  updated() {
    if (this.actionInLastCell) {
      this.$nextTick(() => {
        this.emptyCount = this.calcEmptyCount();
      });
    }
  },
  beforeDestroy() {
    this.resizeObserver && this.resizeObserver.disconnect();
  },
  computed: {
    formOptions() {
      return this.resultOptions;
    },
    isGroup() {
      return this.formOptions.group || this.formOptions.group === "";
    },
    isDetail() {
      return this.formOptions.detail || this.formOptions.detail === "";
    },
    isBorder() {
      return this.formOptions.border || this.formOptions.border === "";
    },
    isDisabled() {
      return this.isDetail || this.loadingStatus || this.formOptions.disabled;
    },
    isLoading() {
      if (this.isDetail) return this.loadingStatus;
      return false;
    },
    columns() {
      return this.groupBy(filterColumns(this.resultColumns, this.formScope));
    },
    trueRenderColumns() {
      let columns = [];
      this.columns.forEach((item) => {
        if (item.children) {
          columns.push(...item.children);
        } else {
          columns.push(item);
        }
      });
      return columns;
    },
    columnsMap() {
      const map = {};
      this.trueRenderColumns.forEach((i) => {
        map[i.prop] = i;
      });
      return map;
    },
    formScope() {
      const baseScope = {
        row: this.value,
        form: this.$refs.formRef,
      };

      if (!this.scope) return baseScope;

      return {
        ...this.scope,
        ...baseScope,
      };
    },
    slots() {
      return this.formOptions.slots || this.$scopedSlots;
    },
    layoutCell() {
      if (this.formOptions.layout === "grid") {
        return "cell";
      }
      if (this.formOptions.layout === "el-row") {
        return "el-col";
      }
    },
    firstRowLastCellIndex() {
      if (this.isGroup) {
        const map = this.columns.reduce((acc, cur, index) => {
          acc[index] = this.getFirstRowLastCellIndex(cur.children, cur.columns);
          return acc;
        }, {});
        return map || {};
      }
      return this.getFirstRowLastCellIndex(
        this.columns,
        this.formOptions.columns
      );
    },
    formProps() {
      const obj = {};
      Object.keys(this.formOptions).forEach((key) => {
        obj[toCamelCase(key)] = this.formOptions[key];
      });
      const props = pick(obj, formProps);
      return props;
    },
  },
  watch: {
    value() {
      // value重新赋值时需要再初始化
      if (!this.isInitializing && !formInitQueue.isProcessing) {
        this.initFormValue();
      }
    },
    loading: {
      handler(val) {
        val !== undefined && (this.loadingStatus = val);
      },
      immediate: true,
    },
    loadingStatus(val) {
      this.$emit("update:loading", val);
    },
  },
  methods: {
    initColumn(item, index) {
      if (item.detail) {
        item.detail = this.extendsOption(
          item,
          item.detail,
          omit(item, ["detail"])
        );
      }
    },
    extendsOption(item, current, extendsObj) {
      if (current === false) return;
      // current 可能为 undefined || true 转换为 {}
      current = isPlainObject(current) ? current : {};
      current = mergeTemp("render", current.presetType, current);
      extendsObj = cloneDeep(extendsObj);
      if (current.hidden !== true) {
        return merge(
          {
            label: item.label,
            prop: item.prop,
            ...extendsObj,
          },
          current
        );
      }
    },
    //初始化表单
    async initFormValue() {
      if (this.isInitializing) return;

      // 将初始化操作添加到队列
      await formInitQueue.add(async () => {
        this.isInitializing = true;

        try {
          // 确保获取最新的 value
          await this.$nextTick();
          let form = { ...this.value };

          this.trueRenderColumns.forEach((col) => {
            if (this.getByProp(form, col.prop) === undefined) {
              if (col.initValue) {
                this.setByProp(form, col.prop, col.initValue);
              } else {
                this.setByProp(form, col.prop, "");
              }
            }
          });

          this.setControl();

          // 发出更新事件
          this.$emit("input", form);

          // 等待更新完成
          await this.$nextTick();
          this.clearValidate();
        } finally {
          this.isInitializing = false;
        }
      });
    },
    setControl() {
      this.trueRenderColumns.forEach((column) => {
        let prop = column.prop;
        let bind = column.deepProp;
        if (!this.formBind[prop]) {
          let bindList = [];
          if (bind) {
            // 实际与表单绑定的值还是浅层的值，通过watch，浅层的值改变会修改深层，深层改变也会修改浅层
            let formProp = this.$watch("value." + prop, (n, o) => {
              if (n != o) set(this.value, bind, n);
            });
            let formDeep = this.$watch("value." + bind, (n, o) => {
              if (n != o) this.$set(this.value, prop, n);
            });
            bindList.push(formProp);
            bindList.push(formDeep);
            this.$set(this.value, prop, get(this.value, bind));
          }
          this.formBind[prop] = bindList;
        }
      });
    },
    groupBy(column) {
      let group = this.formOptions.group;

      if (group && Array.isArray(group)) {
        return group.map((item) => {
          return {
            label: item.label,
            children: item.children.map((i) => {
              return column.find((c) => c.prop === i);
            }),
          };
        });
      }
      return column;
    },
    validate(callBack) {
      return new Promise((resolve, reject) => {
        this.$refs.formRef.validate((valid, obj) => {
          if (!valid) {
            reject(obj);
            callBack && callBack(false);
            if (this.formOptions.scrollError) {
              const key = Object.keys(obj)[0];
              const itemRef =
                this.$refs[key] && this.$refs[key][0].$refs.formItem;
              if (Object.keys(obj).length && itemRef) {
                itemRef.$el.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }
          } else {
            callBack && callBack(true);
            resolve();
          }
        });
      });
    },
    async submit() {
      await this.validate();
      this.loadingStatus = true;
      this.runBefore(
        "submit",
        () => {
          this.loadingStatus = false;
        },
        this.value
      );
    },
    resetField(prop) {
      // 通知子组件执行重置
      this.$emit("handleChild", "resetField", prop);
    },
    reset() {
      this.$refs.formRef && this.$refs.formRef.resetFields();
      this.$emit("reset");
    },
    clearValidate(prop) {
      this.$refs.formRef && this.$refs.formRef.clearValidate(prop);
    },
    validateField(prop) {
      this.$refs.formRef && this.$refs.formRef.validateField(prop);
    },
    refreshForm() {
      const tempValue = cloneDeep(this.value);
      this.$emit("input", {});
      this.key = Math.random();
      setTimeout(() => {
        this.$emit("input", tempValue);
      }, 100);
    },
    getFirstRowLastCellIndex(columns = [], columnsNumber = 1) {
      let widthSize = 0;
      const lastIndex = columns.findIndex((item, idx) => {
        widthSize += item.widthSize || 1;
        return widthSize === columnsNumber;
      });
      return lastIndex === -1 ? columns.length - 1 : lastIndex;
    },
    calcEmptyCount() {
      const getGridColumnCount = () => {
        const grid = this.$refs.gridRef.$el;
        if (!grid) return 1;
        const style = window.getComputedStyle(grid);
        const columns = style.gridTemplateColumns;
        return columns.split(" ").length;
      };
      const total = this.trueRenderColumns.length;
      const col = getGridColumnCount();
      const remain = total % col;
      if (remain === col - 1 || col === 1) return 0;
      return remain === 0 ? col - 1 : col - remain - 1;
    },
  },
});
</script>
