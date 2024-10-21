<template>
  <span>
    <template v-for="(item, index) in options">
      <el-tag
        v-if="item[props.color]"
        :key="item[props.value]"
        size="small"
        :type="item[props.color]"
        @click="onClick(item)"
        :effect="item.effect"
        v-bind="$attrs"
      >
        {{ item[props.label] }}
      </el-tag>
      <span v-else :key="item[props.value]">{{
        item[props.label] + (index === options.length - 1 ? "" : "、")
      }}</span>
    </template>
  </span>
</template>

<script>
import { create } from "core";
const COLOR_LIST = ["primary", "success", "warning", "danger"];
const EFFECT_LIST = ["plain", "light"];

// value格式化展示组件
export default create({
  name: "value-format",
  props: {
    // 值
    value: {
      require: false,
    },
    // 是否多选
    multiple: { default: true, require: false },
    // value的分隔符<br/>
    // 多选时，如果value为string，则以该分隔符分割成多个展示<br/>
    // 传入空字符串，表示不分割<br/>
    separator: { default: ",", require: false },
    // 颜色，【auto, primary, success, warning, danger ,info】
    // 配置auto，则自动根据value值hashcode分配颜色值
    color: {
      require: false,
    },
    effect: {
      require: false,
    },

    // 自动颜色列表，【 primary, success, warning, danger 】
    autoColors: {
      type: Array,
    },
    // 自动主题列表，【 light, plain 】
    autoEffects: {
      type: Array,
    },
    scope: Object,
    props: {
      type: Object,
      default() {
        return {
          value: "value",
          label: "label",
          color: "color",
        };
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    options() {
      if (this.value == null || this.value === "") {
        return [];
      }
      if (this.loading) return [];
      const dictDataMap = this.dictDataMap;
      const valueArr = this.getValueArr();
      const options = [];
      const dict = this.props;
      // 没有字典，直接显示值
      if (dictDataMap == null || Object.keys(dictDataMap).length === 0) {
        for (const str of valueArr) {
          const item = {};
          item[dict.value] = str;
          item[dict.label] = str;
          this.setColor(item, dict);
          options.push(item);
        }
        return options;
      }
      // 根据字典展示
      for (const str of valueArr) {
        let item = dictDataMap[str];
        if (item != null) {
          this.setColor(item, dict);
          options.push(item);
        } else {
          item = {};
          item[dict.value] = str;
          item[dict.label] = str;
          this.setColor(item, dict);
          options.push(item);
        }
      }
      return options;
    },
    dictDataMap() {
      if (this.$attrs.options) {
        return this.formatMap(this.$attrs.options);
      }
      return this.scope.dict.map;
    },
  },
  methods: {
    formatMap(data) {
      const dataMap = {};
      data.forEach((item) => {
        dataMap[item.value] = item;
        if (item.children) {
          this.formatMap(item.children, dataMap);
        }
      });
      return dataMap;
    },
    getValueArr() {
      let valueArr = [];
      if (
        typeof this.value === "string" &&
        this.multiple &&
        this.separator != null &&
        this.separator !== ""
      ) {
        valueArr = this.value.split(this.separator);
      } else if (this.value instanceof Array) {
        // 本来就是数组的
        valueArr = this.value;
      } else {
        valueArr = [this.value];
      }
      return valueArr;
    },
    onClick(item) {
      this.$emit("click", { item: item });
    },
    setColor(item, dict) {
      if (!item.effect && this.effect) {
        item.effect = this.effect;
      }
      if (item[dict.color]) {
        return;
      }
      if (this.color === "auto") {
        const hashcode = this.hashcode(item[dict.value]);
        const colors = this.autoColors ? this.autoColors : COLOR_LIST;
        item[dict.color] = colors[hashcode % colors.length];
        const effects = this.autoEffects ? this.autoEffects : EFFECT_LIST;
        item.effect =
          effects[Math.floor(hashcode / colors.length) % effects.length];
      } else {
        item[dict.color] = this.color;
      }
    },
    hashcode(str) {
      if (str == null) {
        return 0;
      }
      if (typeof str !== "string") {
        str = JSON.stringify(str);
      }
      let hash = 0;
      let i;
      let chr;
      let len;
      if (str.length === 0) return hash;
      for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    },
  },
});
</script>
