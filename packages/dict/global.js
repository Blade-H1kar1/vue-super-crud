import dict from "core/dict";

export default function (Vue, globalOpt) {
  return new Vue({
    mixins: [dict(globalOpt)],
  });
}
