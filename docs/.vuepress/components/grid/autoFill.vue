<template>
  <div class="grid-demo">
    <!-- 自动填充模式 -->
    <h4>自动填充模式 (autoFill="autoFill")</h4>
    <sc-grid autoFill="autoFill" :column-width="150" :gap="20">
      <sc-cell v-for="i in 8" :key="i" :center="true">
        <div class="grid-item">{{ i }}</div>
      </sc-cell>
    </sc-grid>

    <!-- 自动适应模式 -->
    <h4>自动适应模式 (autoFill="autoFit")</h4>
    <sc-grid autoFill="autoFit" :column-width="150" :gap="20">
      <sc-cell v-for="i in 8" :key="i" :center="true">
        <div class="grid-item">{{ i }}</div>
      </sc-cell>
    </sc-grid>

    <!-- 固定宽度模式 -->
    <h4>固定宽度模式 (autoFill="fixedWidth")</h4>
    <sc-grid autoFill="fixedWidth" :column-width="150" :gap="20">
      <sc-cell v-for="i in 8" :key="i" :center="true">
        <div class="grid-item">{{ i }}</div>
      </sc-cell>
    </sc-grid>

    <p class="demo-desc">
      自动填充模式下，根据容器宽度和设置的列宽自动计算列数
    </p>
  </div>
</template>

<script>
export default {
  name: "GridAutoFill",
};
</script>

<style scoped>
.grid-demo {
  width: 100%;
  margin-bottom: 20px;
}

.grid-item {
  height: 80px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #909399;
}

h4 {
  margin: 20px 0 10px;
  font-size: 16px;
  color: #303133;
}

.demo-desc {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
}
</style>
