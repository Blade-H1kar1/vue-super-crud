<template>
  <div class="collapse-splitter-demo">
    <div class="demo-container">
      <sc-collapse-splitter layout="vertical" style="height: 400px">
        <sc-splitter-panel>
          <div class="panel-content panel-top">
            <h4>上方面板</h4>
            <p>这是上方面板的内容</p>
            <p>垂直布局下点击分割线可以折叠上下面板</p>
          </div>
        </sc-splitter-panel>
        <sc-splitter-panel>
          <div class="panel-content panel-bottom">
            <h4>下方面板</h4>
            <p>这是下方面板的内容</p>
            <p>支持垂直方向的智能空间分配</p>
          </div>
        </sc-splitter-panel>
      </sc-collapse-splitter>
    </div>
  </div>
</template>

<script>
export default {
  name: "CollapseSplitterVertical",
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
  text-align: center;
}

.panel-top {
  background: #84fab0;
  color: white;
}

.panel-bottom {
  background: #a8edea;
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
