<template>
  <div class="demo-container">
    <sc-collapse-splitter
      ref="collapseSplitter"
      style="height: 300px"
      @panel-collapse="onPanelCollapse"
      @panel-expand="onPanelExpand"
      @all-panels-expanded="onAllPanelsExpanded"
    >
      <sc-splitter-panel>
        <div class="panel-content panel-left">
          <h4>面板 A</h4>
          <p>左侧面板内容</p>
          <p>折叠/展开操作会触发相应事件</p>
        </div>
      </sc-splitter-panel>
      <sc-splitter-panel>
        <div class="panel-content panel-center">
          <h4>面板 B</h4>
          <p>中间面板内容</p>
          <p>查看右侧事件日志</p>
        </div>
      </sc-splitter-panel>
      <sc-splitter-panel>
        <div class="panel-content panel-right">
          <h4>面板 C</h4>
          <p>右侧面板内容</p>
          <p>所有事件都会被记录</p>
        </div>
      </sc-splitter-panel>
    </sc-collapse-splitter>
  </div>
</template>

<script>
export default {
  name: "CollapseSplitterEvents",
  data() {
    return {};
  },
  methods: {
    onPanelCollapse(event) {
      console.log("onPanelCollapse", event);
    },
    onPanelExpand(event) {
      console.log("onPanelExpand", event);
    },
    onAllPanelsExpanded(event) {
      console.log("onAllPanelsExpanded", event);
    },
  },
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

.panel-left {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.panel-center {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.panel-right {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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
