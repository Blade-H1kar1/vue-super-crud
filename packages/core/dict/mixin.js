import { isPlainObject } from "lodash-es";

export default {
  props: {
    // 字典配置
    dict: [Object, String, Function],
    scope: Object,
    prop: String,
  },
  watch: {
    dictConfig: {
      immediate: true,
      handler(val, oldVal) {
        if (val) {
          this.initLocalDict();
        }
      },
    },
  },

  computed: {
    dictData() {
      if (this.dictConfig) {
        if (isPlainObject(this.dictConfig)) {
          return this.$scDict[this.getDictKey()];
        }
        if (typeof this.dictConfig === "string") {
          return this.$scDict[this.dictConfig];
        }
      }
    },
    dictConfig() {
      const dictConfig =
        typeof this.dict === "function" ? this.dict(this.scope) : this.dict;
      return dictConfig;
    },
  },

  beforeDestroy() {
    // 只有局部字典需要清理
    if (this.dictConfig?.local) {
      this.$scDict.clear(this.getDictKey());
    }
  },

  methods: {
    // 初始化局部字典
    initLocalDict() {
      const dict = this.dictConfig;
      if (isPlainObject(dict)) {
        if (dict.local) {
          // 创建字典key
          const dictKey = this.getDictKey();

          // 注册字典配置
          this.$scDict.register(dictKey, {
            ...dict,
            params:
              typeof dict.params === "function"
                ? () => dict.params(this.scope)
                : dict.params,
            load:
              typeof dict.load === "function"
                ? () => dict.load(this.scope)
                : dict.load,
            immediate: false,
            cache: false, // 局部字典默认不缓存
          });
        } else {
          this.$scDict.register(this.getDictKey(), {
            ...dict,
            params:
              typeof dict.params === "function"
                ? () => dict.params(this.scope)
                : dict.params,
            load:
              typeof dict.load === "function"
                ? () => dict.load(this.scope)
                : dict.load,
          });
        }
      }
    },

    // 获取字典唯一key
    getDictKey() {
      const dict = this.dictConfig;
      if (dict?.local) {
        return `${this._uid}_${dict?.key || this.prop}`;
      }
      return dict?.key || this.prop;
    },
  },
};
