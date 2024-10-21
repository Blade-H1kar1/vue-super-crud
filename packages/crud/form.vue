<template>
  <scForm
    :class="[b('form')]"
    ref="crudForm"
    v-model="ctx.form"
    :options="options"
    :scope="scope"
    :loading.sync="loading"
  ></scForm>
</template>

<script>
import create from "core/create";
import scForm from "../form/index.vue";
import { isFunction, merge } from "lodash-es";
import defaultRender from "core/defaultRender";
import { filterColumns } from "utils";
export default create({
  props: {
    ctx: {
      type: Object,
      default: () => {},
    },
    mode: String,
    scope: {
      type: Object,
      default: () => {},
    },
    loading: Boolean,
  },
  name: "crud",
  components: { scForm },
  computed: {
    formOptions() {
      const opt = merge(
        {},
        this.ctx.crudOptions.formOptions,
        this.ctx.crudOptions[this.mode + "Form"]
      );
      return {
        ...opt,
        renderColumns: filterColumns(this.ctx.getColumns(this.mode)),
      };
    },
    options() {
      return {
        detail: this.mode === "view" ? true : false,
        labelPosition: "left",
        columns: 2,
        columnGap: "10px",
        slots: this.ctx.extendsScopedSlots,
        mode: this.mode,
        defaultRender: (h, scope) => {
          if (isFunction(this.formOptions.defaultRender)) {
            return this.formOptions.defaultRender(h, scope);
          }
          if (scope.mode === "view" && this.formOptions.viewType === "table") {
            return defaultRender.formatter(h, scope);
          }
          return defaultRender.input(h, scope);
        },
        ...this.formOptions,
      };
    },
  },
  mounted() {
    this.ctx.$refs.crudForm = this.$refs.crudForm;
  },
  methods: {},
});
</script>
