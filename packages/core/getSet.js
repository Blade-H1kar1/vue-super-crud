import { get, set } from "lodash-es";
export default {
  methods: {
    getByProp(obj, prop) {
      if (!prop) return obj;
      return get(obj, prop);
    },
    // 设置行数据
    setByProp(obj, prop, val) {
      if (!prop) return;
      // 处理数组路径 ['a', 'b'] 或字符串路径 'a.b'
      const path = Array.isArray(prop) ? prop : prop.split(".");
      if (path.length > 1) {
        if (!get(obj, path)) {
          // 绑定深层响应式对象
          path.slice(0, -1).reduce((obj, key, index) => {
            // 如果当前key值不存在，创建一个新响应式对象
            if (!obj[key] || typeof obj[key] !== "object") {
              this.$set(obj, key, {});
            }
            return obj[key];
          }, obj);

          // 获取最后一层的父对象
          const parentObj = path
            .slice(0, -1)
            .reduce((obj, key) => obj[key], obj);

          this.$set(parentObj, path[path.length - 1], val);
        } else {
          set(obj, path, val);
          this.$set(obj, path[0], obj[path[0]]);
        }
      } else {
        // 触发响应式更新
        this.$set(obj, prop, val);
      }
    },
  },
};
