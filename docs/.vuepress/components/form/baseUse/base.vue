<template>
  <div>
    <sc-form
      :options="options"
      :loading.sync="loading"
      v-model="data"
      @submit="submit"
    >
    </sc-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      options: {
        action: {
          submit: {},
          reset: {},
        },
        columns: 2,
        columnGap: "10px",
        renderColumns: [
          {
            label: "姓名",
            prop: "name",
            required: true,
          },
          {
            label: "性别",
            prop: "gender",
          },
        ],
      },
      data: {},
    };
  },
  methods: {
    submit(cb, form) {
      setTimeout(() => {
        cb();
      }, 500);
    },
  },
};
</script>
