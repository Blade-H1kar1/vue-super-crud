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
    tabindex="0"
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
      @submit.native.prevent
    >
      <component
        :is="enabledAreaSelection ? 'ElTableExcelExtends' : 'div'"
        ref="areaSelectionRef"
        v-bind="areaSelection"
        v-on="$listeners"
        :customMapping="customMapping"
        :getCellValueMethod="getCellValueMethod"
        :setCellValueMethod="setCellValueMethod"
      >
        <component
          :is="virtualized ? 'virtualScroll' : 'div'"
          :data="virtualized ? list : null"
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
            v-on="tableListeners"
            :data="virtualized ? virtualList : list"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
            @row-contextmenu="openContextMenu"
            @header-contextmenu="openContextHerderMenu"
            @selection-change="selectionChange"
            @select="select"
            @select-all="selectAll"
            @row-click="rowClick"
            @row-dblclick="rowDblclick"
            @cell-click="cellClick"
            @cell-dblclick="cellDblclick"
            @header-dragend="headerDragend"
            :row-key="rowKey_"
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
              v-for="(col, index) in columns"
              :col="col"
              :key="col.prop || col.label"
              :lastColumn="index === columns.length - 1"
            />
            <columnAction />
          </el-table> </component
      ></component>
      <el-tooltip
        effect="light"
        :popper-class="b('error-tip')"
        placement="top"
        ref="tooltip"
        :content="errorContent"
      >
      </el-tooltip>
    </el-form>
    <batchMockData
      :visible.sync="showMockDialog"
      :columns="columns"
      :data="list"
      :value-key="valueKey"
      instance-type="table"
      :instance-ref="$refs.tableRef"
      @generate="handleGenerateMockData"
      @close="handleCloseMockDialog"
    />
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
  omit,
} from "lodash-es";

