<template>
  <sc-form v-model="form" :options="options"> </sc-form>
</template>

<script>
import customComVue from "./customCom.vue";

export default {
  data() {
    return {
      options: {
        renderColumns: [
          // 1. Select选择器示例
          {
            prop: "type",
            label: "下拉选择",
            comp: {
              name: "el-select",
              multiple: true,
              // 动态属性配置
              bind: (scope) => ({
                disabled: scope.row.status === "disabled",
              }),
              // 子组件配置
              children: [
                { name: "el-option", label: "类型1", value: "1" },
                { name: "el-option", label: "类型2", value: "2" },
              ],
              // 事件处理
              on: {
                change: (val, scope) => {
                  console.log("选择值:", val);
                  console.log("当前行:", scope.row);
                },
              },
            },
          },

          // 2. Input输入框示例
          {
            prop: "name",
            label: "输入框",
            comp: {
              name: "el-input",
              // 直接属性配置
              clearable: true,
              maxlength: 20,
              "show-word-limit": true,
              // 插槽配置
              slots: {
                prefix: () => <i class="el-icon-search" />,
                suffix: () => <i class="el-icon-date" />,
              },
              // 事件监听
              on: {
                input: (val, scope) => {
                  console.log("输入值:", val);
                },
                focus: (event, scope) => {
                  console.log("获得焦点");
                },
              },
            },
          },

          // 3. Radio单选组示例
          {
            prop: "gender",
            label: "单选组",
            comp: {
              name: "el-radio-group",
              // 动态生成选项
              children: (scope) => {
                const options = [
                  { label: "男", value: "male" },
                  { label: "女", value: "female" },
                ];
                return options.map((item) => ({
                  name: "el-radio",
                  label: item.value,
                  children: item.label,
                }));
              },
              // 组件挂载后的回调
              mounted: (scope, ref) => {
                console.log("单选组已挂载:", ref);
              },
            },
          },

          // 4. 自定义组件示例
          {
            prop: "custom",
            label: "自定义组件",
            comp: {
              name: customComVue,
              // 原生事件
              nativeOn: {
                click: () => {
                  console.log("点击自定义组件");
                },
              },
            },
          },

          // 5. 级联选择器示例
          {
            prop: "region",
            label: "地区选择",
            comp: {
              name: "el-cascader",
              // 属性配置
              options: [
                {
                  value: "zhejiang",
                  label: "浙江",
                  children: [
                    {
                      value: "hangzhou",
                      label: "杭州",
                    },
                  ],
                },
              ],
              // 条件属性
              bind: (scope) => ({
                disabled: !scope.row.type,
                placeholder: `请选择${scope.item.label}`,
              }),
              // 值变化事件
              on: {
                change: (value, scope) => {
                  console.log("选择的地区:", value);
                },
              },
            },
          },
        ],
      },
      // 表格数据
      form: {
        id: 1,
        type: ["1"],
        name: "测试数据",
        gender: "male",
        custom: "",
        region: ["zhejiang", "hangzhou"],
        status: "normal",
      },
    };
  },
};
</script>
