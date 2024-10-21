import tooltipComponent from "./tooltipComponent.js";

export default function (options) {
  let DialogConstructor = window.Vue.extend(tooltipComponent(options));
  let instance = new DialogConstructor();
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  return instance.vm;
}
