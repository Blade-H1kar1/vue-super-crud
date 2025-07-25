<template>
  <div class="grid-demo">
    <sc-grid :columns="3" :column-gap="20" :row-gap="20">
      <sc-cell v-for="i in 9" :key="i" :center="true">
        <div class="grid-item">{{ i }}</div>
      </sc-cell>
    </sc-grid>

    <p class="demo-desc">基础3列网格布局，列间距和行间距均为20px</p>
  </div>
</template>

<script>
export default {
  name: "GridBase",
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

.demo-desc {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
}
</style>
