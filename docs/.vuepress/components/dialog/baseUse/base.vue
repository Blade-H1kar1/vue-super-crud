<template>
  <div>
    <el-button size="small" type="primary" @click="openDialog"
      >component配置弹窗</el-button
    >
    <el-button size="small" type="primary" @click="renderDialog"
      >render函数弹窗</el-button
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
        title: "comp配置",
        width: "500px",
        comp: {
          name: "sc-form",
          renderColumns: this.renderColumns,
        },
      }).show(
        () => {
          console.log(this.form, "this.form");
          this.$message.success("确认");
        },
        () => {
          this.$message.success("取消");
        }
      );
    },
    renderDialog() {
      this.$scDialog({
        title: "render函数",
        width: "500px",
        render: (h, vm) => {
          return (
            <sc-form v-model={this.form} renderColumns={this.renderColumns} />
          );
        },
      }).show(
        () => {
          console.log(this.form, "this.form");
          this.$message.success("确认");
        },
        () => {
          this.$message.success("取消");
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
