# 基本使用

## 基本使用

`@getList` 获取表格数据 </br>
`init` 初始化是否立即调用 getList（默认为 true） </br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-baseUse slot="source"></crud-baseUse-baseUse>
  
<<< @/docs/.vuepress/components/crud/baseUse/baseUse.vue
</common-code-format>
</ClientOnly>

## 分页配置

搜索表单对象中 `pageNum` 当前页码，`pageSize` 每页条数 </br>
`pagination` 分页配置（传递对象，具体参考 el-pagination）

<ClientOnly>
<common-code-format>
  <crud-baseUse-pagination slot="source"></crud-baseUse-pagination>
  
<<< @/docs/.vuepress/components/crud/baseUse/pagination.vue
</common-code-format>
</ClientOnly>

## 标题

`title` 表格标题 </br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-title slot="source"></crud-baseUse-title>
  
<<< @/docs/.vuepress/components/crud/baseUse/title.vue
</common-code-format>
</ClientOnly>

## 操作栏

`handleRow` 操作栏 </br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-handleRow slot="source"></crud-baseUse-handleRow>
  
<<< @/docs/.vuepress/components/crud/baseUse/handleRow.vue
</common-code-format>
</ClientOnly>

## 工具栏

`toolbar` 工具栏 </br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-toolbar slot="source"></crud-baseUse-toolbar>
  
<<< @/docs/.vuepress/components/crud/baseUse/toolbar.vue
</common-code-format>
</ClientOnly>

## 表格操作列

`action` 操作列配置，值为`false`则隐藏 </br>
`action.width`、`action.minWidth` 设置为`auto`，会自适应列宽度 </br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-columnAction slot="source"></crud-baseUse-columnAction>
  
<<< @/docs/.vuepress/components/crud/baseUse/columnAction.vue
</common-code-format>
</ClientOnly>


## 表格高度与嵌套表头

`height`、`maxHeight` 设置为`auto`，会自适应窗口高度，配合calcHeight 自定义调节范围 </br>
`calcHeight` 减去的底部高度 </br>
`children` 多级嵌套表头

<ClientOnly>
<common-code-format>
  <crud-baseUse-height slot="source"></crud-baseUse-height>
  
<<< @/docs/.vuepress/components/crud/baseUse/height.vue
</common-code-format>
</ClientOnly>

## 索引列、展开列

`index` 索引列，值为对象时自定义属性 </br>
`expand` 展开列

<ClientOnly>
<common-code-format>
  <crud-baseUse-index slot="source"></crud-baseUse-index>
  
<<< @/docs/.vuepress/components/crud/baseUse/index.vue
</common-code-format>
</ClientOnly>

## 选择列

`selection` 选择列 </br>
`selection.ctrlSelect` 按下ctrl键点击整行选中（默认启用） </br>
`selection.shiftSelect` 按下shift键批量多选（默认启用）

<ClientOnly>
<common-code-format>
  <crud-baseUse-selection slot="source"></crud-baseUse-selection>
  
<<< @/docs/.vuepress/components/crud/baseUse/selection.vue
</common-code-format>
</ClientOnly>


## 组件加载

`loading` 外部控制加载状态，支持`.sync`双向绑定</br>
`disableLoading` 禁用组件内部控制加载状态 </br>
`loadingText` 自定义加载文本 </br>
`loadingSpinner` 自定义加载图标 </br>
`loadingBackground` 自定义加载背景颜色

<ClientOnly>
<common-code-format>
  <crud-baseUse-loading slot="source"></crud-baseUse-loading>
  
<<< @/docs/.vuepress/components/crud/baseUse/loading.vue
</common-code-format>
</ClientOnly>
