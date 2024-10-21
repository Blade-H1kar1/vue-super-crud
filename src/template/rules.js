import { isEmptyData } from "utils";
const regulars = {
  integer: {
    msg: "请输入正整数",
    regular: /^[0-9]\d*$/,
  },
  integer100: {
    msg: "请输入1~100的正整数",
    regular: /^([0-9][0-9]{0,1}|100)$/,
  },
  phone: {
    msg: "请输入正确的手机号码",
    regular: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
  },
  email: {
    msg: "请输入正确的邮箱地址",
    regular: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  number: {
    msg: "请输入数字",
    regular: /^(0\.\d{1,2}|[1-9]\d*(\.\d{1,2})?|0)$/,
  },
};

export default {
  required: (rules, { item }) => {
    return {
      validator: (rule, value, callback) => {
        if (!isEmptyData(value)) {
          callback();
        } else {
          callback(new Error(item.label + "不能为空"));
        }
      },
      trigger: item.trigger || "change",
      message: item.msg,
    };
    // return {
    //   required: true,
    //   message: item.label + "不能为空",
    //   trigger: rules.trigger || "change",
    // };
  },
  limit: (rules, { item }) => {
    return {
      min: rules.min,
      max: rules.max,
      message: `长度在 ${rules.min} 到 ${rules.max} 个字符`,
      trigger: rules.trigger || "change",
    };
  },
  ...regulars,
};
