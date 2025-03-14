import cache from "utils/cache.js";
export default {
  data() {
    return {
      setOptions: {
        fixed: {},
        sort: {},
        hidden: [],
        pageSize: 10,
      },
    };
  },
  methods: {
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
  },
};
