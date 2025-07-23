# 表格选中

## 概述

表格选中分为单选和多选，通过 `selected` 响应式绑定选中数据。

表格选中功能支持以下特性：

- 单选和多选模式
- 跨分页选中
- 键盘操作（Ctrl、Shift、Alt）
- 选中数据同步


## 跨分页选中

`selected` 绑定响应式选中数据，存在数据时会自动选中 </br>
`selection` 开启表格多选选中 </br>
`selection.reserveSelection` 开启数据更新时保持选中状态 </br>

<ClientOnly>
<common-code-format>
  <crud-selection-pagination slot="source"></crud-selection-pagination>
  
<<< @/docs/.vuepress/components/crud/selection/pagination.vue
</common-code-format>
</ClientOnly> 

## 选中事件

`@selection-change` 选中项发生变化时触发 </br>
`@select` 用户手动选择/取消选择某一行时触发 </br>
`@select-all` 用户手动选择/取消选择所有行时触发

<ClientOnly>
<common-code-format>
  <crud-selection-events slot="source"></crud-selection-events>
  
<<< @/docs/.vuepress/components/crud/selection/events.vue
</common-code-format>
</ClientOnly>


## 单选

`selected` 绑定响应式选中数据，存在数据时会自动选中 </br>
`singleSelection` 开启单选模式 </br>

<ClientOnly>
<common-code-format>
  <crud-selection-singleSelection slot="source"></crud-selection-singleSelection>
  
<<< @/docs/.vuepress/components/crud/selection/singleSelection.vue
</common-code-format>
</ClientOnly> 


## 数据同步

当 `selected` 数组与表格数据不一致时，可以通过 `dataSyncSelected` 参数控制数据同步方向：

- 当 `dataSyncSelected` 为 `true` 时，表格会将 `selected` 数组中的数据同步到表格数据中（`selected` → `data`）
- 当 `dataSyncSelected` 为 `false` 时（默认值），表格会将 `data` 数组中的数据同步到 `selected` 数组中（`data` → `selected`）

### 应用场景

- 选中数据包含表格中不显示的字段
- 选中数据需要在分页切换后保持一致
- 选中数据被外部修改后需要同步到表格中

<ClientOnly>
<common-code-format>
  <crud-selection-dataSyncSelected slot="source"></crud-selection-dataSyncSelected>
  
<<< @/docs/.vuepress/components/crud/selection/dataSyncSelected.vue
</common-code-format>
</ClientOnly>

## selection 配置项

| 参数             | 说明                      | 类型                 | 默认值 |
| ---------------- | ------------------------- | -------------------- | ------ |
| reserveSelection | 是否启用分页选中          | boolean              | false  |
| selectable       | 是否可以勾选              | Function(row, index) | -      |
| banner           | 是否显示选中项横幅        | boolean              | false  |
| ctrlSelect       | 是否启用 Ctrl 键点击选中  | boolean              | true   |
| shiftSelect      | 是否启用 Shift 键批量选中 | boolean              | true   |
| maxDisplay       | 直接显示的最大数量        | number               | 3      |
| labelKey         | 显示的字段名              | string               | 'id'   |
| clear            | 是否显示清除按钮          | boolean              | true   |
| dataSyncSelected | 控制数据同步方向          | boolean              | false  |


## singleSelection 配置项

| 参数       | 说明                     | 类型                 | 默认值 |
| ---------- | ------------------------ | -------------------- | ------ |
| selectable | 是否可以勾选             | Function(row, index) | -      |
| banner     | 是否显示选中项横幅       | boolean              | false  |
| ctrlSelect | 是否启用 Ctrl 键点击选中 | boolean              | true   |
| labelKey   | 显示的字段名             | string               | 'id'   |
| clear      | 是否显示清除按钮         | boolean              | true   |