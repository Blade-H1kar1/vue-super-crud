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
@import "./common-styles.scss";
</style>
