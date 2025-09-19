<template>
  <div>
    <sc-form :options="options" :loading.sync="loading" v-model="data">
      <template #slot-label> label-slot </template>
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
        colon: true,
        hiddenLabel: false,
        labelOverTip: false,
        renderColumns: [
          {
            label: "标签",
            prop: "label",
          },
          {
            label: "标签Slot",
            prop: "slot",
          },
          {
            label: "标签Render",
            prop: "render",
            labelRender: () => <span>label-render</span>,
          },
          {
            label: "隐藏标签",
            prop: "label",
            hiddenLabel: true,
          },
          {
            label: "超出隐藏标签超出超出超出",
            prop: "over",
            labelOverTip: true,
            position: true,
          },
        ],
      },
      data: {},
    };
  },
};
</script>
