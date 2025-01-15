<template>
  <div>
    <sc-form v-model="form" :options="options"> </sc-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        sexValue: [],
      },
      options: {
        labelWidth: "150px",
        renderColumns: [
          {
            prop: "cascade",
            label: "级联数据格式化组件",
            dict: "cascade",
            comp: {
              name: "sc-cascade-format",
            },
          },
          {
            prop: "cascade",
            label: "级联组件",
            dict: "cascade",
            comp: {
              name: "el-cascader",
            },
          },
          {
            prop: "sexValue",
            label: " 值格式化标签组件",
            dict: "gender",
            comp: {
              name: "sc-value-format",
              color: "auto",
            },
          },
          {
            prop: "sexValue",
            label: "选择器",
            dict: "gender",
            comp: {
              name: "el-select",
              multiple: true,
            },
          },
          {
            prop: "sexValue",
            label: "开关组件",
            dict: "gender",
            comp: {
              name: "el-switch",
            },
          },
          {
            prop: "sexValue",
            label: "单选框组件",
            dict: "gender",
            comp: {
              name: "el-radio-group",
            },
          },
          {
            prop: "sexValue",
            label: "复选框组件",
            dict: "gender",
            comp: {
              name: "el-checkbox-group",
            },
          },
        ],
      },
    };
  },
  created() {},
  methods: {},
};
</script>
