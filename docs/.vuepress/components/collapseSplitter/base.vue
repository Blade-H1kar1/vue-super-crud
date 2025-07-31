<template>
  <div class="demo-container">
    <sc-collapse-splitter style="height: 300px">
      <sc-splitter-panel>
        <div class="panel-content panel-1">
          <h4>面板 1</h4>
        </div>
      </sc-splitter-panel>
      <sc-splitter-panel>
        <div class="panel-content panel-2">
          <h4>面板 2</h4>
        </div>
      </sc-splitter-panel>
      <sc-splitter-panel>
        <div class="panel-content panel-3">
          <h4>面板 3</h4>
        </div>
      </sc-splitter-panel>
    </sc-collapse-splitter>
  </div>
</template>

<script>
export default {
  name: "CollapseSplitterBase",
};
</script>

<style scoped>
.demo-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}

.panel-content {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.panel-1 {
  background: #667eea;
  color: white;
}

.panel-2 {
  background: #f5576c;
  color: white;
}

.panel-3 {
  background: #25ca99;
  color: white;
}

.panel-content h4 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.panel-content p {
  margin: 0 0 10px 0;
  line-height: 1.6;
}
</style>
