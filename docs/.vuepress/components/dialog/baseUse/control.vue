<template>
  <div>
    <el-button size="small" type="primary" @click="openDialog">弹窗</el-button>
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
      const vm = this.$scDialog({
        title: "手动控制弹窗",
        width: "500px",
        render: (h) => {
          return (
            <div>
              <el-button
                onClick={() => vm.hide()}
                type="primary"
                style="margin-bottom: 20px;"
              >
                点击关闭弹窗
              </el-button>
              <el-button
                onClick={() => (vm.loading = true)}
                type="primary"
                style="margin-bottom: 20px;"
              >
                弹窗loading
              </el-button>
            </div>
          );
        },
      });
      vm.show(() => {
        this.$message.success("确认");
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
