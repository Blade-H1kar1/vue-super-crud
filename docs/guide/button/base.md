# 基本使用

## 概述

基于 el-button 的增强型按钮组件，提供了防抖、确认框、下拉菜单等多种交互功能。

## 示例

<ClientOnly>
<common-code-format>
  <button-base slot="source"></button-base>
  
<<< @/docs/.vuepress/components/button/base.vue
</common-code-format>
</ClientOnly>

## API

| 属性          | 说明             | 类型                  | 默认值 |
| ------------- | ---------------- | --------------------- | ------ |
| type          | 按钮类型         | String                | -      |
| size          | 按钮大小         | String                | mini   |
| disabled      | 是否禁用         | Boolean               | false  |
| label         | 按钮文本         | String                | -      |
| hidden        | 是否隐藏         | Boolean               | -      |
| show          | 是否显示         | Boolean               | -      |
| children      | 下拉菜单项       | Array                 | -      |
| time          | 防抖时间(ms)     | Number                | 300    |
| confirm       | 确认框配置       | Boolean/String/Object | -      |
| customConfirm | 自定义确认框配置 | Object                | -      |
| textSubmit    | 文本提交配置     | Object                | -      |
