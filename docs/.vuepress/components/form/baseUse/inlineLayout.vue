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
        autoFill: true,
        columnWidth: "200px",
        renderColumns: [
          {
            label: "姓名姓名",
            prop: "name",
          },
          {
            label: "年龄年龄",
            prop: "age",
          },
          {
            label: "姓名姓名",
            prop: "name",
          },
          {
            label: "年龄年龄",
            prop: "age",
          },
          {
            label: "姓名姓名",
            prop: "name",
          },
          {
            label: "年龄年龄",
            prop: "age",
          },
        ],
      },
      data: {},
    };
  },
};
</script>
