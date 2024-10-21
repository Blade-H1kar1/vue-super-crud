import dict from "core/dict";
import { isFunction, uniqueId } from "lodash-es";
export default {
  props: {
    // 数据字典配置
    // { request:()=> {}, value:'',label:'',children:''}
    dict: [Object, String],
    options: Array,
    ready: Function,
    scope: Object,
  },
  mixins: [dict()],
  data() {
    return {
      dictDataMap: null,
      dictData: [],
      dictLoading: false,
      dictInstance: null,
      dictMeta: {},
    };
  },
  watch: {
    dict() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  computed: {
    _dict() {
      if (typeof this.dict === "string") {
        return { key: this.dict, presetType: this.dict };
      } else {
        return this.dict;
      }
    },
    key() {
      if (!this._dict) return "";
      return this.$scDicts.getKey(this._dict);
    },
    _options() {
      if (this.options && this.options.length > 0) {
        return this.options;
      }
      if (this.dictData && this.dictData.length > 0) {
        return this.dictData;
      }
      return [];
    },
    dictProxy() {
      return {
        key: this.key,
        options: this._options,
        map: this.dictDataMap,
        meta: this.dictMeta,
        reload: this._reload,
        clear: this._clear,
      };
    },
  },
  methods: {
    init() {
      if (!this._dict) return;
      if (this._dict?.scope === true) {
        this.dictInstance = this;
      } else {
        this.dictInstance = this.$scDicts;
      }
      if (this._dict.immediate !== false) {
        this._loadDict();
      }
      // TODO: 监听字典变化
      if (this._dict.watchReload) {
        if (isFunction(this._dict.watchReload)) {
          this.$watch(
            this._dict.watchReload,
            () => {
              this._reload();
            },
            { deep: true }
          );
        }
      }
    },
    _loadDict() {
      this.dictLoading = true;
      this.dictInstance
        .get(
          {
            ...this._dict,
            key: this.key,
          },
          this._dict.params
        )
        .then((data) => {
          this.dictLoading = false;
          this.dictMeta = this.dictInstance?.dictsMeta[this.key];
          this.dictData = this._formatDictData(data[this.key]);
          this.dictDataMap = this.dictInstance.getMap(this.key);
          if (isFunction(this._dict.ready)) {
            this.ready({
              component: this,
              data: this.dictData,
            });
          }
        });
    },
    _formatDictData(data) {
      if (this._dict.formatter) {
        return data.map(this._dict.formatter);
      }
      return data;
    },
    _reload(params) {
      this.dictInstance.reload(this.key, params);
    },
    _clear() {
      this.dictInstance.clear(this.key);
    },
  },
};
