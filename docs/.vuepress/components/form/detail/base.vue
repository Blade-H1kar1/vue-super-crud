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
        name: "张三张三张三张三张三张三张三",
        gender: "男",
        age: 25,
        birthday: "1998-05-15",
        email: "zhangsan@example.com",
        phone: "13800138000",
        isActive: true,
        salary: 8500.5,
        joinDate: "2023-01-15",
        address: "北京市朝阳区",
        checkbox: ["1", "2"],
        select: "1,2",
        rating: 4,
        description: "这是一个详细的描述信息，用于展示多行文本输入框的效果。",
      },
    };
  },
  computed: {
    options() {
      return {
        colon: true,
        detail: this.detail,
        layout: "grid",
        columns: 3,
        columnGap: "20px",
        rowGap: "15px",
        renderColumns: [
          {
            label: "姓名",
            prop: "name",
            comp: {
              name: "el-input",
              placeholder: "1111",
            },
            detail: {
              formatter: (row) => {
                return row.name;
              },
            },
          },
          {
            label: "性别",
            prop: "gender",
            comp: {
              name: "el-select",
              options: [
                { value: "男", label: "男" },
                { value: "女", label: "女" },
              ],
            },
          },
          {
            label: "年龄",
            prop: "age",
            comp: {
              name: "el-input-number",
              min: 0,
              max: 120,
            },
          },
          {
            label: "生日",
            prop: "birthday",
            comp: {
              name: "el-date-picker",
              type: "date",
              format: "yyyy-MM-dd",
              "value-format": "yyyy-MM-dd",
            },
          },
          {
            label: "邮箱",
            prop: "email",
            comp: {
              name: "el-input",
              type: "email",
              placeholder: "请输入邮箱地址",
            },
          },
          {
            label: "手机号",
            prop: "phone",
            comp: {
              name: "el-input",
              placeholder: "请输入手机号",
            },
          },
          {
            label: "是否激活",
            prop: "isActive",
            comp: {
              name: "el-switch",
            },
          },
          {
            label: "薪资",
            prop: "salary",
            comp: {
              name: "el-input-number",
              precision: 2,
              step: 100,
              min: 0,
            },
          },
          {
            label: "入职日期",
            prop: "joinDate",
            comp: {
              name: "el-date-picker",
              type: "date",
              format: "yyyy-MM-dd",
              "value-format": "yyyy-MM-dd",
            },
          },
          {
            label: "多选框",
            prop: "checkbox",
            comp: {
              name: "sc-checkbox",
              options: this.dictData,
            },
          },
          {
            label: "下拉选择",
            prop: "select",
            comp: {
              name: "sc-select",
              multiple: true,
              options: this.dictData,
            },
            detail: {
              comp: {
                name: "sc-value-format",
                options: this.dictData,
              },
            },
          },
          {
            label: "评分",
            prop: "rating",
            comp: {
              name: "el-rate",
              max: 5,
              "show-text": true,
            },
          },
          {
            label: "描述",
            prop: "description",
            widthSize: 3,
            comp: {
              name: "el-input",
              type: "textarea",
              rows: 3,
              placeholder: "请输入描述信息",
            },
          },
        ],
      };
    },
  },
};
</script>
