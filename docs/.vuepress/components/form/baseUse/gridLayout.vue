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
      options: {
        layout: "grid",
        columns: 2,
        columnGap: "10px",
        rowGap: "10px",
        renderColumns: [
          {
            label: "widthSize",
            prop: "widthSize",
            widthSize: 2,
          },
          {
            label: "heightSize",
            prop: "heightSize",
            heightSize: 2,
            comp: {
              type: "textarea",
              autosize: { minRows: 4 },
            },
          },
          {
            label: "姓名",
            prop: "name",
          },
          {
            label: "年龄",
            prop: "age",
          },
        ],
      },
      data: {},
    };
  },
};
</script>
