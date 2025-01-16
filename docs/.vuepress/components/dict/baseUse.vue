<template>
  <div v-if="isMounted">
    <el-select v-model="form.country">
      <el-option
        v-for="item in $scDict.countries"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <!-- 展示标签文本 -->
    <p>国家：{{ $scDict.countries.findLabel(form.country) }}</p>
    <p>完整对象：{{ $scDict.countries.getOption(form.country) }}</p>
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
