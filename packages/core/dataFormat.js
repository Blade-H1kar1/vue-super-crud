import { isArray } from "lodash-es";

export default {
  methods: {
    // 外部数据与内部数据的格式转换 inner:内部数据 outer:外部数据
    dataFormat(data, formatValue, map, type = "inner") {
      const obj = formatValue;
      Object.keys(data).forEach((key) => {
        // 多字段格式化处理
        if (key.includes("-")) {
          const keys = key.split("-");
          if (type === "inner") {
            // 删除多余字段
            keys.forEach((k) => {
              delete obj[k];
            });

            const value = [];
            keys.forEach((k) => {
              value.push(data[k] || "");
            });
            if (map[key]) {
              const res = map[key][type](value, key, obj, data, map);
              if (res !== undefined) obj[key] = res;
            } else {
              // 默认返回数组
              obj[key] = value;
            }
          } else {
            // 删除多余字段
            delete obj[key];

            const value = data[key];
            if (!value)
              return keys.forEach((k, idx) => {
                obj[k] = "";
              });
            if (map[key]) {
              const res = map[key][type](value, key, obj, data, map);
              if (
                res !== undefined &&
                isArray(res) &&
                res.length === keys.length
              ) {
                keys.forEach((k, idx) => {
                  obj[k] = res[idx];
                });
              }
            } else {
              keys.forEach((k, idx) => {
                obj[k] = value[idx];
              });
            }
          }
        } else if (map[key]) {
          const res = map[key][type](data[key], key, obj, data, map);
          if (res !== undefined) obj[key] = res;
        } else {
          obj[key] = data[key];
        }
      });
    },
  },
};
