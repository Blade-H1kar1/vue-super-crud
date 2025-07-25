<template>
  <div class="grid-demo">
    <sc-grid
      :columns="3"
      :rows="3"
      :gap="10"
      :areas="[
        'header header header',
        'sidebar content content',
        'footer footer footer',
      ]"
    >
      <sc-cell area="header" :center="true">
        <div class="grid-item header">Header</div>
      </sc-cell>
      <sc-cell area="sidebar" :center="true">
        <div class="grid-item sidebar1">Sidebar</div>
      </sc-cell>
      <sc-cell area="content" :center="true">
        <div class="grid-item content">Content</div>
      </sc-cell>
      <sc-cell area="footer" :center="true">
        <div class="grid-item footer">Footer</div>
      </sc-cell>
    </sc-grid>

    <p class="demo-desc">
      通过areas属性定义命名的网格区域，配合Cell组件的area属性使用
    </p>
  </div>
</template>

<script>
export default {
  name: "GridAreas",
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
  font-size: 18px;
  color: #fff;
}

.header {
  background-color: #409eff;
}

.sidebar1 {
  background-color: #67c23a;
  height: 150px;
}

.content {
  background-color: #e6a23c;
  height: 150px;
}

.footer {
  background-color: #f56c6c;
}

.demo-desc {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
}
</style>
