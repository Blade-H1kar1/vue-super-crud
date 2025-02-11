import DialogComponent from "./dialog.js";

export default function (options) {
  const caller = this || {};

  let DialogConstructor = window.Vue.extend(DialogComponent(options));

  // 注入路由根实例
  const routerMixin = {
    beforeCreate() {
      this._routerRoot = caller._routerRoot;
    },
  };
  if (caller._routerRoot) {
    DialogConstructor.mixin(routerMixin);
  }

  let instance = new DialogConstructor();
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  return instance.vm;
}
