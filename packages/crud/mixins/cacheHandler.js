import { StateStorageManager } from "utils/stateStorage.js";

export default {
  data() {
    return {
      setOptions: {
        fixed: {},
        fixedWidth: {},
        sort: {},
        hidden: [],
        pageSize: null,
      },
      stateStorageManager: null,
    };
  },
  created() {
    // 初始化状态存储管理器
    this.stateStorageManager = new StateStorageManager({
      storageKey: "tableOptions",
      useRouteKey: true,
    });
    this.getLocalCache();
  },
  methods: {
    getLocalCache() {
      if (!this.stateStorageManager || !this.$route) return;
      const cachedOptions = this.stateStorageManager.restore(
        this.crudOptions.stateKey,
        this.$route
      );
      if (cachedOptions) {
        this.setOptions = Object.assign(this.setOptions, cachedOptions);
      }
    },
    resetLocalCache() {
      this.setOptions.fixed = {};
      this.setOptions.sort = {};
      this.setOptions.hidden = [];
      this.saveLocalCache();
    },
    saveLocalCache(refresh = true) {
      if (!this.stateStorageManager || !this.$route) return;
      this.stateStorageManager.save(
        this.crudOptions.stateKey,
        this.setOptions,
        this.$route
      );

      refresh && this.refreshTable();
    },
    // 清除当前路由的缓存
    clearCurrentCache() {
      if (!this.stateStorageManager || !this.$route) return;
      this.stateStorageManager.clear(this.crudOptions.stateKey, this.$route);
    },
    // 清除所有缓存
    clearAllCache() {
      if (!this.stateStorageManager) return;
      this.stateStorageManager.clearAll();
    },
  },
};
