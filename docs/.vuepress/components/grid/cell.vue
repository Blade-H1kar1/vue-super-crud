<template>
  <div class="grid-demo">
    <sc-grid :columns="4" :rows="3" :gap="10">
      <!-- 默认单元格 -->
      <sc-cell :center="true">
        <div class="grid-item">1x1</div>
      </sc-cell>
      
      <!-- 跨越2列 -->
      <sc-cell :width-size="2" :center="true">
        <div class="grid-item width-2">宽度为2</div>
      </sc-cell>
      
      <!-- 跨越1列 -->
      <sc-cell :center="true">
        <div class="grid-item">1x1</div>
      </sc-cell>
      
      <!-- 跨越2行 -->
      <sc-cell :height-size="2" :center="true">
        <div class="grid-item height-2">高度为2</div>
      </sc-cell>
      
      <!-- 跨越2列2行 -->
      <sc-cell :width-size="2" :height-size="2" :center="true">
        <div class="grid-item width-2 height-2">2x2</div>
      </sc-cell>
      
      <!-- 指定起始位置 -->
      <sc-cell :left="4" :top="3" :center="true">
        <div class="grid-item position">位置(4,3)</div>
      </sc-cell>
    </sc-grid>

    <p class="demo-desc">通过widthSize、heightSize、left和top属性控制单元格的大小和位置</p>
  </div>
</template>

<script>
export default {
  name: "GridCell"
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
  font-size: 16px;
  color: #606266;
}

.width-2 {
  background-color: #e1f3d8;
  color: #67c23a;
}

.height-2 {
  height: 170px;
  background-color: #fdf6ec;
  color: #e6a23c;
}

.width-2.height-2 {
  background-color: #f0f9eb;
  color: #409eff;
}

.position {
  background-color: #fef0f0;
  color: #f56c6c;
}

.demo-desc {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
}
</style>