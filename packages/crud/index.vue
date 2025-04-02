<template>
  <div
    :class="[
      b(),
      {
        [b('maximize')]: isMaximize,
        [b('is-auto-height')]: isAutoHeight,
        [b('is-change-show-search')]: isChangeShowSearch,
      },
    ]"
    :style="{
      padding: wrapperPadding,
      height: wrapperHeight,
    }"
    ref="wrapper"
    @click="handleWrapperClick"
  >
    <position slotName="title" :slots="$scopedSlots"
      ><div v-if="crudOptions.title" class="sc-title">
        {{ crudOptions.title }}
      </div></position
    >
    <search ref="searchRef" />
    <menuBar ref="menuBar" />
    <!-- 选中数据横幅 -->
    <selectBanner v-if="selection.banner || singleSelection.banner" />
    <el-form
      :model="{
        list,
      }"
      :show-message="false"
      :size="crudOptions.size"
      :disabled="crudOptions.disabled"
      ref="tableFormRef"
      @validate="createListError"
      class="height--form"
    >
      <component
        :is="virtualized ? 'virtualScroll' : 'div'"
        :data="list"
        :key-prop="valueKey"
        :virtualized="virtualized"
        v-bind="$attrs"
        @change="(renderData) => (virtualList = renderData)"
      >
        <el-table
          ref="tableRef"
          :key="key"
          v-loading="loadingStatus"
          :element-loading-text="crudOptions.loadingText"
          :element-loading-spinner="crudOptions.loadingSpinner"
          :element-loading-background="crudOptions.loadingBackground"
          highlight-current-row
          highlight-selection-row
          v-bind="tableProps"
          v-on="{ ...$listeners, ...crudOptions }"
          :data="virtualized ? virtualList : list"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          @row-contextmenu="openContextMenu"
          @selection-change="selectionChange"
          @select="select"
          @select-all="selectAll"
          @row-click="rowClick"
          @row-dblclick="rowDblclick"
          @cell-click="cellClick"
          @cell-dblclick="cellDblclick"
          :row-key="valueKey"
          :row-style="defineRowIndex"
          :cell-class-name="cellClassName_"
          :row-class-name="rowClassName_"
          :lazy="crudOptions.lazy || crudOptions.autoLazy"
          :load="lazyLoad"
          :spanMethod="spanMethod"
          :summary-method="summaryMethod"
          :show-summary="showSummary"
        >
          <template slot="empty">
            <div :class="b('empty')" v-if="showEmpty">
              <slot name="empty" v-if="$scopedSlots.empty"></slot>
              <el-empty
                v-else
                :image="crudOptions.empty.image"
                :image-size="crudOptions.empty.size"
                :description="crudOptions.empty.text"
              ></el-empty>
            </div>
          </template>
          <defaultColumn
            v-for="col in defaultColumns"
            :col="col"
            :key="col.type"
          />
          <slot></slot>
          <column
            v-for="col in columns"
            :col="col"
            :key="col.prop || col.label"
          />
          <columnAction />
        </el-table>
      </component>
      <el-tooltip
        effect="light"
        :popper-class="b('error-tip')"
        placement="top"
        ref="tooltip"
        :content="errorContent"
      >
      </el-tooltip>
    </el-form>
    <div
      v-if="editConfig.lastAdd"
      :class="b('add-button')"
      @click="handleLastAdd"
    >
      <i class="el-icon-plus" /> 新增一行
    </div>
    <position :inline="false" slotName="pagination" :slots="$scopedSlots"
      ><pagination ref="paginationRef"
    /></position>
  </div>
</template>

<script>
import { create, init, event } from "core";
import position from "core/components/position";
import {
  uniqueId,
  pick,
  get,
  isFunction,
  cloneDeep,
  merge,
  isPlainObject,
} from "lodash-es";
import tableEdit from "./mixins/tableEdit.js";
import validate from "./mixins/validate.js";
import contextMenu from "./mixins/contextMenu";
import dialog from "./mixins/dialog.js";
import select from "./mixins/select.js";
import calcHeight from "./mixins/calcHeight.js";
import spanMethod from "./mixins/spanMethod.js";
import exposeMethods from "./mixins/exposeMethods";
import generateDynamicColumns from "./mixins/generateDynamicColumns";
import dataProcessor from "./mixins/dataProcessor";
import summary from "./mixins/summary";
import columnHandler from "./mixins/columnHandler";
import cacheHandler from "./mixins/cacheHandler";
import searchHandler from "./mixins/searchHandler";
import search from "./search.vue";
import menuBar from "./menuBar.vue";
import columnAction from "./columnAction.vue";
import column from "./column.vue";
import defaultColumn from "./defaultColumn.vue";
import pagination from "./pagination.vue";
import group from "../group/index.vue";
import selectBanner from "./selectBanner.vue";
import virtualScroll from "el-table-virtual-scroll";
import {
  toCamelCase,
  toTreeArray,
  findTree,
  filterColumns,
  mergeTemp,
  singleMerge,
  checkVisibility,
  filterButtons,
} from "utils";
import tableProps from "./mixins/props";

