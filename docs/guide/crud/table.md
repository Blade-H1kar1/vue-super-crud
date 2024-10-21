# 表格配置

## 自定义表格配置

既可以在`crud组件`上配置表格额外参数和事件，也可以在`options.[xx]`对象属性上配置（具体参考el-table）


<common-code-format>
  <crud-table-customTable slot="source"></crud-table-customTable>
  
<<< @/docs/.vuepress/components/crud/table/customTable.vue
</common-code-format>

## 表格高度与嵌套表头

`height`、`maxHeight` 设置为`auto`，会自适应窗口高度，配合calcHeight 自定义调节范围 </br>
`calcHeight` 减去的底部高度 </br>
`children` 多级嵌套表头

<common-code-format>
  <crud-table-height slot="source"></crud-table-height>
  
<<< @/docs/.vuepress/components/crud/table/height.vue
</common-code-format>

## 索引列、展开列

`index` 索引列，值为对象时自定义属性 </br>
`expand` 展开列

<common-code-format>
  <crud-table-1 slot="source"></crud-table-1>
  
<<< @/docs/.vuepress/components/crud/table/1.vue
</common-code-format>

## 选择列

`selection` 选择列 </br>
`selection.ctrlSelect` 按下ctrl键点击整行选中（默认启用） </br>
`selection.shiftSelect` 按下shift键批量多选（默认启用）

<common-code-format>
  <crud-table-selection slot="source"></crud-table-selection>
  
<<< @/docs/.vuepress/components/crud/table/selection.vue
</common-code-format>

## 列宽度

`calcColumnWidth` 配置列宽度自动计算规则 </br>
`column.width`、`column.minWidth` 设置为`auto`，会自适应列宽度 </br>
`column.widthType...` 独立配置列宽度自动计算规则

<common-code-format>
  <crud-table-2 slot="source"></crud-table-2>
  
<<< @/docs/.vuepress/components/crud/table/2.vue
</common-code-format>

## 操作列

`action` 操作列配置，值为`false`则隐藏 </br>
`action.width`、`action.minWidth` 设置为`auto`，会自适应列宽度 </br>

<common-code-format>
  <crud-table-columnAction slot="source"></crud-table-columnAction>
  
<<< @/docs/.vuepress/components/crud/table/columnAction.vue
</common-code-format>

## 组件加载

`loading` 外部控制加载状态，支持`.sync`双向绑定</br>
`disableLoading` 禁用组件内部控制加载状态 </br>
`loadingText` 自定义加载文本 </br>
`loadingSpinner` 自定义加载图标 </br>
`loadingBackground` 自定义加载背景颜色

<common-code-format>
  <crud-table-loading slot="source"></crud-table-loading>
  
<<< @/docs/.vuepress/components/crud/table/loading.vue
</common-code-format>