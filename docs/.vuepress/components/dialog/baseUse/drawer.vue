<template>
  <div>
    <el-button size="small" type="primary" @click="openDialog"
      >抽屉式弹窗</el-button
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
    };
  },
  computed: {
    renderColumns() {
      return [
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "age",
          label: "年龄",
        },
        {
          prop: "sex",
          label: "性别",
          comp: {
            name: "el-checkbox-group",
            options: [
              {
                label: "男",
                value: "男",
              },
              {
                label: "女",
                value: "女",
              },
            ],
          },
        },
      ];
    },
  },
  methods: {
    openDialog() {
      this.$scDialog({
        title: "弹窗",
        width: "500px",
        drawer: true,
      }).show();
    },
  },
};
</script>

<style lang="scss" scoped></style>
