<template>
  <el-form :model="form" label-width="80px">
    <!-- 省份选择 -->
    <el-form-item label="省份">
      <el-select v-model="form.province" placeholder="请选择省份" clearable>
        <el-option
          v-for="item in $scDict.provinces"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <!-- 城市选择 -->
    <el-form-item label="城市">
      <el-select
        v-model="form.city"
        placeholder="请选择城市"
        :disabled="!form.province"
        clearable
      >
        <el-option
          v-for="item in $scDict.cities"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <!-- 显示选中结果 -->
    <el-form-item label="当前选择">
      <div class="selected-info">
        {{ selectedAddress }}
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { mockApi } from "../mock";
export default {
  data() {
    return {
      form: {
        province: "",
        city: "",
      },
    };
  },
  computed: {
    selectedAddress() {
      if (!this.form.province) return "未选择";
      const province = this.$scDict.provinces.findLabel(this.form.province);
      const city = this.$scDict.cities.findLabel(this.form.city);
      return city ? `${province} - ${city}` : province;
    },
  },
  created() {
    // 注册省份字典
    this.$scDict.register("provinces", {
      request: mockApi.getProvinces,
      immediate: true,
    });

    // 注册城市字典，使用函数形式的params监听省份变化
    this.$scDict.register("cities", {
      request: mockApi.getCities,
      // 监听省份变化，返回请求参数
      params: () => this.form.province,
    });
  },
  watch: {
    // 当省份改变时，清空城市选择
    "form.province"() {
      this.form.city = "";
    },
  },
};
</script>

<style scoped>
.selected-info {
  color: #409eff;
  font-weight: bold;
}
</style>
