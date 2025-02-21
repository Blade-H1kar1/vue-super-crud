<template>
  <div v-if="isMounted">
    <sc-form v-model="form" :options="options">
      <template #defaultDict>
        <el-select v-model="form.defaultDict">
          <el-option
            v-for="item in $scDict.gender"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template #normalDict>
        <el-select v-model="form.normalDict">
          <el-option
            v-for="item in $scDict.countries"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
    </sc-form>

    <!-- 展示标签文本 -->
    <p>
      使用增强方法 findLabel 获取标签：{{
        $scDict.countries.findLabel(form.normalDict)
      }}
    </p>
    <p>
      使用增强方法 getOption 获取完整对象：{{
        $scDict.countries.getOption(form.normalDict)
      }}
    </p>
  </div>
</template>

<script>
import { mockApi } from "../mock";
export default {
  data() {
    return {
      form: {},
      tableData: [],
      isMounted: false,
      options: {
        renderColumns: [
          {
            label: "默认字典",
            prop: "defaultDict",
          },
          {
            label: "普通注册字典",
            prop: "normalDict",
          },
        ],
      },
    };
  },
  mounted() {
    this.isMounted = true;
    this.$scDict.register("countries", {
      request: mockApi.getProvinces,
    });
    this.$scDict.countries.wait().then((res) => {
      console.log("字典加载完成", res);
    });
  },
};
</script>
