<template>
  <sc-position>
    <template #left>
      <el-button type="primary">左侧</el-button>
    </template>
    <template #right>
      <el-button type="primary">右侧</el-button>
    </template>
    <template #top>
      <el-button style="width: 100%;" type="primary">顶部</el-button>
    </template>
    <template #bottom>
      <el-button style="width: 100%;" type="primary">底部</el-button>
    </template>
    <el-input v-model="value" placeholder="请输入内容" />
  </sc-position>
</template>
<script>
export default {
  data() {
    return { value: "" };
  },
};
</script>
