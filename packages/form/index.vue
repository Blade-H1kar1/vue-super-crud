<template>
  <div
    :class="[b(), { 'sc--detail__border': isDetail && isBorder }]"
    :style="{ padding: formOptions.gap }"
  >
    <simpleRender
      prop="title"
      :render="formOptions.titleRender"
      :slots="$scopedSlots"
      :position="true"
      ><div v-if="formOptions.title" class="sc-title">
        {{ formOptions.title }}
      </div></simpleRender
    >
    <el-form
      v-loading="isLoading"
      :disabled="isDisabled"
      ref="formRef"
      :model="form"
      v-bind="formOptions"
      :key="key"
    >
      <template v-if="isGroup">
        <group v-for="(item, index) in columns" v-bind="item" :key="index">
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
            ></formItem
          ></component>
          <simpleRender
            v-else
            :prop="item.prop"
            :render="item.render"
            :col="item"
            :slots="slots"
            :scope="getScope"
          />
        </group>
        <formAction />
      </template>
      <component
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
        ></formItem
        ><formAction
      /></component>
    </el-form>
  </div>
</template>

<script>
// TODO 详情模式：增加 detail 配置详情单独渲染的组件
// TODO 提交清除hidden 字段
import { create, rules, init, event } from "core";
import formItem from "./formItem.vue";
import config from "src/config/form";
import grid from "../grid/index.vue";
import cell from "pak/grid/cell.vue";
import group from "../group/index.vue";
import formAction from "./formAction.vue";
import {
  isFunction,
  isPlainObject,
  uniqueId,
  set,
  get,
  cloneDeep,
  merge,
  omit,
} from "lodash-es";
import { mergeTemp } from "utils/mergeTemp";
import { isEmptyData } from "utils";
import simpleRender from "core/components/simpleRender";
export default create({
  name: "form",
  components: { grid, cell, group, formItem, formAction, simpleRender },
  props: {
    value: {
      type: Object,
      required: true,
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
    disabled: {
      type: Boolean,
    },
  },
  provide() {
    return {
      formCtx: this,
    };
  },
  mixins: [init("formOptions", config), rules, event],
  data() {
    return {
      key: 1,
      form: {},
      formatValue: {},
      loadingStatus: false,
      formCreate: false,
      formBind: {},
    };
  },
  created() {
    this.initFormValue();
  },
  mounted() {
    this.extendMethod(this.$refs.formRef);
    this.clearValidate();
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
      return this.isDetail || this.loadingStatus || this.disabled;
    },
    isLoading() {
      if (this.isDetail) return this.loadingStatus;
      return false;
    },
    columns() {
      return this.groupBy(this.resultColumns);
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
    // dataFormatMap() {
    //   const map = {};
    //   this.trueRenderColumns.forEach((i) => {
    //     map[i.prop] = mergeDataFormat(i.format, i);
    //   });
    //   return map;
    // },
    getScope() {
      if (this.scope) {
        return {
          ...this.scope,
          row: this.form,
        };
      } else {
        return {
          row: this.form,
        };
      }
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
      return this.getFirstRowLastCellIndex(this.columns);
    },
  },
  watch: {
    value: {
      handler(val) {
        if (this.formChange) return;
        if (this.formCreate) {
          this.setForm();
        }
      },
      deep: true,
    },
    form: {
      handler(val) {
        this.formChange = true;
        if (this.formCreate) {
          this.setVal();
        }
        this.$nextTick(() => {
          this.formChange = false;
        });
      },
      deep: true,
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
    initFormValue() {
      let form = { ...this.value };
      this.trueRenderColumns.forEach((col) => {
        if (form[col.prop] === undefined) {
          if (col.initValue) {
            form[col.prop] = col.initValue;
          } else {
            form[col.prop] = "";
          }
        }
      });
      this.$set(this, "form", form);
      this.setControl();
      // 将value未定义的属性变为响应式
      this.setVal();
      this.$nextTick(() => {
        this.formCreate = true;
        this.setForm();
        this.clearValidate();
      });
      // setTimeout(() => {
      //   this.formCreate = true;
      //   this.setForm();
      // });
    },
    setForm() {
      Object.keys(this.value).forEach((ele) => {
        this.$set(this.form, ele, this.value[ele]);
      });
    },
    setVal() {
      this.$emit("input", this.form);
      this.$emit("change", this.form);
    },
    setControl() {
      this.trueRenderColumns.forEach((column) => {
        let prop = column.prop;
        let bind = column.deepProp;
        if (!this.formBind[prop]) {
          let bindList = [];
          if (bind) {
            // 实际与表单绑定的值还是浅层的值，通过watch，浅层的值改变会修改深层，深层改变也会修改浅层
            let formProp = this.$watch("form." + prop, (n, o) => {
              if (n != o) set(this.form, bind, n);
            });
            let formDeep = this.$watch("form." + bind, (n, o) => {
              if (n != o) this.$set(this.form, prop, n);
            });
            bindList.push(formProp);
            bindList.push(formDeep);
            this.$set(this.form, prop, get(this.form, bind));
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
            callBack && callBack({ form: this.form });
            resolve({ form: this.form });
          }
        });
      });
    },
    resetField(prop) {
      // 通知子组件执行重置
      this.$emit("handleChild", "resetField", prop);
    },
    async submit() {
      await this.validate();
      this.loadingStatus = true;
      this.runBefore(
        "submit",
        () => {
          this.loadingStatus = false;
        },
        this.form
      );
    },
    reset() {
      this.$refs.formRef && this.$refs.formRef.resetFields();
    },
    clearValidate() {
      this.$refs.formRef && this.$refs.formRef.clearValidate();
    },
    refreshForm() {
      this.key = Math.random();
    },
    getFirstRowLastCellIndex(columns) {
      const columnsNumber = this.formOptions.columns;
      let widthSize = 0;
      const lastIndex = columns.findIndex((item, idx) => {
        widthSize += item.widthSize || 1;
        return widthSize === columnsNumber;
      });
      return lastIndex === -1 ? columns.length - 1 : lastIndex;
    },
  },
});
</script>