export default create({
  name: "crud",
  components: {
    columnAction,
    column,
    defaultColumn,
    menuBar,
    pagination,
    search,
    group,
    position,
    selectBanner,
    virtualScroll,
  },
  mixins: [
    init("crudOptions"),
    tableEdit,
    dialog,
    validate,
    contextMenu,
    event,
    select,
    calcHeight,
    spanMethod,
    exposeMethods,
    generateDynamicColumns,
    summary,
    dataProcessor,
    columnHandler,
    cacheHandler,
    searchHandler,
  ],
  props: {
    // 防止scope中携带实例时，拷贝合并报错
    scope: Object,
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    search: {
      type: Object,
      default: () => {
        return {};
      },
    },
    loading: {
      type: Boolean,
    },
    slots: {},
    searchParams: {},
    load: Function,
  },
  provide() {
    return {
      ctx: this,
      controlCtx: this,
    };
  },
  data() {
    // $refs: {
    //   searchRef
    //   tableFormRef
    //   tableRef
    //   crudForm  弹窗表单实例
    //   dialogVm  弹窗实例
    // };
    return {
      key: Math.random(),
      showSearch: false,
      isMaximize: false,
      query: {},
      form: {},
      selectionRow: [],
      isChangeShowSearch: false,
      virtualList: [],
      lazyTreeData: [],
      showPopperNum: 0,
      sameRowSpans: [],
      _showSummary: false,
      treeNodeMap: new Map(),
      labelMinWidthMap: new Map(),
    };
  },
  created() {
    this.getLocalCache();
  },
  mounted() {
    this.crudOptions.init && this.initQuery();
    this.extendMethod(this.$refs.tableFormRef, ["validate", "clearValidate"]);
    this.extendMethod(this.$refs.tableRef);
    this.refactorTableHeaderClick();
  },
  computed: {
    virtualized() {
      return this.crudOptions.virtualized;
    },
    valueKey() {
      if (this.crudOptions.uniqueId) return "$uniqueId";
      if (this.crudOptions.rowKey) return this.crudOptions.rowKey;
      return this.crudOptions.valueKey;
    },
    isTree() {
      let flag = false;
      this.data.forEach((ele) => {
        if (ele.children) {
          flag = true;
        }
      });
      return flag;
    },
    crudOptions() {
      return this.resultOptions;
    },
    tableProps() {
      const obj = {};
      Object.keys(this.crudOptions).forEach((key) => {
        obj[toCamelCase(key)] = this.crudOptions[key];
      });
      const props = pick(obj, tableProps);
      const height = this.tableHeight;
      if (height) {
        props.height = height;
      } else {
        delete props.height;
      }
      return props;
    },
    defaultColumns() {
      const columns = [];
      const options = pick(this.crudOptions, [
        "expand",
        "index",
        "selection",
        "singleSelection",
      ]);
      Object.keys(options).forEach((key) => {
        if (checkVisibility(options[key])) {
          columns.push({ type: key, ...options[key] });
        }
      });
      return filterColumns(columns.sort((a, b) => a.order - b.order));
    },
    columns() {
      if (this.crudOptions.dynamicConfig) {
        const dynamicColumns = (
          this.generateDynamicColumns(
            this.data,
            this.crudOptions.dynamicConfig
          ) || []
        ).map(this.handleInitColumn);
        return filterColumns(
          this.insertColumns(
            dynamicColumns,
            this.resultColumns,
            this.crudOptions.dynamicInsertPosition
          )
        );
      }
      return filterColumns(this.resultColumns);
    },
    flatColumns() {
      return toTreeArray(this.columns);
    },
    trueRenderColumns() {
      return this.flatColumns.filter((i) => !i.children);
    },
    columnsMap() {
      const map = {};
      this.trueRenderColumns.forEach((i) => {
        map[i.prop] = i;
      });
      return map;
    },
    extendsScopedSlots() {
      const slots = { ...this.$scopedSlots };
      this.extendsSlots(slots, "add", "form");
      this.extendsSlots(slots, "edit", "form");
      this.extendsSlots(slots, "view", "form");
      this.extendsSlots(slots, "searchHeader", "search");
      return slots;
    },
    wrapperPadding() {
      if (this.crudOptions.padding) return this.crudOptions.padding;
      const { gap = 0 } = this.crudOptions;
      return this.isAutoHeight ? `${gap}px ${gap}px 0` : `${gap}px`;
    },
    showEmpty() {
      return checkVisibility(
        this.crudOptions.empty,
        null,
        this.$scopedSlots.empty
      );
    },
  },
  watch: {
    showPopperNum() {
      this.$emit("update:showPopper", this.showPopperNum !== 0);
    },
  },
  methods: {
    // 重写表头点击事件
    refactorTableHeaderClick() {
      const tableHeader = this.$refs.tableRef.$refs.tableHeader;
      const headerClick = tableHeader.handleHeaderClick;
      tableHeader.handleHeaderClick = (event, column) => {
        return tableHeader.$parent.$emit("header-click", column, event);
        // const col = this.columnsMap[column.property];
        // headerClick.call(tableHeader, event, column);
      };
    },
    lazyLoad(tree, treeNode, resolve) {
      if (this.crudOptions.autoLazy) {
        this.treeNodeMap.set(tree[this.valueKey], { tree, treeNode, resolve });
        const { item } = findTree(
          this.lazyTreeData,
          (item) => item[this.valueKey] === tree[this.valueKey]
        );
        if (item && item.children && item.children.length) {
          const list = cloneDeep(item.children);
          this.handleLocalLazy(list);
          resolve(list);
        } else {
          // 更新空的懒加载节点
          this.$set(
            this.$refs.tableRef.store.states.lazyTreeNodeMap,
            tree[this.valueKey],
            []
          );
        }
      }
      if (this.load) {
        this.load(tree, treeNode, resolve);
      }
    },
    handleLocalLazy(list) {
      list.forEach((i) => {
        if (i.children && i.children.length) {
          delete i.children;
          i.hasChildren = true;
        }
      });
    },
    getRenderColumns(mode) {
      const options = this.crudOptions;
      const key = mode + "Form";
      if (
        isPlainObject(options.formOptions) &&
        Array.isArray(options.formOptions.renderColumns) &&
        !options[key]?.renderColumns &&
        options[key] !== false
      ) {
        return options.formOptions.renderColumns || [];
      }
      if (
        isPlainObject(options[key]) &&
        Array.isArray(options[key].renderColumns)
      ) {
        return options[key].renderColumns || [];
      }
      return this.columns
        ?.filter(
          (column) =>
            column[mode] && column[mode] !== false && options[key] !== false
        )
        .map((column) => column[mode]);
    },
    refreshTable() {
      this.$refs.tableRef.doLayout();
      this.$nextTick(() => {
        // 触发表格重新渲染
        this.key = Date.now();
      });
    },
    defineRowIndex({ row, rowIndex }) {
      Object.defineProperty(row, "$index", {
        value: rowIndex,
        writable: true,
        enumerable: false,
      });
      return this.crudOptions.rowStyle
        ? this.crudOptions.rowStyle.call(null, {
            row,
            rowIndex,
          })
        : null;
    },
    _runWithoutDeps(fn) {
      // 获取 Vue 实例内部的 Dep
      const Dep = this.$data.__ob__.dep.constructor;

      // 保存当前的 watcher 栈
      const targetStack = [];
      while (Dep.target) {
        targetStack.push(Dep.target);
        Dep.target = null;
      }

      try {
        return fn();
      } finally {
        // 恢复 watcher 栈
        while (targetStack.length) {
          Dep.target = targetStack.pop();
        }
      }
    },
    cellClassName_({ row, column, rowIndex, columnIndex }) {
      let cellName = this.crudOptions.cellClassName
        ? this.crudOptions.cellClassName.call(null, {
            row,
            column,
            rowIndex,
            columnIndex,
          })
        : "";
      const col = column.col;
      if (!col) return;

      if (
        !col.type &&
        this.crudOptions.editTheme &&
        this.validateEdit(col, { row, $index: rowIndex })
      ) {
        cellName += (cellName ? " " : "") + "edit-cell";
      }
      if (this.validateIsError(row.$index, col.form?.prop || col.prop)) {
        cellName += (cellName ? " " : "") + "error-badge";
      }
      if (!col.type && !this.isDefaultColumn(col)) {
        cellName += (cellName ? " " : "") + "custom-cell";
      }
      return cellName;
    },
    // 校验按钮隐藏
    checkHiddenButtons(key, buttons, scope) {
      buttons = filterButtons(buttons, this.crudOptions, scope, key);
      return buttons;
    },
    handleWrapperClick() {
      if (this.showPopperNum > 0) {
        this.$emit("closeSearchPopover");
      }
    },
    // 强制更新表格列
    forceUpdate() {
      this.$refs?.tableRef?.store?.updateColumns();
    },
    rowClick(row, column, event) {
      this.selectRowClick(row, column, event);
      if (!column) return;
      this.handleRowClick({ row, $index: row.$index }, column.col.prop);
    },
    rowDblclick(row, column, event) {
      if (!column) return;
      this.handleRowClick({ row, $index: row.$index }, column.col.prop);
    },
    cellClick(row, column, cell, event) {
      if (!column) return;
      this.handleCellClick({ row, $index: row.$index }, column.col);
    },
    cellDblclick(row, column, cell, event) {
      if (!column) return;
      this.handleCellClick({ row, $index: row.$index }, column.col);
    },
  },
});
</script>
