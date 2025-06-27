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