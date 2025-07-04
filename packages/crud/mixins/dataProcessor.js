import { isFunction, cloneDeep, uniqueId, get } from "lodash-es";
import getSet from "core/getSet";

export default {
  mixins: [getSet],
  data() {
    return {
      isTree: false,
      loadingStatus: false,
      localFilteredData: undefined, // 存储过滤后的数据
      getListResolve: () => {},
      // 记录每页的可见状态范围
      pageVisibilityMap: new Map(), // 存储每页的可见状态范围
      // 数据验证结果缓存
      invalidRows: new Map(), // 存储有问题的行：index -> errorType
    };
  },

  computed: {
    list() {
      return this.filterData();
    },
    // 判断是否为树形数据
    isTreeStructure() {
      return (
        Array.isArray(this.data) &&
        this.data.some((item) => Array.isArray(item[this.childrenKey]))
      );
    },
  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        // 是否完全更新数据
        const isUpdated = newVal !== oldVal;
        // 更新树形状态
        this.updateTreeStatus();
        if (isUpdated) {
          this.transformData();
          this.getListResolve();
        }
        // 通知底层渲染组件进行格式化数据处理
        this.$emit("dataChange");
      },
      immediate: true,
    },
    // 行key变化时，即表更为树级数据，需要重新处理数据和渲染
    rowKey_(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.transformData();
        this.refreshTable();
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
    // 更新树形状态
    updateTreeStatus() {
      this.isTree =
        this.crudOptions.rowKey ||
        this.crudOptions.autoLazy ||
        this.isTreeStructure;
    },
    // 过滤数据
    filterData() {
      let data = this.data;
      if (this.localFilteredData !== undefined) {
        data = this.localFilteredData;
      }

      if (this.crudOptions.localPagination) {
        return this.getLocalPaginationData(data);
      }
      return data;
    },
    // 完全更新时数据转换
    transformData() {
      const list = this.list;
      // 检查数据唯一性
      this.validateUniqueValues(list);

      // 处理行数据
      this.processRowData(list);

      // 恢复新增状态
      this.restoreEditState(list);

      // 处理树形数据
      this.processTreeData(list);

      // 处理动态列数据
      this.processDynamicColumns(list);

      // 数据排序
      this.sortedData();

      // 更新表格状态
      this.updateTableState();
    },
    // 简化的数据唯一性验证
    validateUniqueValues(list) {
      this.invalidRows.clear();
      const keyMap = new Map();

      list.forEach((row, index) => {
        const key = row[this.valueKey];

        // 检查缺失key
        if (!key && key !== 0) {
          this.invalidRows.set(index, "MISSING_ID");
          return;
        }

        // 检查重复key
        if (keyMap.has(key)) {
          // 标记当前行和之前的重复行都为重复ID
          this.invalidRows.set(index, "DUPLICATE_ID");
          this.invalidRows.set(keyMap.get(key), "DUPLICATE_ID");
        } else {
          keyMap.set(key, index);
        }
      });

      if (this.invalidRows.size > 0) {
        const missingCount = Array.from(this.invalidRows.values()).filter(
          (type) => type === "MISSING_ID"
        ).length;
        const duplicateCount = Array.from(this.invalidRows.values()).filter(
          (type) => type === "DUPLICATE_ID"
        ).length;
        console.warn(
          `[CRUD Warning] 发现数据问题：缺失ID ${missingCount}行，重复ID ${duplicateCount}行`
        );
      }
    },

    // 检查行的错误类型
    getRowErrorType(index) {
      return this.invalidRows.get(index) || null;
    },

    // 检查行是否可安全选中
    isRowSafeForSelection(row, index) {
      return !this.invalidRows.has(index);
    },

    // 优化后的处理行数据方法
    processRowData(list) {
      const isGenUniqueId = this.crudOptions.uniqueId;
      const isDelayRender = this.crudOptions.delayRender;
      const delayRenderIndex = this.crudOptions.delayRenderIndex || 30;

      const shouldDelayRender = this.shouldDelayRenderForIndex(
        delayRenderIndex
      );

      const processNode = (nodes, parent = null, level = 0) => {
        if (!Array.isArray(nodes)) return;

        nodes.forEach((item, index) => {
          // 设置延迟渲染
          if (isDelayRender && shouldDelayRender(index)) {
            this.$set(item, "$delay", []);
          }

          // 生成唯一ID
          if (isGenUniqueId && !item.$uniqueId) {
            item.$uniqueId = uniqueId();
          }

          // 添加树形数据的额外属性
          if (this.isTree) {
            // 设置父节点ID
            if (parent !== null && !item.$parent) {
              item.$parentId = parent[this.valueKey];
              Object.defineProperty(item, "$parent", {
                value: parent,
                writable: true,
                enumerable: false,
              });
            }
            // 设置节点层级
            if (!item.$level) {
              item.$level = level;
            }
          }

          // 检查并添加缺失的列字段
          this.initRow(item);

          if (this.isTriggerEdit) {
            this.$set(item, "$edit", item.$edit || false);
          }

          // 递归处理子节点
          if (
            this.isTree &&
            item[this.childrenKey] &&
            item[this.childrenKey].length
          ) {
            processNode(item[this.childrenKey], item, level + 1);
          }
        });
      };

      processNode(list);
    },

    // 判断指定索引是否需要延迟渲染
    shouldDelayRenderForIndex(delayRenderIndex) {
      const currentPage = this.query[this.crudOptions.props.pageNum] || 1;
      const pageVisibility = this.pageVisibilityMap.get(currentPage);

      // 如果没有记录的可见状态，使用默认逻辑
      if (!pageVisibility) {
        return (index) => index >= delayRenderIndex;
      }
      const { maxVisibleIndex } = pageVisibility;
      if (maxVisibleIndex < delayRenderIndex) {
        return (index) => index >= delayRenderIndex;
      }

      const skipRangeStart = Math.max(
        delayRenderIndex,
        maxVisibleIndex - delayRenderIndex
      );
      const skipRangeEnd = maxVisibleIndex;

      return function (index) {
        if (index >= skipRangeStart && index <= skipRangeEnd) {
          return false;
        } else {
          return true;
        }
      };
    },

    // 记录单元格可见状态
    recordCellVisibility(rowIndex, colProp) {
      const currentPage = this.query[this.crudOptions.props.pageNum] || 1;

      if (!this.pageVisibilityMap.has(currentPage)) {
        this.pageVisibilityMap.set(currentPage, {
          maxVisibleIndex: rowIndex,
          visibleIndexes: new Set([rowIndex]),
        });
      } else {
        const pageVisibility = this.pageVisibilityMap.get(currentPage);
        pageVisibility.visibleIndexes.add(rowIndex);
        pageVisibility.maxVisibleIndex = Math.max(
          pageVisibility.maxVisibleIndex,
          rowIndex
        );
      }
    },

    // 收集当前页的可见行索引范围
    collectVisibleRows(currentPage) {
      const visibleIndexes = new Set();
      let maxVisibleIndex = -1;

      // 遍历当前页的数据，收集已渲染的行索引
      this.list.forEach((row, index) => {
        // 如果行没有 $delay 属性，说明不是延迟渲染的行
        // 或者 $delay 数组不为空，说明已经有单元格被渲染了
        if (!row.$delay || row.$delay.length > 0) {
          visibleIndexes.add(index);
          maxVisibleIndex = Math.max(maxVisibleIndex, index);
        }
      });

      if (visibleIndexes.size > 0) {
        this.pageVisibilityMap.set(currentPage, {
          maxVisibleIndex,
          visibleIndexes,
        });
      }
    },

    // 恢复新增状态
    restoreEditState(list) {
      const addedRows = this.editState?.getAddedRows() || [];

      if (addedRows.length > 0) {
        addedRows.forEach((item) => {
          const { addType, row } = item;
          if (addType === "first") {
            list.unshift(row);
          } else if (addType === "last") {
            list.push(row);
          }
        });
      }

      const editingRows = this.editState.editingRows || [];
      list.forEach((row) => {
        const key = row[this.valueKey];
        const editInfo = editingRows.get(key);
        if (editInfo) {
          row.$edit = true;
        }
      });
    },

    // 处理树形数据
    processTreeData(list) {
      if (!this.isTree || !this.crudOptions.autoLazy) return;

      this.lazyTreeData = cloneDeep(list);
      this.handleLocalLazy(list);

      // 更新懒加载的节点
      this.treeNodeMap.forEach((value, key) => {
        const { tree, treeNode, resolve } = value;
        this.lazyLoad(tree, treeNode, resolve);
      });
    },

    // 处理动态列数据
    processDynamicColumns(list) {
      if (!this.crudOptions.flattenConfig && !this.crudOptions.dynamicConfig)
        return;

      this.transformToTree(
        list,
        this.crudOptions.flattenConfig || this.crudOptions.dynamicConfig
      );
    },

    // 更新表格状态
    updateTableState() {
      this.$nextTick(() => {
        this.$refs.tableRef.layout.updateElsHeight();
        this.updateSelection();
      });
    },
    // 获取本地分页数据
    getLocalPaginationData(data) {
      const { pageNum, pageSize } = this.crudOptions.props;
      const start = (this.query[pageNum] - 1) * this.query[pageSize];
      const end = start + this.query[pageSize];
      return data.slice(start, end);
    },

    // 数据加载相关
    changeLoading(bool = false) {
      if (this.crudOptions.disableLoading) return;
      this.loadingStatus = bool;
    },
    initQuery() {
      this.$nextTick(() => {
        this.query = Object.assign({}, this.query, this.searchParams);
        this.getList();
      });
    },
    getList() {
      this.$emit("getList");
      return new Promise((resolve, reject) => {
        this.getListResolve = resolve;
      });
    },
    initRow(row) {
      this.trueRenderColumns.forEach((column) => {
        if (
          column.form?.prop &&
          this.getByProp(row, column.form.prop) === undefined
        ) {
          this.setByProp(row, column.form.prop, column.form.initValue ?? "");
          return;
        }
        if (this.getByProp(row, column.prop) === undefined) {
          this.setByProp(row, column.prop, column.initValue ?? "");
        }
      });
    },
  },
};
