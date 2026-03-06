---
name: sc-tabs
description: vue-super-crud 库组件。当用户需要使用标签页、sc-tabs 组件，或涉及 tab 切换、标签页缓存、刷新、全部标签时使用。
---

# sc-tabs 标签页组件

基于 `el-tabs` 的增强型标签组件，继承所有 `el-tabs` 原生属性。核心增强：未激活的标签页不渲染（lazy）、切换后缓存内容、支持刷新、支持"全部"标签。

## 快速写法速查

```html
<sc-tabs
  v-model="activeTab"
  :tab-list="tabList"
  type="card"
  refresh
  all
  @tab-click="handleTabClick"
>
  <!-- 插槽名 = tabList[n].name -->
  <template #tab1>
    <div>标签1内容</div>
  </template>

  <!-- 自定义标签头：插槽名 = name + "-label"，作用域参数为 tabList 项 -->
  <template #tab2-label="scope">
    <i class="el-icon-date"></i> {{ scope.label }}
  </template>

  <template #tab2>
    <div>标签2内容</div>
  </template>
</sc-tabs>
```

```js
data() {
  return {
    activeTab: "tab1",
    tabList: [
      { label: "标签1", name: "tab1", icon: "el-icon-date", cache: true },
      { label: "标签2", name: "tab2" },
      // 内容也可以直接写在 tabList 的 render 函数里（不用插槽）
      { label: "标签3", name: "tab3", render: () => <div>标签3内容</div> },
    ],
  }
},
methods: {
  // tab-click 回调：第一个参数是 el-tabs 的 tab 对象，第二个是 tabList 对应项
  handleTabClick(tab, item) {}
}
```

## tabList 配置项

| 字段 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| `name` | 标签唯一标识（插槽名依据此字段） | String | - |
| `label` | 标签显示文本 | String | - |
| `icon` | 标签头图标 class | String | - |
| `cache` | 单独控制该标签是否缓存（覆盖全局 cache） | Boolean | 继承全局 |
| `render` | 标签内容渲染函数（与插槽二选一） | Function | - |

## 属性一览

| 属性 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| `v-model` | 当前激活的标签 name | String/Number | - |
| `tabList` | 标签配置列表 | Array | [] |
| `cache` | 全局缓存：切换后保留已渲染的标签内容 | Boolean | true |
| `lazy` | 懒加载：未激活的标签不渲染 | Boolean | true |
| `refresh` | 显示刷新按钮（仅 cache 开启时有效） | Boolean | false |
| `all` | 显示"全部"标签；传对象可自定义 `{ label, name }` | Boolean/Object | false |
| `border` | 显示边框样式 | Boolean | false |
| `cacheActive` | 激活的标签 name 记录到路由 query，刷新页面后自动恢复 | Boolean | true |

## 关键规则

1. **插槽名 = `tabList[n].name`**，内容插槽写 `#tab1`，标签头插槽写 `#tab1-label`
2. **`cache: true`（默认）** 切换后已激活的标签不销毁；`cache: false` 则每次切换都重新渲染
3. **`lazy: true`（默认）** 未激活的标签不渲染，首次激活后才创建；`lazy: false` 则一次性渲染全部
4. **`refresh` 需配合 `cache: true`** 才显示刷新按钮；点击后清除缓存重新渲染该标签，同时触发 `@refresh(item, index)`
5. **`all` 标签**激活时 `v-model` 值为 `allConfig.name`（默认 `null`），可用于"全部"筛选场景
