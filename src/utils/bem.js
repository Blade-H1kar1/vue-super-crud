/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'
 */

const ELEMENT = "__";
const MODS = "--";

const join = (name, el, symbol) => (el ? name + symbol + el : name);

const prefix = (name, mods) => {
  if (typeof mods === "string") {
    return join(name, mods, MODS);
  }

  if (Array.isArray(mods)) {
    return mods.map((item) => prefix(name, item));
  }

  const ret = {};
  Object.keys(mods || {}).forEach((key) => {
    ret[name + MODS + key] = mods[key];
  });
  return ret;
};

export const bem = (name, el, mods, onlyPrefix) => {
  if (el && typeof el !== "string") {
    mods = el;
    el = "";
  }
  el = join(name, el, ELEMENT);
  if (onlyPrefix && mods) {
    return prefix(el, mods);
  }
  return mods ? [el, prefix(el, mods)] : el;
};

export default {
  methods: {
    b(el, mods, onlyPrefix) {
      return bem(this.$options.name, el, mods, onlyPrefix);
    },
  },
};
