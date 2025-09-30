<template>
  <div class="grid-demo">
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-group">
        <label>列数:</label>
        <el-slider
          v-model="columns"
          :min="1"
          :max="6"
          :step="1"
          show-input
          :input-size="'small'"
        />
      </div>

      <div class="control-group">
        <label>列间距 (px):</label>
        <el-slider
          v-model="columnGap"
          :min="0"
          :max="50"
          :step="5"
          show-input
          :input-size="'small'"
        />
      </div>

      <div class="control-group">
        <label>行间距 (px):</label>
        <el-slider
          v-model="rowGap"
          :min="0"
          :max="50"
          :step="5"
          show-input
          :input-size="'small'"
        />
      </div>
    </div>

    <!-- 网格展示区域 -->
    <div class="grid-container">
      <sc-grid :columns="columns" :column-gap="columnGap" :row-gap="rowGap">
        <sc-cell v-for="i in cellCount" :key="i" :center="true">
          <div class="grid-item" :style="{ height: '60px' }">
            {{ i }}
          </div>
        </sc-cell>
      </sc-grid>
    </div>

    <p class="demo-desc">
      基础网格布局示例 - 当前配置：{{ columns }}列，列间距{{
        columnGap
      }}px，行间距{{ rowGap }}px
    </p>
  </div>
</template>

<script>
export default {
  name: "GridBase",
  data() {
    return {
      columns: 3,
      columnWidth: 100,
      columnGap: 20,
      rowGap: 20,
      cellCount: 9,
      cellHeight: 80,
    };
  },
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

.demo-desc {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
  background: #f0f9ff;
  padding: 10px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}
</style>
