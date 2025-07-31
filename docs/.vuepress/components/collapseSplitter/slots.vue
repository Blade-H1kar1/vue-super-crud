<template>
  <sc-collapse-splitter
    :panels="panels"
    direction="horizontal"
    :gutter-size="8"
    style="height: 300px; border: 1px solid #ddd"
  >
    <!-- 第一个面板：在panel组件内定义折叠插槽 -->
    <sc-splitter-panel :size="30">
      <div class="panel-content">
        <h4>面板 1</h4>
        <p>这是第一个面板的内容</p>
        <el-button type="primary" size="small">操作按钮</el-button>
      </div>

      <!-- 在panel组件内定义折叠状态的显示内容 -->
      <template #collapsed>
        <div class="custom-collapsed">
          <i class="el-icon-folder"></i>
          <span>展开 面板1</span>
        </div>
      </template>
      <template #collapsed-append>
        <div class="append-content">
          <el-badge :value="3" class="notification-badge">
            <i class="el-icon-message"></i>
          </el-badge>
        </div>
      </template>
    </sc-splitter-panel>

    <!-- 第二个面板：使用追加插槽 -->
    <sc-splitter-panel :size="70" :collapsed="true">
      <div class="panel-content">
        <h4>面板 2</h4>
        <p>这是第二个面板的内容，折叠时会显示默认图标加上追加内容</p>
        <el-tag type="success">重要内容</el-tag>
      </div>

      <!-- 在panel组件内定义追加内容 -->
      <template #collapsed-append>
        <div class="append-content">
          <el-badge :value="3" class="notification-badge">
            <i class="el-icon-message"></i>
          </el-badge>
        </div>
      </template>
    </sc-splitter-panel>
  </sc-collapse-splitter>
</template>

<script>
export default {
  name: "CollapseSplitterSlots",
};
</script>

<style scoped>
.panel-content {
  padding: 20px;
  height: 100%;
  border-radius: 4px;
}

.panel-content h4 {
  margin: 0 0 10px 0;
}

.panel-content p {
  margin: 0 0 15px 0;
  color: #666;
  line-height: 1.5;
}

.stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 10px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

/* 自定义折叠面板样式 */
.custom-collapsed-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-collapsed-panel:hover {
  background-color: rgba(64, 158, 255, 0.1);
}

.collapsed-text {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  writing-mode: vertical-lr;
  text-orientation: mixed;
}

.append-content {
  width: 25px;
}

.notification-badge {
  cursor: pointer;
}

.notification-badge i {
  font-size: 16px;
  color: #f56c6c;
  transition: color 0.3s ease;
}

.notification-badge:hover i {
  color: #f78989;
}
</style>
