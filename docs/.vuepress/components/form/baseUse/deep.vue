<template>
  <div>
    <el-button
      type="primary"
      size="small"
      @click="data.deep.deep.name = '改变deep值'"
      >改变deep值</el-button
    >
    <el-button type="primary" size="small" @click="data.name = '改变name值'"
      >改变name值</el-button
    >
    {{ data }}
    <sc-form :options="options" v-model="data"> </sc-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
        deep: {
          deep: {
            name: "deep",
          },
        },
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
            deepProp: "deep.deep.name",
          },
        ],
      };
    },
  },
};
</script>
