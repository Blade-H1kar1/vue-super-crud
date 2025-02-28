<template>
  <div>
    <sc-form v-model="form" :options="options" />

    <!-- 格式化前后的值对比 -->
    <div>
      <h3>格式化数据展示：</h3>

      <div style="margin-bottom: 20px;">
        <div>省市区对象转数组：</div>
        <div>
          <div>原始值三个字段：{{ JSON.stringify(form.address) }}</div>
          <div>格式化后：{{ form.$address }}</div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div>字符串转数组：</div>
        <div>
          <div>原始值：{{ form.tags }}</div>
          <div>格式化后：{{ form.$tags }}</div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div>数字格式化：</div>
        <div>
          <div>原始值：{{ form.price }}</div>
          <div>格式化后：{{ form.$price }}</div>
        </div>
      </div>

      <div>
        <div>自定义：</div>
        <div>
          <div>原始值：{{ form.custom }}</div>
          <div>格式化后：{{ form.$custom }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cityTreeData } from "../mock";
import { pick } from "lodash-es";
export default {
  data() {
    return {
      pick,
      form: {
        address: {
          province: "浙江",
          city: "杭州",
          district: "西湖区",
        },
        tags: "前端,Vue,React",
        price: 1234.56,
        custom: "123",
      },
      options: {
        labelWidth: "160px",
        renderColumns: [
          {
            label: "省市区对象转数组",
            prop: "address",
            required: true,
            validateProp: "address.province",
            formatData: {
              type: "multiPropToArr",
              isObject: true,
              multiProp: ["province", "city", "district"],
              formatValue: true, // 开启格式化值存储
            },
            comp: {
              name: "el-cascader",
              options: cityTreeData, // 省市区选项数据
            },
          },
          {
            label: "字符串转数组",
            prop: "tags",
            formatData: {
              type: "strToArr",
              formatValue: true,
            },
            comp: {
              name: "el-select",
              multiple: true,
              options: [
                { label: "前端", value: "前端" },
                { label: "Vue", value: "Vue" },
                { label: "React", value: "React" },
              ],
            },
          },
          {
            label: "数字格式化",
            prop: "price",
            formatData: {
              type: "numberFormat",
              precision: 2,
              prefix: "¥",
              formatValue: true,
            },
            comp: {
              name: "el-input",
            },
          },
          {
            label: "自定义格式化",
            prop: "custom",
            formatData: {
              input: (value) => {
                return value + "--custom";
              },
              output: (value) => {
                return value.replace("--custom", "");
              },
              formatValue: true,
            },
            comp: {
              name: "el-input",
            },
          },
        ],
      },
    };
  },
};
</script>
