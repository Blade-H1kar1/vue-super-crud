<template>
  <sc-step-form v-model="formData" :steps="steps">
    <!-- 自定义第一步的导航按钮 -->
    <template v-slot:step-footer-0="{ next }">
      <el-button type="primary" @click="next">
        前往下一步 <i class="el-icon-arrow-right"></i>
      </el-button>
    </template>

    <!-- 在第二步导航按钮左侧添加内容 -->
    <template v-slot:step-footer-1-left="{ prev }">
      <el-button plain @click="prev">
        <i class="el-icon-arrow-left"></i> 返回
      </el-button>
    </template>

    <!-- 在第二步导航按钮右侧添加内容 -->
    <template v-slot:step-footer-1-right="{ next }">
      <el-button type="primary" @click="next">
        继续 <i class="el-icon-arrow-right"></i>
      </el-button>
    </template>
  </sc-step-form>
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      steps: [
        {
          title: "基本信息",
          prop: "basicInfo",
          columns: [
            { prop: "name", label: "姓名", comp: { name: "el-input" } },
            { prop: "age", label: "年龄", comp: { name: "el-input-number" } },
          ],
        },
        {
          title: "联系方式",
          prop: "contact",
          columns: [
            { prop: "phone", label: "手机号", comp: { name: "el-input" } },
            { prop: "email", label: "邮箱", comp: { name: "el-input" } },
          ],
        },
        {
          title: "确认信息",
          prop: "confirm",
          columns: [
            {
              prop: "agree",
              label: "同意协议",
              comp: { name: "el-checkbox" },
            },
          ],
        },
      ],
    };
  },
};
</script>
