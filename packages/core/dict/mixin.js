import { isPlainObject } from "lodash-es";

export default {
  props: {
    // 字典配置
    dict: [Object, String],
    scope: Object,
    prop: String,
  },
  watch: {
    dict: {
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
      if (this.dict) {
        if (isPlainObject(this.dict)) {
          return this.$scDict[this.getDictKey()];
        }
        if (typeof this.dict === "string") {
          return this.$scDict[this.dict];
        }
      }
    },
  },

  beforeDestroy() {
    // 清理监听
    this.$scDict.clear(this.getDictKey());
  },

  methods: {
    // 初始化局部字典
    initLocalDict() {
      if (isPlainObject(this.dict)) {
        if (this.dict.local) {
          // 创建字典key
          const dictKey = this.getDictKey();

          // 注册字典配置
          this.$scDict.register(dictKey, {
            ...this.dict,
            params:
              typeof this.dict.params === "function"
                ? () => this.dict.params(this.scope)
                : this.dict.params,
            load:
              typeof this.dict.load === "function"
                ? () => this.dict.load(this.scope)
                : this.dict.load,
            immediate: false,
            cache: false, // 局部字典默认不缓存
          });
        } else {
          this.$scDict.register(this.getDictKey(), {
            ...this.dict,
            params:
              typeof this.dict.params === "function"
                ? () => this.dict.params(this.scope)
                : this.dict.params,
            load:
              typeof this.dict.load === "function"
                ? () => this.dict.load(this.scope)
                : this.dict.load,
          });
        }
      }
    },

    // 获取字典唯一key
    getDictKey() {
      if (this.dict?.local) {
        return `${this._uid}_${this.dict?.key || this.prop}`;
      }
      return this.dict?.key || this.prop;
    },
  },
};
