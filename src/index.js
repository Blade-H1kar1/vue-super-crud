import crud from "pak/crud";
import form from "pak/form";
import dialog from "pak/dialog";
import valueFormat from "pak/dict/valueFormat";
import cascadeFormat from "pak/dict/cascadeFormat.vue";
import cascade from "pak/dict/form/cascade.vue";
import select from "pak/dict/form/select.vue";
import radio from "pak/dict/form/radio.vue";
import _switch from "pak/dict/form/switch.vue";
import checkbox from "pak/dict/form/checkbox.vue";
import tabs from "pak/tabs";
import verifyInput from "pak/verifyInput";

import { mergeTemplate } from "./template";
import dict from "pak/dict/global";
import { merge } from "lodash-es";
import directive from "pak/directive";
import configManager from "core/configManager";
import config from "src/config";

const components = [
  crud,
  form,
  cascade,
  valueFormat,
  cascadeFormat,
  select,
  radio,
  _switch,
  checkbox,
  tabs,
  verifyInput,
];

const install = function (Vue, opts = {}) {
  // 判断是否安装
  if (install.installed) return;
  install.installed = true;
  window.Vue = Vue;
  Vue.prototype.$scDialog = dialog;
  Vue.prototype.$scOpt = opts;
  Vue.prototype.$scDicts = dict(Vue, opts.dict || {});
  Vue.prototype.$sc = {
    dialog,
    dicts: dict(Vue, opts.dict || {}),
  };
  if (opts.template) {
    mergeTemplate(opts.template);
  }

  configManager.create(config, opts);
  // Vue.use(Contextmenu);
  // 遍历注册全局组件
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
  directive(Vue);
};

// 判断是否是直接引入文件
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
};
