---
name: sc-button
description: vue-super-crud 库组件。只要用户需要生成、编写、修改按钮、sc-button、确认框、下拉菜单按钮、防抖按钮、文本提交弹窗等，都必须立即使用本 skill。本 skill 负责 sc-button 的完整配置。
---

# sc-button 按钮组件

基于 `el-button` 的增强型按钮，所有 `el-button` 原生属性均可继续使用。

## 常用写法速查

```html
<!-- 基础 -->
<sc-button type="primary" @click="handleClick">操作</sc-button>

<!-- 确认框（点击后弹确认，确认后才触发 @click） -->
<sc-button type="danger" label="删除" confirm="确认删除吗？" @click="handleDelete" />

<!-- 确认框对象配置 -->
<sc-button
  type="warning"
  label="审核"
  :confirm="{ title: '提示', label: '确认通过吗？', confirmButtonText: '通过', cancelButtonText: '拒绝' }"
  @click="handleAudit"
/>

<!-- 下拉菜单（配置 children） -->
<sc-button
  type="primary"
  label="更多操作"
  :children="[
    { label: '编辑', onClick: handleEdit },
    { label: '删除', type: 'danger', confirm: '确认删除？', onClick: handleDelete },
  ]"
/>

<!-- 文本提交（点击后弹出带输入框的确认框，输入内容作为第二个参数传给 @click 回调） -->
<sc-button
  type="warning"
  label="驳回"
  :textSubmit="{ title: '驳回原因', label: '请填写驳回原因', required: true }"
  @click="handleReject"
/>
```

```js
// textSubmit 回调：第一个参数 cb 为完成回调，必须调用；第二个参数为用户输入内容
handleReject(cb, reason) {
  await api.reject({ reason })
  cb()  // 必须调用，否则按钮持续 loading
}
```

## 属性一览

| 属性 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| `type` | 按钮类型（同 el-button） | String | - |
| `label` | 按钮文本（也可用默认插槽） | String | - |
| `disabled` | 禁用 | Boolean | false |
| `hidden` | 隐藏 | Boolean | - |
| `time` | 防抖时间（ms） | Number | 300 |
| `confirm` | 确认框：`true`/字符串/对象 | Boolean/String/Object | - |
| `children` | 下拉菜单项数组 | Array | - |
| `textSubmit` | 文本提交配置 | Object | - |
