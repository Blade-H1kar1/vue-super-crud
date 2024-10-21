<script>
import tooltip from "./index";
export default {
  props: {
    hide: {},
  },
  render(h) {
    return !this.hide ? (
      <span
        class="tooltip-wrapper"
        on={{
          mouseenter: (e) => {
            this.vm = tooltip({
              placement: "top",
              ...this.$attrs,
              target: e.target,
            });
            this.vm.show();
          },
          mouseleave: (e) => {
            this.vm && this.vm.hide();
          },
        }}
      >
        {this.$slots.default}
      </span>
    ) : (
      this.$slots.default
    );
  },
};
</script>
