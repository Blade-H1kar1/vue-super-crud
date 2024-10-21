<template>
  <div>
    <sc-form :options="options" :loading.sync="loading" v-model="data">
    </sc-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      data: {},
    };
  },
  computed: {
    options() {
      return {
        columns: 2,
        renderColumns: [
          {
            label: "输入值显示",
            prop: "name",
          },
          {
            label: "hidden隐藏项",
            prop: "hidden",
            hidden: !this.data.name,
          },
          {
            label: "show隐藏项",
            prop: "show",
            show: this.data.name,
          },
        ],
      };
    },
  },
};
</script>
