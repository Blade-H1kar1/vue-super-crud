<template>
  <div>
    <!-- 基础按钮 -->
    <sc-button @click="handleClick">基础</sc-button>

    <!-- 下拉菜单按钮 -->
    <sc-button
      type="primary"
      label="下拉按钮"
      :children="[
        {
          label: '编辑',
          onClick: handleClick,
        },
        {
          label: '删除',
          onClick: handleClick,
          confirm: true,
          type: 'danger',
        },
      ]"
    />

    <!-- 带输入框的提交 -->
    <sc-button
      type="warning"
      label="文本提交"
      :textSubmit="{
        title: '驳回原因',
        label: '驳回原因',
        rows: 4, // 默认值
        required: true, // 默认值
      }"
      @click="handleReject"
    />

    <!-- 带确认框的按钮 -->
    <sc-button
      type="danger"
      label="确认操作"
      confirm="确认操作"
      @click="handleClick"
    />

    <!-- 使用对象配置确认框 -->
    <sc-button
      type="warning"
      label="对象配置确认框"
      :confirm="{
        title: '对象配置确认框',
        label: '确定要执行此操作吗？',
        confirmButtonText: '通过',
        cancelButtonText: '拒绝',
        type: 'warning',
      }"
      @click="handleClick"
    />

    <!-- 带自定义确认框的按钮 -->
    <sc-button
      type="warning"
      label="自定义确认框"
      :customConfirm="{
        title: '自定义确认框',
        label: '确定要执行此操作吗？',
        content: renderContent,
      }"
      @click="handleClick"
    />
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      console.log("click");
    },
    handleReject(cb, reason) {
      console.log("驳回原因:", cb, reason);
      cb(); // 完成后调用回调
    },
    renderContent(h) {
      return <div>111</div>;
    },
  },
};
</script>
