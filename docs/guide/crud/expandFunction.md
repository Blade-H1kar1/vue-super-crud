# 扩展功能

## 持久化拖动列宽

`persistWidth:true` 开启后，用户拖动表格列宽的设置会自动保存到本地缓存，下次进入页面时自动恢复，无需重复调整。


## 持久化每页条数

`persistPageSize:true` 开启后，分页组件支持将用户选择的每页条数自动保存，下次进入页面时自动恢复。

## 分页滚动位置记忆

切换分页时自动记忆并恢复每页的滚动位置(临时储存)，提升用户体验。

```js 
const crudOptions = {
  pagination: {
    memorizeScroll: true, // 开启分页滚动位置记忆
  },
};
```

## 设置组件级存储

`stateKey` 配置项用于设置组件级存储的键名，默认为路由级存储。

::: tip
组件级存储: 每个组件都有自己的存储，互不干扰。</br>
路由级存储: 多个组件共享同一个配置对象，会相互干扰。
:::

```js 
const crudOptions = {
  stateKey: 'myCrudState',
};
```
