<script>
export default {
  mounted() {
    this.vm = this.$scDialog({
      ...this.$attrs,
      render: () => this.$slots.default,
    });
  },
  methods: {
    show() {
      return this.vm.show();
    },
  },
};
</script>