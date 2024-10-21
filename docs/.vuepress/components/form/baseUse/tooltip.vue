<template>
  <div>
    <sc-form :options="options" :loading.sync="loading" v-model="data">
      <template #slot-tooltip>
        提示slot
      </template>
    </sc-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      options: {
        columns: 2,
        labelWidth: "120px",
        renderColumns: [
          {
            label: "提示",
            prop: "tooltip",
            tooltip: "提示",
          },
          {
            label: "提示slot",
            prop: "slot",
          },
          {
            label: "提示render",
            prop: "tooltipRender",
            tooltipRender: () => <div>提示render</div>,
          },
        ],
      },
      data: {},
    };
  },
};
</script>
