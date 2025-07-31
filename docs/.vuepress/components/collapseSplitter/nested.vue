<template>
  <div class="demo-container">
    <sc-collapse-splitter style="height: 400px">
      <!-- 左侧面板 -->
      <sc-splitter-panel>
        <div class="panel-content panel-left">
          <h4>左侧导航</h4>
          <p>这是左侧导航面板</p>
          <p>可以放置菜单、工具栏等</p>
        </div>
      </sc-splitter-panel>

      <!-- 右侧嵌套分割 -->
      <sc-splitter-panel>
        <sc-collapse-splitter layout="vertical">
          <!-- 上方面板 -->
          <sc-splitter-panel>
            <div class="panel-content panel-top">
              <h4>主要内容区</h4>
              <p>这是主要的内容展示区域</p>
              <p>可以放置表格、图表等主要内容</p>
            </div>
          </sc-splitter-panel>

          <!-- 下方面板 -->
          <sc-splitter-panel>
            <sc-collapse-splitter>
              <!-- 下左面板 -->
              <sc-splitter-panel>
                <div class="panel-content panel-bottom-left">
                  <h4>下左面板</h4>
                </div>
              </sc-splitter-panel>

              <!-- 下右面板 -->
              <sc-splitter-panel>
                <div class="panel-content panel-bottom-right">
                  <h4>下右面板</h4>
                </div>
              </sc-splitter-panel>
            </sc-collapse-splitter>
          </sc-splitter-panel>
        </sc-collapse-splitter>
      </sc-splitter-panel>
    </sc-collapse-splitter>
  </div>
</template>

<script>
export default {
  name: "CollapseSplitterNested",
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
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.panel-left {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.panel-top {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.panel-bottom-left {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.panel-bottom-right {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.panel-content h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.panel-content p {
  margin: 0 0 8px 0;
  line-height: 1.5;
  font-size: 14px;
}
</style>
