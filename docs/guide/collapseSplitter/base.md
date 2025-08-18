# 基本使用

`CollapseSplitter` 是一个可折叠的分割面板组件。支持水平和垂直分割，适用于构建复杂的可折叠布局界面。

## 基本用法

<ClientOnly>
<common-code-format>
  <collapseSplitter-base slot="source"></collapseSplitter-base>
                  
  <<< @/docs/.vuepress/components/collapseSplitter/base.vue
</common-code-format>
</ClientOnly>

## 垂直分割

通过设置 `layout="vertical"` 可以创建垂直分割面板：

<ClientOnly>
<common-code-format>
  <collapseSplitter-vertical slot="source"></collapseSplitter-vertical>
                  
  <<< @/docs/.vuepress/components/collapseSplitter/vertical.vue
</common-code-format>
</ClientOnly>

## 嵌套折叠分割

支持嵌套使用，创建复杂的可折叠布局结构：

<ClientOnly>
<common-code-format>
  <collapseSplitter-nested slot="source"></collapseSplitter-nested>
                  
  <<< @/docs/.vuepress/components/collapseSplitter/nested.vue
</common-code-format>
</ClientOnly>

## 事件监听

<ClientOnly>
<common-code-format>
  <collapseSplitter-events slot="source"></collapseSplitter-events>
                  
  <<< @/docs/.vuepress/components/collapseSplitter/events.vue
</common-code-format>
</ClientOnly>

## 自定义折叠插槽

通过在 `sc-splitter-panel` 组件内定义插槽可以自定义折叠状态下的显示内容，提供更丰富的交互体验：

<ClientOnly>
<common-code-format>
  <collapseSplitter-slots slot="source"></collapseSplitter-slots>
                  
  <<< @/docs/.vuepress/components/collapseSplitter/slots.vue
</common-code-format>
</ClientOnly>

## API 文档

### CollapseSplitter 属性

| 属性名      | 说明         | 类型      | 默认值       |
| ----------- | ------------ | --------- | ------------ |
| layout      | 分割方向     | `String`  | 'horizontal' |
| gutterSize  | 分割线宽度   | `Number`  | 8            |
| gutterColor | 分割线颜色   | `String`  |              |
| disabled    | 是否禁用交互 | `Boolean` | false        |

### SplitterPanel 属性

| 属性名    | 说明               | 类型      | 默认值 |
| --------- | ------------------ | --------- | ------ |
| size      | 面板大小（百分比） | `Number`  | null   |
| collapsed | 面板是否折叠       | `Boolean` | false  |

### 事件

| 事件名              | 说明               | 参数                                                                                |
| ------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| panel-collapse      | 面板折叠时触发     | `{ index: Number, collapsed: Boolean, collapsedPanels: Array, panelStates: Array }` |
| panel-expand        | 面板展开时触发     | `{ index: Number, collapsed: Boolean, collapsedPanels: Array, panelStates: Array }` |
| all-panels-expanded | 所有面板展开时触发 | `{ collapsedPanels: Array }`                                                        |

### sc-splitter-panel 插槽

在 `sc-splitter-panel` 组件内可以定义以下插槽来自定义折叠状态：

| 插槽名           | 说明                                                   | 作用域参数 |
| ---------------- | ------------------------------------------------------ | ---------- |
| collapsed        | 完全自定义面板折叠状态下的显示内容，替换默认的折叠图标 | 无         |
| collapsed-append | 在默认折叠图标基础上追加内容，保留默认样式             | 无         |

### 方法

| 方法名          | 说明         | 参数            | 返回值  |
| --------------- | ------------ | --------------- | ------- |
| collapsePanel   | 折叠指定面板 | `index: Number` | -       |
| expandPanel     | 展开指定面板 | `index: Number` | -       |
| togglePanel     | 切换面板状态 | `index: Number` | -       |
| expandAllPanels | 展开所有面板 | -               | -       |
| getPanelStates  | 获取面板状态 | -               | `Array` |
