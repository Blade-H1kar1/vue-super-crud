<template>
  <div>
    <el-button size="small" type="primary" @click="openDialog"
      >自定义底部按钮</el-button
    >
    <el-button size="small" type="primary" @click="openDialog1"
      >隐藏底部按钮</el-button
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
        footer: {
          align: "left",
          confirm: {
            label: "确认111",
            type: "primary",
          },
          cancel: false,
          handles: [
            {
              label: "自定义",
              type: "primary",
              onClick: (vm) => {
                vm.hide();
              },
            },
          ],
        },
      }).show();
    },
    openDialog1() {
      this.$scDialog({
        title: "弹窗",
        width: "500px",
        footer: {
          hidden: true,
        },
      }).show();
    },
  },
};
</script>

<style lang="scss" scoped></style>
