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
      <el-table
        ref="tableRef"
        :key="key"
        v-loading="loadingStatus || delayLoading"
        :element-loading-text="crudOptions.loadingText"
        :element-loading-spinner="crudOptions.loadingSpinner"
        :element-loading-background="crudOptions.loadingBackground"
        highlight-current-row
        highlight-selection-row
        v-bind="tableProps"
        v-on="{ ...$listeners, ...crudOptions }"
        :data="list"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        @row-contextmenu="openContextMenu"
        @selection-change="selectionChange"
        @row-click="rowClick"
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
      v-if="crudOptions.lastRowAddBtn"
      :class="b('add-button')"
      @click="handleRowAdd({}, 'last')"
    >
      <i class="el-icon-plus" /> 新增一行
    </div>
    <pagination ref="paginationRef" />
  </div>
</template>

<script>
// TODO: 已知bug，a.某列设置排序后且有children渲染会重复,b.高度固定式，统计栏消失
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
import search from "./search.vue";
import menuBar from "./menuBar.vue";
import columnAction from "./columnAction.vue";
import column from "./column.vue";
import defaultColumn from "./defaultColumn.vue";
import pagination from "./pagination.vue";
import group from "../group/index.vue";
import {
  toCamelCase,
  toTreeArray,
  findTree,
  filterColumns,
  mergeTemp,
  singleMerge,
} from "utils";
import tableProps from "./mixins/props";
import cache from "utils/cache.js";
import { checkVisibility } from "utils";

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
    };
  },
  data() {
    // $refs: {
    //   searchRef
    //   tableFormRef
    //   tableRef
    //   searchForm  搜索表单实例
    //   crudForm  弹窗表单实例
    //   dialogVm  弹窗实例
    // };
    return {
      delayLoading: false,
      loadingStatus: false,
      key: Math.random(),
      setOptions: {
        hidden: [],
        fixed: {},
        sort: {},
        pageSize: 10,
      },
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
    list: {
      get() {
        if (this.crudOptions.localPagination) {
          const { pageNum, pageSize } = this.crudOptions.props;
          const start = (this.query[pageNum] - 1) * this.query[pageSize];
          const end = start + this.query[pageSize];
          return this.data.slice(start, end);
        }
        return this.data;
      },
      set(val) {
        this.$emit("update:data", val);
      },
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
      const options = pick(this.crudOptions, ["expand", "index", "selection"]);
      Object.keys(options).forEach((key) => {
        if (checkVisibility(options[key])) {
          columns.push({ type: key, ...options[key] });
        }
      });
      return filterColumns(columns.sort((a, b) => a.order - b.order));
    },
    columns() {
      return this.resultColumns;
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
    data: {
      handler(newVal, oldVal) {
        // 是否完全更新数据
        const isUpdated = newVal !== oldVal;
        if (isUpdated) {
          this.processList(this.list);
          // 数据变化时高度更新，防止统计栏不显示
          this.$nextTick(() => {
            this.$refs.tableRef.layout.updateElsHeight();
          });
        }
      },
      immediate: true,
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
    showPopperNum() {
      this.$emit("update:showPopper", this.showPopperNum !== 0);
    },
  },
  methods: {
    initQuery() {
      this.query = Object.assign({}, this.query, this.searchParams);
      this.getList();
    },
    getList() {
      this.$emit("getList");
    },
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
    delayRender(list, chunkSize = 50, delayTime = 50) {
      list.forEach((item, index) => {
        if (index > chunkSize - 1) {
          this.$set(item, "$defer", true);
        }
      });
      // 延迟渲染逻辑
      const delayRender = (startIndex, endIndex, delay) => {
        setTimeout(() => {
          for (let i = startIndex; i <= endIndex; i++) {
            if (list[i]) {
              this.$set(list[i], "$defer", false);
            }
          }
        }, delay);
      };
      for (let i = 100; i < list.length; i += chunkSize) {
        const endIndex = Math.min(i + chunkSize - 1, list.length - 1);
        delayRender(i, endIndex, ((i - 100) / chunkSize) * delayTime);
      }
    },
    processList(list) {
      // 生成唯一id
      const isGenUniqueId = this.crudOptions.uniqueId;
      list.forEach((item) => {
        if ((this.rowEdit || this.cellEdit) && item.$edit === undefined) {
          this.$set(item, "$edit", null);
        }
        if (isGenUniqueId && !item.$uniqueId) {
          item.$uniqueId = uniqueId();
        }
      });
      // this.delayRender(list);
      if (this.pendingChanges.size > 0) {
        // 恢复编辑状态
        list.forEach((row) => {
          const key = row[this.valueKey];
          const pending = this.pendingChanges.get(key);
          if (pending && pending.type === "edit") {
            Object.assign(row, pending.data);
            this.pendingChanges.delete(key);
          }
        });
        // 恢复新增行
        const pendingAdds = Array.from(this.pendingChanges.values())
          .filter((item) => item.type === "add")
          .map((item) => item.data);
        if (pendingAdds.length) {
          if (this._processRowAddType === "last") {
            list.push(...pendingAdds);
          } else {
            list.unshift(...pendingAdds);
          }
          pendingAdds.forEach((item) => {
            this.pendingChanges.delete(item.$add);
          });
        }
      }
      if (this.isTree && this.crudOptions.autoLazy) {
        this.lazyTreeData = cloneDeep(list);
        this.handleLocalLazy(list);

        // 更新懒加载的节点
        this.treeNodeMap.forEach((value, key) => {
          const { tree, treeNode, resolve } = value;
          this.lazyLoad(tree, treeNode, resolve);
        });
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
    extendsSlots(slots, name, extendsName) {
      Object.keys(slots).forEach((slot) => {
        if (slot.endsWith(`-${extendsName}`)) {
          const baseName = slot.slice(0, -(extendsName.length + 1));
          const searchSlotName = `${baseName}-${name}`;
          if (!slots[searchSlotName]) {
            slots[searchSlotName] = slots[slot];
          }
        }
      });
    },
    initColumn(item, index) {
      if (
        (item.form || this.isEdit || item.isEdit) &&
        item.form !== false &&
        item.isEdit !== false
      ) {
        item.form = this.extendsOption(
          item,
          item.form,
          pick(item, ["label", "prop", "required", "regular", "rules"])
        );
      }
      if ((item.form || item.add) && item.add !== false) {
        item.add = this.extendsOption(item, item.add, item.form);
      }
      if ((item.form || item.edit) && item.edit !== false) {
        item.edit = this.extendsOption(item, item.edit, item.form);
      }
      if ((item.form || item.view) && item.view !== false) {
        item.view = this.extendsOption(item, item.view, item.form);
      }
      if (item.search) {
        item.search = this.extendsOption(item, item.search, {});
      }
      if ((item.search || item.searchHeader) && item.searchHeader !== false) {
        item.searchHeader = this.extendsOption(
          item,
          item.searchHeader,
          item.search
        );
      }
      const order = this.setOptions?.sort[item.prop];
      item.order = order === 0 || order ? order : index;

      // 行合并
      if (item.sameRowSpan) {
        if (typeof item.sameRowSpan === "string") {
          this.sameRowSpans.push(item.sameRowSpan);
        } else {
          this.sameRowSpans.push(item.prop);
        }
      }
      // 统计
      if (item.summary) {
        this._showSummary = true;
      }
      if (!item.minWidth && !item.width) {
        item.minWidth = this.getDefaultColumnMinWidth(item);
      }
    },
    getDefaultColumnMinWidth(col) {
      if (this.labelMinWidthMap.has(col.label))
        return this.labelMinWidthMap.get(col.label);
      const labelSpan = document.createElement("span");
      labelSpan.innerText = col.label;
      document.body.appendChild(labelSpan);
      let labelMinWidth = labelSpan.getBoundingClientRect().width + 20;
      col.search && (labelMinWidth += 20);
      col.sortable && (labelMinWidth += 25);
      document.body.removeChild(labelSpan);
      labelMinWidth = Math.max(Math.round(labelMinWidth), 80);
      this.labelMinWidthMap.set(col.label, labelMinWidth);
      return labelMinWidth;
    },
    getColumns(mode) {
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
    extendsOption(item, current, extendsObj) {
      if (current === false) return;
      // current 可能为 undefined || true 转换为 {}
      current = isPlainObject(current) ? current : {};
      current = mergeTemp("render", current.presetType, current);
      if (typeof current.formatData === "string") {
        current.formatData = singleMerge(
          "formatData",
          current.formatData,
          current
        );
      }
      extendsObj = cloneDeep(extendsObj);
      if (current.hidden !== true) {
        return merge(
          {
            label: item.label,
            prop: item.prop,
            dict: item.dict,
            ...extendsObj,
          },
          current
        );
      }
    },
    refreshTable() {
      this.key = Math.random();
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
        !this.crudOptions.editOpacity &&
        this.validateEdit(col, { row, $index: rowIndex })
      ) {
        cellName += " edit-cell";
      }
      if (this.validateIsError(row.$index, col.prop)) {
        cellName += " error-badge";
      }
      if (!this.isDefaultColumn(col)) {
        cellName += " custom-cell";
      }
      return cellName;
    },
    // 校验按钮隐藏
    checkHiddenButtons(key, buttons, scope) {
      buttons = filterColumns(buttons, scope);
      buttons = buttons.reduce((acc, cur) => {
        const permission =
          cur.per ||
          cur.hasPermi ||
          (cur.key && this.crudOptions.permission[cur.key]);
        if (permission && !this.$scOpt?.checkPermission(permission)) return acc;
        if (cur.children) {
          cur.children = this.checkHiddenButtons(key, cur.children, scope);
        }
        acc.push(cur);
        return acc;
      }, []);
      if (isFunction(this.crudOptions.controlButton)) {
        buttons = this.crudOptions.controlButton(key, buttons, scope);
      }
      return buttons;
    },
    changeLoading(bool = false) {
      if (this.crudOptions.disableLoading) return;
      this.loadingStatus = bool;
    },
    controlScopeProps(prop, mode, scope) {
      if (this.crudOptions.controlCellProps) {
        const cellProps = this.crudOptions.controlScopeProps(prop, mode, scope);
        if (cellProps) {
          this.initColumn(cellProps);
          return cellProps;
        }
      }
      return;
    },
    getLocalCache() {
      if (!this.$route) return;
      const cacheData = cache.local.getJSON("tableOptions") || {};
      this.setOptions = Object.assign(
        this.setOptions,
        cacheData[this.$route.path]
      );
      this.resetInit();
    },
    resetLocalCache() {
      this.setOptions.fixed = {};
      this.setOptions.sort = {};
      this.setOptions.hidden = [];
      this.saveLocalCache();
    },
    saveLocalCache(refresh = true) {
      if (!this.$route) return;
      let cacheData = cache.local.getJSON("tableOptions") || {};
      cacheData[this.$route.path] = this.setOptions;
      cache.local.setJSON("tableOptions", cacheData);
      this.resetInit();
      refresh && this.refreshTable();
    },
    isDefaultColumn(col) {
      if (
        col.comp ||
        col.render ||
        col.html ||
        col.isEdit ||
        this.extendsScopedSlots[col.prop]
      ) {
        return false;
      }
      if (this.isEdit && col.isEdit !== false) {
        return false;
      }
      return true;
    },
    handleWrapperClick() {
      if (this.showPopperNum > 0) {
        this.$emit("closeSearchPopover");
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
