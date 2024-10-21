<template>
  <span>
    <template v-if="multiple">
      <div v-for="(Labels, Index) in multipleLabels" :key="Index">
        <span v-for="(label, index) in Labels" :key="index">
          <span v-if="index !== 0"> / </span>
          <span>{{ label }}</span>
        </span>
      </div>
    </template>
    <template v-else>
      <span v-for="(label, index) in labels" :key="index">
        <span v-if="index !== 0"> / </span>
        <span>{{ label }}</span>
      </span>
    </template>
  </span>
</template>

<script>
import { create } from "core";
// 级联数据格式化组件
export default create({
  name: "cascade-format",
  props: {
    // 值<br/>
    // 单选时 '1,2,3' 或 [1,2,3]<br/>
    // 多选[[1,2,3],[4,5,6]]<br/>
    value: {
      type: [String, Array],
      require: true,
    },
    // value的分隔符<br/>
    // 多选时，如果value为string，则以该分隔符分割成多个展示<br/>
    // 传入空字符串，表示不分割<br/>
    separator: { default: ",", require: false },
    // 是否多选
    multiple: { type: Boolean, default: false },
    scope: Object,
    props: {
      type: Object,
      default() {
        return {
          value: "value",
          label: "label",
          children: "children",
        };
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    labels() {
      if (this.value == null) {
        return [];
      }
      return this.buildValueItem(this.value);
    },
    multipleLabels() {
      if (this.value == null) {
        return [];
      }
      const arr = [];
      for (const item of this.value) {
        arr.push(this.buildValueItem(item));
      }
      return arr;
    },
    options() {
      return this.scope.dict.options;
    },
  },
  methods: {
    getValueArr(values) {
      if (values == null) {
        if (this.multiple) {
          values = [];
          for (const item of this.value) {
            for (const sub of item) {
              values.push(sub);
            }
          }
        } else {
          values = this.value;
        }
      }
      if (values == null) {
        return [];
      }
      let arr = null;
      if (
        typeof values === "string" &&
        !this.multiple &&
        this.separator != null &&
        this.separator !== ""
      ) {
        arr = values.split(this.separator);
      } else if (values instanceof Array) {
        arr = values;
      } else {
        arr = [values];
      }
      return arr;
    },
    getDictItem(value, dict, deepMatch) {
      let valueName = "value";
      if (this.props.value) {
        valueName = this.props.value;
      }
      if (deepMatch) {
        let childrenName = "children";
        if (this.props.children) {
          childrenName = this.props.children;
        }
        return this.deepMatch(value, valueName, childrenName, dict);
      } else {
        for (const item of dict) {
          if (item[valueName] === value) {
            return item;
          }
        }
      }
    },
    deepMatch(value, valueName, childrenName, dict) {
      for (const item of dict) {
        if (item[valueName] === value) {
          return item;
        }
      }
      for (const item of dict) {
        if (item[childrenName]) {
          const matched = this.deepMatch(
            value,
            valueName,
            childrenName,
            item[childrenName]
          );
          if (matched) {
            return matched;
          }
        }
      }
    },
    buildValueItem(values) {
      const arr = this.getValueArr(values);
      let labelName = "label";
      if (this.props != null && this.props.label != null) {
        labelName = this.props.label;
      }

      let childrenName = "children";
      if (this.props != null && this.props.children != null) {
        childrenName = this.props.children;
      }
      const labelArr = [];

      if (this.options && this.options.length > 0) {
        let dict = this.options;
        const deepMatch = arr.length === 1;
        for (const value of arr) {
          if (dict != null) {
            const dictItem = this.getDictItem(value, dict, deepMatch);
            if (dictItem != null) {
              dict = dictItem[childrenName];
              labelArr.push(dictItem[labelName]);
              continue;
            }
          }
          labelArr.push(value);
        }
      }
      return labelArr;
    },
  },
});
</script>