// 混入
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
import mockData from "./mixins/mockData";
// 组件
import search from "./search.vue";
import menuBar from "./menuBar.vue";
import columnAction from "./columnAction.vue";
import column from "./column.vue";
import defaultColumn from "./defaultColumn.vue";
import pagination from "./pagination.vue";
import group from "../group/index.vue";
import selectBanner from "./selectBanner.vue";
import virtualScroll from "el-table-virtual-scroll";
import batchMockData from "core/components/batchMockData.vue";
import ElTableExcelExtends from "el-table-excel-extends";
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
    batchMockData,
    ElTableExcelExtends,
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
    mockData,
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
      oldVNodeMap: new Map(),
      showMockDialog: false,
    };
  },
  mounted() {
    this.crudOptions.init && this.initQuery();
    this.extendMethod(this.$refs.tableFormRef, ["validate", "clearValidate"]);
    this.extendMethod(this.$refs.tableRef);
    this.refactorTableHeaderClick();
  },
  computed: {
    rowKey_() {
      if (
        this.isTree ||
        this.crudOptions.selection.reserveSelection ||
        this.crudOptions.selection["reserve-selection"] ||
        this.crudOptions.rowKey
      ) {
        return this.valueKey;
      }
    },
    virtualized() {
      return this.crudOptions.virtualized;
    },
    valueKey() {
      if (this.crudOptions.uniqueId) return "$uniqueId";
      if (this.crudOptions.rowKey) return this.crudOptions.rowKey;
      return this.crudOptions.valueKey;
    },
    childrenKey() {
      return this.crudOptions?.treeProps?.children || "children";
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
    tableListeners() {
      const handlers = {
        ...omit(
          this.$listeners,
          "input",
          "selection-change",
          "selectionChange"
        ),
      };
      Object.keys(this.crudOptions).forEach((key) => {
        if (typeof this.crudOptions[key] === "function") {
          handlers[key] = this.crudOptions[key];
        }
      });
      return handlers;
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
      const columns = [
        ...this.defaultColumns,
        ...this.flatColumns.filter((i) => !i.children),
      ];

      // 根据固定列配置进行排序
      return this.sortColumnsByFixed(columns);
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
    enabledAreaSelection() {
      return checkVisibility(this.areaSelection);
    },
    // 区域选取配置
    areaSelection() {
      return this.crudOptions.areaSelection || {};
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
        if (item && item[this.childrenKey] && item[this.childrenKey].length) {
          const list = cloneDeep(item[this.childrenKey]);
          this.handleLocalLazy(list);
          tree.children = list;
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
        if (i[this.childrenKey] && i[this.childrenKey].length) {
          delete i[this.childrenKey];
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
      const target = Dep.target;
      if (Dep.target) {
        Dep.target = null;
      }

      try {
        return fn();
      } finally {
        Dep.target = target;
      }
    },

    // 根据依赖收集状态执行回调函数
    executeWithDeps(callback, collectDep = true, ...args) {
      if (!callback) return;

      if (collectDep === false) {
        return this._runWithoutDeps(() => {
          return callback.call(null, ...args);
        });
      }

      return callback.call(null, ...args);
    },
    cellClassName_({ row, column, rowIndex, columnIndex }) {
      const { cellClassName, methodCollectDepends, editTheme } =
        column?.options || {};
      let cellName =
        this.executeWithDeps(cellClassName, methodCollectDepends, {
          row,
          column,
          rowIndex,
          columnIndex,
        }) || "";

      const col = column.col;
      if (!col) return cellName;

      // 添加编辑状态类
      if (
        !col.type &&
        editTheme &&
        this.validateEdit(col, { row, $index: rowIndex })
      ) {
        cellName += (cellName ? " " : "") + "edit-cell";
      }

      // 添加自定义单元格类
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
    // 强制更新表格
    _forceUpdate() {
      this.$refs?.tableRef?.store?.updateColumns();
    },
    rowClick(row, column, event) {
      this.selectRowClick(row, column, event);
      if (!column) return;
      if (column.col?.type === "action") return;
      this.handleRowClick(
        { row, $index: row.$index },
        column.col.prop,
        "click"
      );
    },
    rowDblclick(row, column, event) {
      if (!column) return;
      if (column.col?.type === "action") return;
      this.handleRowClick(
        { row, $index: row.$index },
        column.col.prop,
        "dblclick"
      );
    },
    cellClick(row, column, cell, event) {
      if (!column) return;
      if (column.col?.type === "action") return;
      this.handleCellClick({ row, $index: row.$index }, column.col, "click");
    },
    cellDblclick(row, column, cell, event) {
      if (!column) return;
      if (column.col?.type === "action") return;
      this.handleCellClick({ row, $index: row.$index }, column.col, "dblclick");
    },
    // 保存拖动后的宽度
    headerDragend(newWidth, oldWidth, column, event) {
      if (this.crudOptions.persistWidth && column && column.property) {
        this.setOptions.fixedWidth[column.property] = newWidth;
        this.saveLocalCache(false); // 不刷新表格，避免死循环
      }
    },
    cellMouseEnter(row, column, cell, event) {
      // 触发校验提示
      this.triggerValidateTooltip(row, column, cell, event);
    },
    cellMouseLeave(row, column, cell, event) {
      // 移除校验提示
      this.removeValidateTooltip(row, column, cell, event);
    },

    // 根据固定列配置对列进行排序
    sortColumnsByFixed(columns) {
      // 获取固定列配置的辅助函数
      const getFixedType = (column) => {
        // 1. 检查列配置中的fixed属性
        if (column.fixed === true || column.fixed === "left") {
          return "left";
        }
        if (column.fixed === "right") {
          return "right";
        }

        // 2. 检查setOptions.fixed配置
        if (column.prop && this.setOptions.fixed[column.prop]) {
          return this.setOptions.fixed[column.prop];
        }

        return null;
      };

      // 分类列
      const leftColumns = [];
      const centerColumns = [];
      const rightColumns = [];

      columns.forEach((column) => {
        const fixedType = getFixedType(column);
        if (fixedType === "left") {
          leftColumns.push(column);
        } else if (fixedType === "right") {
          rightColumns.push(column);
        } else {
          centerColumns.push(column);
        }
      });

      // 按顺序合并：左固定列 + 普通列 + 右固定列
      return [...leftColumns, ...centerColumns, ...rightColumns];
    },
    getCellValueMethod(params) {
      const { row, column } = params;
      const col = column.col;
      const prop = col?.form?.prop || col?.prop;
      if (!prop) return;
      if (this.areaSelection.getCellValueMethod) {
        return this.areaSelection.getCellValueMethod({
          ...params,
          value: this.getByProp(row, prop),
        });
      }
      return this.getByProp(row, prop);
    },
    setCellValueMethod(params, setByProp) {
      const { row, column, value } = params;
      const col = column.col;
      const prop = col?.form?.prop || col?.prop;
      if (!prop) return;
      if (!this.checkPastePermission(row, col)) return;
      if (this.areaSelection.setCellValueMethod) {
        return this.areaSelection.setCellValueMethod(params, setByProp);
      }
      setByProp(row, prop, value);
      return true;
    },
    // 检查粘贴权限
    checkPastePermission(row, column) {
      if (this.areaSelection.pastePermission) {
        return this.areaSelection.pastePermission(row, column);
      }
      if (this.areaSelection?.operationType === "all") return true;
      const scope = { row, $index: row.$index };
      const { mode, disabled, isRowEdit } = this.editConfig;
      const canEdit =
        typeof column.isEdit === "function"
          ? column.isEdit(scope)
          : column.isEdit;
      if (mode === "row") {
        if (
          (isRowEdit ? isRowEdit(scope) !== false : true) &&
          canEdit !== false &&
          !disabled
        ) {
          this.setRowEdit(row);
          return true;
        } else {
          return false;
        }
      }
      if (["cell", "free"].includes(mode)) {
        if (canEdit !== false && !disabled) {
          return true;
        } else {
          return false;
        }
      }
      return canEdit && !disabled ? true : false;
    },
    customMapping({ value, column, rowIndex, columnIndex }, cellInstance) {
      if (cellInstance?.comp?.options || cellInstance?.dictData) {
        const options = cellInstance?.comp?.options || cellInstance?.dictData;
        const item = options.find((item) => item.label === value);
        return item.value || value;
      }
      const instance = cellInstance?.$children?.[0];
      const options = instance?.options;
      if (options) {
        const item = options?.find((item) => item.label === value);
        return item?.value || value;
      }
      if (this.areaSelection.customMapping) {
        return this.areaSelection.customMapping(
          { value, column, rowIndex, columnIndex },
          cellInstance
        );
      }
      return value;
    },
  },
});
</script>
