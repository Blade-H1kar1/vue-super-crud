import { isFunction } from "lodash-es";

export default {
  mounted() {
    this.extendMethod(this.$refs.target);
  },
  methods: {
    extendMethod(ref, exclude = []) {
      const refMethod = Object.entries(ref);
      for (const [key, value] of refMethod) {
        if (
          !(key.includes("$") || key.includes("_")) &&
          isFunction(value) &&
          !this[key] &&
          !exclude.includes(key)
        ) {
          this[key] = value;
        }
      }
    },
  },
};
