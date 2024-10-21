<template>
  <div>
    <el-button size="small" type="primary" @click="openDialog">弹窗</el-button>
    <div v-insertSlot="dialogVm">
      <div v-show="form.radio">v-show</div>
      <div v-if="form.radio">v-if</div>
      <div v-for="item in form.sex" :key="item">{{ item }}</div>
      <sc-form v-model="form" :renderColumns="renderColumns"></sc-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        sex: [],
      },
      dialogVm: null,
    };
  },
  computed: {
    renderColumns() {
      return [
        {
          prop: "radio",
          label: "切换动态更新",
          comp: {
            name: "el-radio-group",
            options: [
              {
                label: "隐藏",
                value: "",
              },
              {
                label: "展示",
                value: "1",
              },
            ],
          },
        },
        {
          prop: "age",
          label: "年龄",
          hidden: this.form.radio,
        },
        {
          prop: "sex",
          label: "v-for",
          comp: {
            name: "el-checkbox-group",
            options: [
              {
                label: "1111",
                value: "1111",
              },
              {
                label: "2222",
                value: "2222",
              },
            ],
          },
        },
      ];
    },
  },
  methods: {
    openDialog() {
      this.dialogVm = this.$scDialog({
        title: "v-insertSlot弹窗",
        width: "500px",
      }).show();
    },
  },
};
</script>

<style lang="scss" scoped></style>
