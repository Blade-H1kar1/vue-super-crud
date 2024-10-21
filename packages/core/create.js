import bem from "utils/bem";
export default function (sfc) {
  sfc.name = "sc-" + (sfc.name || "");
  sfc.mixins = sfc.mixins || [];
  sfc.mixins.push(bem);
  sfc.inheritAttrs = false;
  return sfc;
}
