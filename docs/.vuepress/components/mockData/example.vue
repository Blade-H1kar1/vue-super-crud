<template>
  <div>
    <h3>表单</h3>
    <sc-form v-model="form" :options="options"> </sc-form>
    <h3 style="margin-top: 20px;">表格</h3>
    <sc-crud :data.sync="data" :options="crudOptions"> </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        multiSelect: [],
        daterange: [],
        checkbox: [],
        cascader: [],
        transfer: [],
      },
      data: [
        {
          id: 1,
          input: "",
          select: "",
        },
        {
          id: 2,
          input: "",
          select: "",
        },
        {
          id: 3,
          input: "",
          select: "",
        },
        {
          id: 4,
          input: "",
          select: "",
        },
      ],
    };
  },
  computed: {
    options() {
      return {
        renderColumns: [
          // 1. 输入框类
          {
            prop: "input",
            label: "普通输入框",
            comp: {
              name: "el-input",
              maxlength: 20,
              "show-word-limit": true,
            },
          },
          {
            prop: "input2",
            label: "校验规则生成",
            rules: ["email"],
          },
          {
            prop: "textarea",
            label: "文本域",
            comp: {
              name: "el-input",
              type: "textarea",
              rows: 3,
              placeholder: "请输入多行文本",
            },
          },
          {
            prop: "number",
            label: "数字输入框",
            comp: {
              name: "el-input-number",
              min: 0,
              max: 100,
              step: 1,
            },
          },

          // 2. 选择器类
          {
            prop: "select",
            label: "下拉选择",
            comp: {
              name: "el-select",
              options: [
                { label: "选项1", value: "1" },
                { label: "选项2", value: "2" },
                { label: "选项3", value: "3" },
                { label: "选项4", value: "4" },
              ],
            },
          },
          {
            prop: "multiSelect",
            label: "多选选择器",
            comp: {
              name: "el-select",
              multiple: true,
              options: [
                { label: "选项A", value: "A" },
                { label: "选项B", value: "B" },
                { label: "选项C", value: "C" },
                { label: "选项D", value: "D" },
              ],
            },
          },

          // 3. 日期时间类
          {
            prop: "date",
            label: "日期选择",
            comp: {
              name: "el-date-picker",
              type: "date",
              valueFormat: "yyyy-MM-dd",
            },
          },
          {
            prop: "daterange",
            label: "日期范围",
            comp: {
              name: "el-date-picker",
              type: "daterange",
              startPlaceholder: "开始日期",
              endPlaceholder: "结束日期",
              valueFormat: "yyyy-MM-dd",
            },
          },
          {
            prop: "time",
            label: "时间选择",
            comp: {
              name: "el-time-picker",
              valueFormat: "HH:mm:ss",
            },
          },

          // 4. 单选复选类
          {
            prop: "radio",
            label: "单选组",
            comp: {
              name: "el-radio-group",
              options: [
                { label: "选项1", value: "1" },
                { label: "选项2", value: "2" },
                { label: "选项3", value: "3" },
                { label: "选项4", value: "4" },
              ],
            },
          },
          {
            prop: "checkbox",
            label: "复选框组",
            comp: {
              name: "el-checkbox-group",
              options: [
                { label: "选项A", value: "A" },
                { label: "选项B", value: "B" },
                { label: "选项C", value: "C" },
                { label: "选项D", value: "D" },
              ],
            },
          },

          // 5. 级联选择器
          {
            prop: "cascader",
            label: "级联选择",
            comp: {
              name: "el-cascader",
              options: [
                {
                  value: "1",
                  label: "一级1",
                  children: [
                    { value: "1-1", label: "二级1-1" },
                    { value: "1-2", label: "二级1-2" },
                  ],
                },
                {
                  value: "2",
                  label: "一级2",
                  children: [
                    { value: "2-1", label: "二级2-1" },
                    { value: "2-2", label: "二级2-2" },
                  ],
                },
              ],
            },
          },

          // 6. 开关、滑块、评分类
          {
            prop: "switch",
            label: "开关",
            comp: {
              name: "el-switch",
              "active-text": "开启",
              "inactive-text": "关闭",
            },
          },
          {
            prop: "slider",
            label: "滑块",
            comp: {
              name: "el-slider",
              min: 0,
              max: 100,
              step: 10,
              "show-stops": true,
            },
          },
          {
            prop: "rate",
            label: "评分",
            comp: {
              name: "el-rate",
              max: 5,
              "allow-half": true,
              "show-text": true,
            },
          },

          // 7. 穿梭框
          {
            prop: "transfer",
            label: "穿梭框",
            comp: {
              name: "el-transfer",
              data: [
                { key: 1, label: "选项1" },
                { key: 2, label: "选项2" },
                { key: 3, label: "选项3" },
              ],
              titles: ["待选列表", "已选列表"],
            },
          },
        ],
      };
    },
    crudOptions() {
      return {
        toolbar: false,
        renderColumns: [
          {
            prop: "id",
            label: "用户id",
            isEdit: false,
          },
          {
            prop: "input",
            label: "名称",
            isEdit: true,
            form: {
              comp: {
                name: "el-input",
                maxlength: 20,
                "show-word-limit": true,
              },
            },
          },
          {
            prop: "select",
            label: "选择1",
            isEdit: true,
            form: {
              comp: {
                name: "el-select",
                options: [
                  { label: "选项1", value: "1" },
                  { label: "选项2", value: "2" },
                  { label: "选项3", value: "3" },
                  { label: "选项4", value: "4" },
                ],
              },
            },
          },
        ],
      };
    },
  },
};
</script>
