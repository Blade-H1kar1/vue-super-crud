import { isEmptyData } from "utils";
export default {
  strToArr: (item) => ({
    input: (value, { row }) => {
      if (!value) {
        return [];
      }
      return typeof value === "string" ? value.split(",") : value;
    },
    output: (value, { row }) => {
      if (!value) {
        return "";
      }
      return value.join(",");
    },
  }),
  doublePropToArr: (item) => {
    const props = item.doubleProp;
    if (!Array.isArray(props)) {
      console.error("doubleProp必须为数组");
      return;
    }
    return {
      input: (value, { row }) => {
        return row[props[0]] !== undefined || row[props[1]] !== undefined
          ? [row[props[0]] || "", row[props[1]] || ""]
          : [];
      },
      output: (value, { row }, setRow) => {
        if (value && value.length) {
          setRow(props[0], value[0]);
          setRow(props[1], value[1]);
        } else {
          setRow(props[0], "");
          setRow(props[1], "");
        }
      },
    };
  },
  multiPropToArr: (item) => {
    const props = item.multiProp;
    if (!Array.isArray(props)) {
      console.error("multiProp必须为数组");
      return;
    }
    return {
      input: (value, { row }) => {
        const hasAnyValue = props.some((prop) => row[prop] !== undefined);
        return hasAnyValue ? props.map((prop) => row[prop] || "") : [];
      },
      output: (value, { row }, setRow) => {
        if (value && value.length && !isEmptyData(value[0])) {
          props.forEach((prop, index) => {
            setRow(prop, value[index]);
          });
        } else {
          props.forEach((prop) => {
            setRow(prop, "");
          });
        }
      },
    };
  },
};
