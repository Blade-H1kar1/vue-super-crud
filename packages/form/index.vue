<template>
  <div
    :class="[
      b(),
      { 'sc-form--border': isDetail && isBorder, 'sc-form--group': isGroup },
    ]"
    :style="{ padding: formOptions.gap }"
    @contextmenu="handleContextMenu"
  >
    <div style="min-height: 0; position: relative">
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
          <formAction />
        </component>
      </el-form>
    </div>
    <draftDrawer ref="draftDrawer" />
    <batchMockData
      ref="batchMockData"
      :visible.sync="mockDialogVisible"
      :columns="trueRenderColumns"
      instance-type="form"
      :instance-ref="$refs.formRef"
      :formInitialValue="value"
      @generate="handleGenerateFormData"
    />
  </div>
</template>

<script>
import { create, init, event, getSet } from "core";
import formItem from "./formItem.vue";
import grid from "../grid/index.vue";
import cell from "pak/grid/cell.vue";
import group from "../group/index.vue";
import formAction from "./formAction.vue";
import draftDrawer from "./draftDrawer.vue";
import contextMenu from "./contextMenu";
import position from "core/components/position";
import batchMockData from "core/components/batchMockData.vue";

// 导入功能mixins
import formInit from "./mixins/init";
import formValidation from "./mixins/validate";
import formReset from "./mixins/reset";
import formLayout from "./mixins/layout";

import { getFormProps, getFirstRowLastCellIndex } from "./utils/formHelpers";
import { filterColumns } from "utils";

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
    batchMockData,
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    scope: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
    },
  },
  provide() {
    return {
      formCtx: this,
      controlCtx: this,
    };
  },
  mixins: [
    init("formOptions"),
    event,
    contextMenu,
    getSet,
    formInit,
    formValidation,
    formReset,
    formLayout,
  ],
  data() {
    return {
      key: 1,
      loadingStatus: false,
      mockDialogVisible: false,
    };
  },
  created() {
    this.initFormValue();
  },
  mounted() {
    this.extendMethod(this.$refs.formRef);
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
      return this.loadingStatus || this.formOptions.disabled;
    },
    isLoading() {
      if (this.isDetail) return this.loadingStatus;
      return false;
    },
    columns() {
      return this.groupBy(filterColumns(this.resultColumns, this.formScope));
    },
    // 过滤后的渲染列
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
    // 过滤前的渲染列
    trueRenderColumnsBeforeFilter() {
      let columns = [];
      this.groupBy(this.resultColumns).forEach((item) => {
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
          acc[index] = getFirstRowLastCellIndex(cur.children, cur.columns);
          return acc;
        }, {});
        return map || {};
      }
      return getFirstRowLastCellIndex(this.columns, this.formOptions.columns);
    },
    formProps() {
      return getFormProps(this.formOptions);
    },
  },
  watch: {
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
    // 打开模拟数据生成器
    openMockDialog() {
      this.mockDialogVisible = true;
    },
    // 处理生成的数据
    handleGenerateFormData(data) {
      // 直接更新表单数据
      for (const key in data) {
        this.$set(this.value, key, data[key]);
      }
      this.$message.success("已生成测试数据");
    },
  },
});
</script>
