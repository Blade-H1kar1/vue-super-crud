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
      '--sc-crud-gap': `${crudOptions.gap}px`,
      height: `${wrapperHeight}`,
    }"
    ref="wrapper"
  >
    <simpleRender
      prop="title"
      :render="crudOptions.titleRender"
      :slots="$scopedSlots"
      :position="true"
      ><div v-if="crudOptions.title" class="sc-title">
        {{ crudOptions.title }}
      </div></simpleRender
    >
    <search ref="searchRef" />
    <menuBar ref="menuBar" />
    <el-form
      :model="{
        list,
      }"
      :show-message="false"
      :size="crudOptions.size"
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
          <div :class="b('empty')" v-if="$slots.empty || crudOptions.empty">
            <slot name="empty" v-if="$slots.empty"></slot>
            <el-empty
              v-else
              :image="crudOptions.empty.image"
              :image-size="crudOptions.empty.size"
              :description="crudOptions.empty.text"
            ></el-empty>
          </div>
        </template>
        <slot></slot>
        <el-table-column
          v-if="crudOptions.expand"
          type="expand"
          key="expand"
          prop="expand"
          :fixed="defaultFixed"
          v-bind="crudOptions.expand"
        >
        </el-table-column>
        <el-table-column
          v-if="crudOptions.index"
          type="index"
          key="index"
          prop="index"
          :fixed="defaultFixed"
          v-bind="crudOptions.index"
        ></el-table-column>
        <el-table-column
          v-if="crudOptions.selection"
          type="selection"
          key="selection"
          prop="selection"
          :fixed="defaultFixed"
          v-bind="crudOptions.selection"
        ></el-table-column>
        <column v-for="(col, index) in columns" :col="col" :key="index" />
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
    <pagination ref="paginationRef" />
  </div>
</template>

<script>
// TODO: 1: 表格配置分组显示
// group: { aaaa: ['prop1','prop2'], bbbb: ['prop2','prop3','prop4']  }
// TODO: 2：已知bug，a.某列设置排序后且有children渲染会重复,b.高度固定式，统计栏消失 , c.
//                  c.columns为动态时变化后白屏
//
import { create, init, event } from "core";
import config from "src/config/crud";
import simpleRender from "core/components/simpleRender";
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
import api from "./mixins/api.js";
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

export default create({
  name: "crud",
  components: {
    columnAction,
    column,
    menuBar,
    pagination,
    search,
    group,
    simpleRender,
  },
  mixins: [
    init("crudOptions", config),
    tableEdit,
    api,
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
    };
  },
  created() {
    this.getLocalCache();
  },
  mounted() {
    if (this.searchParams) {
      this.query = Object.assign({}, this.query, this.searchParams);
    }
    setTimeout(() => {
      this.crudOptions.init !== false && this.getList();
    }, 0);
    this.extendMethod(this.$refs.tableFormRef, ["validate", "clearValidate"]);
    this.extendMethod(this.$refs.tableRef);
    this.refactorTableHeaderClick();
  },
  beforeDestroy() {
    this.cancelObserver && this.cancelObserver();
  },
  computed: {
    list: {
      get() {
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
    defaultFixed() {
      const fixed = this.setOptions.fixed;
      const hasLeft = Object.keys(fixed).some((i) => fixed[i] === "left");
      return hasLeft;
    },
    extendsScopedSlots() {
      const slots = { ...this.$scopedSlots };
      this.extendsSlots(slots, "add", "form");
      this.extendsSlots(slots, "edit", "form");
      this.extendsSlots(slots, "view", "form");
      this.extendsSlots(slots, "searchHeader", "search");
      return slots;
    },
  },
  watch: {
    data: {
      handler() {
        this.processList(this.list);
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
      this.$emit("update:showPopperNum", this.showPopperNum);
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
        const { item } = findTree(
          this.lazyTreeData,
          (item) => item[this.valueKey] === tree[this.valueKey]
        );
        if (item && item.children && item.children.length) {
          const list = cloneDeep(item.children);
          this.handleLocalLazy(list);
          resolve(list);
        } else {
          resolve([]);
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
        if (isGenUniqueId) {
          Object.defineProperty(item, "$uniqueId", {
            value: uniqueId(),
            writable: true,
            enumerable: false,
          });
        }
      });
      // this.delayRender(list);

      // 恢复未保存行的编辑状态
      if (this.noSaveEditMap) {
        list.forEach((i) => {
          const editInfo = this.noSaveEditMap[i[this.valueKey]];
          if (editInfo) Object.assign(i, editInfo);
        });
        this.noSaveEditList = [];
      }
      if (this.isTree && this.crudOptions.autoLazy) {
        this.lazyTreeData = cloneDeep(list);
        this.handleLocalLazy(list);
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
  },
});
</script>

<style lang="scss" scoped></style>
