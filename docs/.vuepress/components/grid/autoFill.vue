<template>
  <div class="grid-demo">
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-group">
        <label>最小列宽 (px):</label>
        <el-slider
          v-model="columnWidth"
          :min="100"
          :max="300"
          :step="10"
          show-input
          :input-size="'small'"
        />
      </div>

      <div class="control-group">
        <label>单元格数量:</label>
        <el-slider
          v-model="cellCount"
          :min="4"
          :max="16"
          :step="1"
          show-input
          :input-size="'small'"
        />
      </div>
    </div>

    <!-- 网格展示区域 -->
    <div class="grid-container">
      <sc-grid :autoFill="true" :column-width="columnWidth" :gap="gap">
        <sc-cell v-for="i in cellCount" :key="i" :center="true">
          <div class="grid-item" :style="{ height: '60px' }">{{ i }}</div>
        </sc-cell>
      </sc-grid>
    </div>
  </div>
</template>

<script>
export default {
  name: "GridAutoFill",
  data() {
    return {
      autoFillMode: "autoFit",
      columnWidth: 150,
      gap: 20,
      cellCount: 8,
      cellHeight: 80,
    };
  },
  methods: {},
};
</script>

<style scoped>
@import "./common-styles.scss";

.control-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-group label {
  width: 120px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.control-group .el-slider {
  flex: 1;
  margin-right: 20px;
}

.control-group .el-select {
  flex: 1;
  margin-right: 20px;
}

.grid-item {
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #909399;
  transition: all 0.3s ease;
}

.grid-item:hover {
  background-color: #e1f3d8;
  color: #67c23a;
  transform: scale(1.05);
}

h4 {
  margin: 0 0 15px;
  font-size: 16px;
  color: #303133;
  padding: 10px;
  background: linear-gradient(90deg, #409eff, #67c23a);
  color: white;
  border-radius: 4px;
  text-align: center;
}

.demo-desc {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
  background: #f0f9ff;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
  line-height: 1.6;
}
</style>
