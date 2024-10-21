import { isEmptyData } from "utils";
export default {
  str2array: (item) => ({
    inner: (value, key, inner, outer) => {
      if (isEmptyData(outer[key])) {
        return [];
      }
      inner[key] =
        typeof outer[key] === "string" ? outer[key].split(",") : outer[key];
    },
    outer: (value, key, outer, inner) => {
      // 设置默认值
      if (isEmptyData(inner[key])) {
        return "";
      }
      outer[key] = inner[key].join(",");
    },
  }),
};
