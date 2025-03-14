import { isFunction, cloneDeep, uniqueId } from "lodash-es";

export default {
  data() {
    return {
      loadingStatus: false,
      localFilteredData: undefined, // 存储过滤后的数据
    };
  },

  computed: {
    list() {
      return this.filterData();
    },
  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        // 是否完全更新数据
        const isUpdated = newVal !== oldVal;
        if (isUpdated) {
          this.transformData(this.list);
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
  },

  methods: {
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
    transformData(list) {
      // 检查数据唯一性
      this.validateUniqueValues(list);

      // 处理行数据
      this.processRowData(list);

      // 恢复编辑状态
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
    // 检查数据唯一性
    validateUniqueValues(list) {
      if (this._hasCheckedUnique) return;

      const valueMap = new Map();
      list.some((row) => {
        const key = row[this.valueKey];
        if (!key) {
          console.error(
            `[CRUD Error] 数据中存在缺失的 ${this.valueKey} 值`,
            row
          );
          this._hasCheckedUnique = true;
          return true;
        }
        if (valueMap.has(key)) {
          console.error(
            `[CRUD Error] 数据中存在重复的 ${this.valueKey} 值`,
            row
          );
          this._hasCheckedUnique = true;
          return true;
        }
        valueMap.set(key, true);
        return false;
      });
    },

    // 处理行数据
    processRowData(list) {
      const isGenUniqueId = this.crudOptions.uniqueId;

      list.forEach((item) => {
        // 设置编辑状态
        if ((this.rowEdit || this.cellEdit) && item.$edit === undefined) {
          this.$set(item, "$edit", null);
        }
        // 生成唯一ID
        if (isGenUniqueId && !item.$uniqueId) {
          item.$uniqueId = uniqueId();
        }
      });
    },

    // 恢复编辑状态
    restoreEditState(list) {
      if (this.pendingChanges.size === 0) return;

      // 恢复编辑行
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
      this.query = Object.assign({}, this.query, this.searchParams);
      this.getList();
    },
    getList() {
      this.$emit("getList");
    },
  },
};
