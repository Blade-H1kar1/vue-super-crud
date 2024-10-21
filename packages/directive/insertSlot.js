export default {
  inserted: function (el) {
    el.parentNode && el.parentNode.removeChild(el);
  },
  update(el, binding, vnode, oldVnode) {
    if (binding.value) {
      binding.value.vnode = oldVnode;
    }
  },
};
