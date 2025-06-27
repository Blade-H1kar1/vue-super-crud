import cache from "utils/cache.js";
export default {
  data() {
    return {
      setOptions: {
        fixed: {},
        fixedWidth: {},
        sort: {},
        hidden: [],
        pageSize: 10,
      },
    };
  },
  methods: {
    getCacheKey() {
      if (!this.$route) return "";
      // 去掉结尾的 /数字 或 数字
      return this.$route.path.replace(/\/?\d+$/, "");
    },
    getLocalCache() {
      if (!this.$route) return;
      const cacheData = cache.local.getJSON("tableOptions") || {};
      this.setOptions = Object.assign(
        this.setOptions,
        cacheData[this.getCacheKey()]
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
      cacheData[this.getCacheKey()] = this.setOptions;
      cache.local.setJSON("tableOptions", cacheData);
      refresh && this.refreshTable();
    },
  },
};
