<template>
  <div>
    <div style="margin: 0 0 20px 40px;">
      <div>输入值：str2array-{{ data.strToArr }}</div>
    </div>
    <sc-form
      ref="form"
      :options="options"
      :loading.sync="loading"
      v-model="data"
      @submit="submit"
    >
    </sc-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
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
        strToArr: "1,2",
      },
    };
  },
  computed: {
    options() {
      return {
        action: {
          submit: {},
          reset: {},
        },
        columns: 2,
        columnGap: "10px",
        renderColumns: [
          {
            label: "字符转数组",
            prop: "strToArr",
            comp: {
              name: "sc-checkbox",
              options: this.dictData,
            },
            formatData: {
              formatValue: true,
              input: (value, { row }) => {
                if (!value) {
                  return [];
                }
                return typeof value === "string" ? value.split(",") : value;
              },
              output: (value, { row }) => {
                if (!value) {
                  return "";
                }
                return value.join(",");
              },
            },
          },
          {
            label: "字符转数组-快捷方式",
            prop: "strToArr",
            comp: {
              name: "sc-checkbox",
              options: this.dictData,
            },
            formatData: "strToArr",
          },
        ],
      };
    },
  },
  methods: {
    submit(cb, form) {
      setTimeout(() => {
        cb();
      }, 500);
    },
  },
};
</script>
