# 基本使用

## 基本使用

`@getList` 获取表格数据 </br>
`init` 初始化是否立即调用 getList（默认为 true） </br>

<common-code-format>
  <crud-baseUse-baseUse slot="source"></crud-baseUse-baseUse>
  
<<< @/docs/.vuepress/components/crud/baseUse/baseUse.vue
</common-code-format>

## 分页配置

搜索表单对象中 `pageNum` 当前页码，`pageSize` 每页条数 </br>
`pagination` 分页配置（传递对象，具体参考 el-pagination）

<common-code-format>
  <crud-baseUse-pagination slot="source"></crud-baseUse-pagination>
  
<<< @/docs/.vuepress/components/crud/baseUse/pagination.vue
</common-code-format>

## 标题

`title` 表格标题 </br>

<common-code-format>
  <crud-baseUse-title slot="source"></crud-baseUse-title>
  
<<< @/docs/.vuepress/components/crud/baseUse/title.vue
</common-code-format>

## 操作栏

`handleRow` 操作栏 </br>

<common-code-format>
  <crud-baseUse-handleRow slot="source"></crud-baseUse-handleRow>
  
<<< @/docs/.vuepress/components/crud/baseUse/handleRow.vue
</common-code-format>

## 工具栏

`toolbar` 工具栏 </br>

<common-code-format>
  <crud-baseUse-toolbar slot="source"></crud-baseUse-toolbar>
  
<<< @/docs/.vuepress/components/crud/baseUse/toolbar.vue
</common-code-format>

## 表格操作列

`action` 操作列配置，值为`false`则隐藏 </br>
`action.width`、`action.minWidth` 设置为`auto`，会自适应列宽度 </br>

<common-code-format>
  <crud-baseUse-columnAction slot="source"></crud-baseUse-columnAction>
  
<<< @/docs/.vuepress/components/crud/baseUse/columnAction.vue
</common-code-format>


## 表格高度与嵌套表头

`height`、`maxHeight` 设置为`auto`，会自适应窗口高度，配合calcHeight 自定义调节范围 </br>
`calcHeight` 减去的底部高度 </br>
`children` 多级嵌套表头

<common-code-format>
  <crud-baseUse-height slot="source"></crud-baseUse-height>
  
<<< @/docs/.vuepress/components/crud/baseUse/height.vue
</common-code-format>

## 索引列、展开列

`index` 索引列，值为对象时自定义属性 </br>
`expand` 展开列

<common-code-format>
  <crud-baseUse-index slot="source"></crud-baseUse-index>
  
<<< @/docs/.vuepress/components/crud/baseUse/index.vue
</common-code-format>

## 选择列

`selection` 选择列 </br>
`selection.ctrlSelect` 按下ctrl键点击整行选中（默认启用） </br>
`selection.shiftSelect` 按下shift键批量多选（默认启用）

<common-code-format>
  <crud-baseUse-selection slot="source"></crud-baseUse-selection>
  
<<< @/docs/.vuepress/components/crud/baseUse/selection.vue
</common-code-format>

<!-- ## 列宽度

`calcColumnWidth` 配置列宽度自动计算规则 </br>
`column.width`、`column.minWidth` 设置为`auto`，会自适应列宽度 </br>
`column.widthType...` 独立配置列宽度自动计算规则

<common-code-format>
  <crud-baseUse-columnWidth slot="source"></crud-baseUse-columnWidth>
  
<<< @/docs/.vuepress/components/crud/baseUse/columnWidth.vue
</common-code-format> -->


## 组件加载

`loading` 外部控制加载状态，支持`.sync`双向绑定</br>
`disableLoading` 禁用组件内部控制加载状态 </br>
`loadingText` 自定义加载文本 </br>
`loadingSpinner` 自定义加载图标 </br>
`loadingBackground` 自定义加载背景颜色

<common-code-format>
  <crud-baseUse-loading slot="source"></crud-baseUse-loading>
  
<<< @/docs/.vuepress/components/crud/baseUse/loading.vue
</common-code-format>

## 快捷合并行列

`spanMethod` 自定义合并 </br>

`renderColumns`项中：</br>
`spanMethod` 自定义每列合并</br>
`sameRowSpan` 自动合并行，默认条件为当前列属性值`row[prop]`相同的行数据，或者指定为其他要合并的prop </br>

<common-code-format>
  <crud-baseUse-spanMethod slot="source"></crud-baseUse-spanMethod>
  
<<< @/docs/.vuepress/components/crud/baseUse/spanMethod.vue
</common-code-format>

## 快捷统计

`summaryMethod` 自定义统计 </br>

`renderColumns`项中：`summary` 指定统计类型，合计`sum`、平均`avg`、最大值`max`、最小值`min`</br>


<common-code-format>
  <crud-baseUse-summaryMethod slot="source"></crud-baseUse-summaryMethod>
  
<<< @/docs/.vuepress/components/crud/baseUse/summaryMethod.vue
</common-code-format>

## sc-crud 属性

| 属性名                | 说明                | 类型                 | 可选值 | 默认值 |
| :-------------------- | :------------------ | :------------------- | :----- | :----- |
| data.sync             | 表格数据绑定值      | `array`              | —      | —      |
| options               | 表格全部配置        | `object`             | —      | —      |
| renderColumns         | 表格列配置          | `array` / `function` | —      | —      |
| search.sync           | 搜索表单绑定值      | `object`             | —      | —      |
| loading.sync          | 加载绑定值          | `boolean`            | —      | —      |
| init                  | 初始化是否立即调用  | `boolean`            | —      | true   |
| pagination            | 分页配置            | `boolean` / `object` | —      | —      |
| title                 | 表格标题            | `string`             | —      | —      |
| handleRow             | 操作栏配置          | `boolean` / `object` | —      | —      |
| toolbar               | 工具栏配置          | `boolean` / `object` | —      | —      |
| action                | 操作列配置          | `boolean` / `object` | —      | —      |
| height                | 表格高度配置        | `string`/`number`    | `auto` | —      |
| calcHeight            | 表格高度计算减去值  | `number`             | —      | —      |
| index                 | 索引列配置          | `boolean` / `object` | —      | —      |
| expand                | 展开列配置          | `boolean` / `object` | —      | —      |
| selection             | 选择列配置          | `boolean` / `object` | —      | —      |
| selection.ctrlSelect  | ctrl键选中整行配置  | `boolean`            | —      | true   |
| selection.shiftSelect | shift键批量多选配置 | `boolean`            | —      | true   |
| columnWidth           | 列宽度配置          | `object`             | —      | —      |

