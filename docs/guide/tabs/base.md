# 基本使用

## 概述

基于 el-tabs 的增强型标签组件，提供了更丰富的功能，包括标签页未激活时不渲染、缓存、刷新、过渡动画等特性。

## 示例

<ClientOnly>
<common-code-format>
  <tabs-base slot="source"></tabs-base>
  
<<< @/docs/.vuepress/components/tabs/base.vue
</common-code-format>
</ClientOnly>

## API

| 属性名        | 类型           | 默认值 | 说明                         |
| ------------- | -------------- | ------ | ---------------------------- |
| value/v-model | String/Number  | -      | 当前激活的标签页名称         |
| tab-list      | Array          | []     | 标签页配置列表               |
| cache         | Boolean        | true   | 是否缓存标签页内容           |
| all           | Boolean/Object | false  | 是否显示"全部"标签页         |
| border        | Boolean        | false  | 是否显示边框样式             |
| cacheActive   | Boolean        | true   | 是否在路由中缓存激活的标签页 |
| refresh       | Boolean        | false  | 是否显示刷新按钮             |

## tabList 配置项

```js
[
  {
    label: '标签名称',      // 显示的标签文本
    name: 'tabName',       // 标签的唯一标识
    icon: 'el-icon-date',  // 可选，标签页图标
    cache: true,           // 可选，是否缓存该标签页内容
    render: () => { },     // 可选，render函数自定义标签页内容
  }
]
```

## 事件

| 事件名    | 说明               | 回调参数       |
| --------- | ------------------ | -------------- |
| tab-click | 标签页被点击时触发 | 被点击的标签页 |
| refresh   | 刷新标签页时触发   | （tab，index） |

## 特性说明

1. 标签页未激活时不渲染 + 标签页缓存

   v-if与v-show的结合使用，未激活时不会渲染，激活时会渲染

   默认开启缓存功能，切换标签页不会销毁内容

2. 路由缓存

   启用cacheActive后，激活的标签页会被记录在路由query中

   刷新页面后会自动恢复到之前激活的标签页
   