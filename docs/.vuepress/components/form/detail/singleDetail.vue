<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-button @click="detail = !detail" size="small">切换模式</el-button>
      <el-tag>当前模式：{{ detail ? "详情" : "编辑" }}</el-tag>
    </div>
    <sc-form :options="options" v-model="data"> </sc-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: true,
      dictData: [
        {
          value: "1",
          label: "张三",
        },
        {
          value: "2",
          label: "李四",
        },
      ],

      data: {
        name: "张三",
        gender: "男",
        checkbox: ["1", "2"],
        select: "1",
      },
    };
  },
  computed: {
    options() {
      return {
        columns: 2,
        columnGap: "10px",
        renderColumns: [
          {
            label: "姓名",
            prop: "name",
          },
          {
            label: "性别",
            prop: "gender",
          },
          {
            label: "checkbox",
            prop: "checkbox",
            detail: this.detail,
            comp: {
              name: "sc-checkbox",
              options: this.dictData,
            },
          },
          {
            label: "select",
            prop: "select",
            detail: this.detail,
            comp: {
              name: "sc-select",
              options: this.dictData,
            },
          },
        ],
      };
    },
  },
};
</script>
