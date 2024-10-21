<template>
  <div>
    <el-button size="small" type="primary" @click="openDialog"
      >confirm 弹窗</el-button
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
          required: true,
        },
        {
          prop: "age",
          label: "年龄",
          required: true,
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
        render: () => (
          <sc-form
            ref="form"
            v-model={this.form}
            renderColumns={this.renderColumns}
          />
        ),
        confirm: async (cb) => {
          this.$message.success("确认之前校验表单");
          await this.$refs.form.validate();
          cb();
          console.log(this.form, "this.form");
          this.$message.success("确认");
        },
        cancel: async (cb) => {
          this.$message.error("取消之前");
          cb();
        },
      }).show();
    },
  },
};
</script>

<style lang="scss" scoped></style>
