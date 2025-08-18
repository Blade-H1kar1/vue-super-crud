# 基本配置

## 基本使用

- `@getList`：触发外部获取表格数据的事件 </br>
- `init`：设置为 `true` 时，组件挂载后会立即触发 `@getList` 事件 </br>
- `data`：表格数据绑定值，支持 `.sync` 修饰符进行双向绑定 </br>
- `total`：数据总条数，用于分页显示 </br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-baseUse slot="source"></crud-baseUse-baseUse>
  
<<< @/docs/.vuepress/components/crud/baseUse/baseUse.vue
</common-code-format>
</ClientOnly>

## API支持

组件支持通过配置内置API来自动处理数据获取和删除操作：

- `listApi`：配置列表数据获取API函数，组件会自动调用并处理响应数据 </br>
- `deleteApi`：配置删除操作API函数，在删除操作时自动调用 </br>
- 可以通过配置`data`或者`@getList`事件来获取调用api后的列表数据


<ClientOnly>
<common-code-format>
  <crud-baseUse-apiUsage slot="source"></crud-baseUse-apiUsage>
  
<<< @/docs/.vuepress/components/crud/baseUse/apiUsage.vue
</common-code-format>
</ClientOnly>

## 分页配置

- 搜索参数 `search` 中的分页参数：
  - `pageNum`：当前页码 </br>
  - `pageSize`：每页条数 </br>
- `pagination`：分页组件配置（传递对象，支持 el-pagination 的所有属性和事件） </br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-pagination slot="source"></crud-baseUse-pagination>
  
<<< @/docs/.vuepress/components/crud/baseUse/pagination.vue
</common-code-format>
</ClientOnly>

## 操作栏

`handleRow` 配置用于设置表格顶部的操作按钮栏，支持以下功能：</br>
- 添加新增、批量删除等常用按钮</br>
- 自定义按钮及其事件处理</br>
- 通过插槽自定义操作栏内容</br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-handleRow slot="source"></crud-baseUse-handleRow>
  
<<< @/docs/.vuepress/components/crud/baseUse/handleRow.vue
</common-code-format>
</ClientOnly>

## 工具栏

`toolbar` 配置用于设置表格右上角的工具按钮栏，支持以下功能：</br>
- 添加搜索、刷新、重置等常用按钮</br>
- 自定义按钮及其事件处理</br>
- 通过插槽自定义工具栏内容</br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-toolbar slot="source"></crud-baseUse-toolbar>
  
<<< @/docs/.vuepress/components/crud/baseUse/toolbar.vue
</common-code-format>
</ClientOnly>

## 表格操作列

- `action`：操作列配置对象，设置为 `false` 则隐藏操作列 </br>
- `action.width`、`action.minWidth`：设置为 `auto` 时，会根据内容自动计算列宽度 </br>
- `action.handles`：自定义操作按钮列表 </br>
- `action.delete`、`action.view`、`action.edit`：内置操作按钮配置 </br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-columnAction slot="source"></crud-baseUse-columnAction>
  
<<< @/docs/.vuepress/components/crud/baseUse/columnAction.vue
</common-code-format>
</ClientOnly>


## 表格高度与嵌套表头

- `height`、`maxHeight`：设置表格高度，当设置为 `auto` 时，会自适应窗口高度 </br>
- `calcHeight`：当高度为 `auto` 时，可设置需要减去的底部高度值 </br>
- `children`：用于配置多级嵌套表头，在 `renderColumns` 中的列配置中使用 </br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-height slot="source"></crud-baseUse-height>
  
<<< @/docs/.vuepress/components/crud/baseUse/height.vue
</common-code-format>
</ClientOnly>

## 索引列、展开列

- `index`：索引列配置，可以是布尔值或对象，当为对象时可自定义属性（如标签文本、宽度等） </br>
- `expand`：展开列配置，可以是布尔值或对象，用于实现行展开功能 </br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-index slot="source"></crud-baseUse-index>
  
<<< @/docs/.vuepress/components/crud/baseUse/index.vue
</common-code-format>
</ClientOnly>

## 组件加载

- `loading`：控制表格加载状态，支持 `.sync` 修饰符进行双向绑定 </br>
- `disableLoading`：设置为 `true` 时禁用组件内部自动控制加载状态的功能 </br>
- `loadingText`：自定义加载过程中显示的文本内容 </br>
- `loadingSpinner`：自定义加载图标的类名 </br>
- `loadingBackground`：自定义加载遮罩层的背景颜色 </br>

<ClientOnly>
<common-code-format>
  <crud-baseUse-loading slot="source"></crud-baseUse-loading>
  
<<< @/docs/.vuepress/components/crud/baseUse/loading.vue
</common-code-format>
</ClientOnly>


## API 

### Table 属性

| 属性名  | 说明                                  | 类型    | 可选值 | 默认值                     |
| :------ | :------------------------------------ | :------ | :----- | :------------------------- |
| data    | 表格数据绑定值，支持 `.sync` 双向绑定 | Array   | —      | —                          |
| search  | 搜索表单绑定值，支持 `.sync` 双向绑定 | Object  | —      | {pageNum: 1, pageSize: 10} |
| loading | 加载绑定值，支持 `.sync` 双向绑定     | Boolean | —      | —                          |
| options | 表格配置                              | Object  | —      | —                          |

### Options 配置

> **配置方式说明**：以下所有配置项既可以集中放在 `options` 对象中（如 `:options="{title: '表格标题', size: 'small'}"`），也可以直接配置在表格根属性上（如 `:title="'表格标题'" :size="'small'"`）。两种方式效果相同，可根据实际需求选择更便于维护的方式。

| 属性名          | 说明                                                           | 类型             | 可选值             | 默认值                                      |
| :-------------- | :------------------------------------------------------------- | :--------------- | :----------------- | :------------------------------------------ |
| title           | 表格标题                                                       | String           | -                  | -                                           |
| size            | 表格尺寸                                                       | String           | small/medium/large | small                                       |
| disabled        | 是否禁用                                                       | Boolean          | true/false         | false                                       |
| listApi         | 列表数据获取API函数                                            | Function         | -                  | -                                           |
| deleteApi       | 删除数据API函数                                                | Function         | -                  | -                                           |
| init            | 初始化是否立即调用`getList`                                    | Boolean          | true/false         | false                                       |
| height          | 表格高度,  配置`auto` 自动计算高度                             | String           | auto/-             | -                                           |
| calcHeight      | 自动计算高度的偏差值                                           | Number           | -                  | 0                                           |
| gap             | 表格外间距                                                     | Number/String    | -                  | 20                                          |
| uniqueId        | 是否本地生成唯一标识                                           | Boolean          | true/false         | false                                       |
| valueKey        | 唯一值的Key                                                    | String           | -                  | "id"                                        |
| localPagination | 启用前端本地分页                                               | Boolean          | true/false         | false                                       |
| handleRow       | [操作行配置](/guide/crud/config.html#handlerow-操作行配置)     | Object           | -                  | {}                                          |
| action          | [操作列配置](/guide/crud/config.html#action-操作列配置)        | Object           | -                  | {}                                          |
| toolbar         | [工具栏配置](/guide/crud/config.html#toolbar-工具栏配置)       | Object           | -                  | {}                                          |
| pagination      | [分页配置](/guide/crud/config.html#pagination-分页配置)        | Object           | -                  | {}                                          |
| empty           | [空状态配置](/guide/crud/config.html#empty-空状态配置)         | Object           | -                  | {}                                          |
| renderColumns   | [表格列配置](/guide/crud/config.html#rendercolumns-列渲染配置) | Array / Function | []/()=>[]          | -                                           |
| props           | [字段名配置](/guide/crud/config.html#props-数据属性配置)       | Object           | -                  | {}                                          |
| selection       | 选择列配置                                                     | Boolean/Object   | -                  | {width: 50, align: "center"}                |
| index           | 序号列配置                                                     | Boolean/Object   | -                  | {label: "序号", width: 50, align: "center"} |
| expand          | 展开列配置                                                     | Boolean/Object   | -                  | {width: 50, align: "center"}                |
| stateKey        | 组件级存储键名                                                 | String           | -                  | -                                           |




### handleRow 操作行配置

| 属性名      | 说明             | 类型           | 可选值     | 默认值 |
| :---------- | :--------------- | :------------- | :--------- | :----- |
| show        | 是否显示         | Boolean        | true/false | -      |
| add         | 弹窗新增按钮     | Boolean/Object | -          | {}     |
| rowAdd      | 行新增按钮       | Boolean/Object | -          | {}     |
| batchDelete | 批量删除按钮配置 | Boolean/Object | -          | {}     |
| handles     | 自定义按钮列表   | Array          | -          | []     |

### action 操作列配置

| 属性名       | 说明           | 类型    | 可选值            | 默认值   |
| :----------- | :------------- | :------ | :---------------- | :------- |
| show         | 是否显示       | Boolean | true/false        | -        |
| prop         | 列属性名       | String  | -                 | "action" |
| width        | 列宽度         | String  | auto/-            | "auto"   |
| label        | 列标题         | String  | -                 | "操作"   |
| align        | 对齐方式       | String  | left/center/right | "center" |
| calcWidth    | 宽度计算偏差   | Number  | -                 | 20       |
| defaultWidth | 默认宽度       | Number  | -                 | 50       |
| handles      | 自定义按钮列表 | Array   | -                 | []       |
| delete       | 删除按钮配置   | Object  | -                 | {}       |
| view         | 查看按钮配置   | Object  | -                 | {}       |
| edit         | 编辑按钮配置   | Object  | -                 | {}       |
| rowEdit      | 行编辑按钮配置 | Object  | -                 | {}       |
| handles      | 自定义按钮列表 | Array   | -                 | []       |

### toolbar 工具栏配置

| 属性名    | 说明             | 类型    | 可选值     | 默认值 |
| :-------- | :--------------- | :------ | :--------- | :----- |
| show      | 是否显示         | Boolean | true/false | -      |
| handles   | 自定义按钮列表   | Array   | -          | []     |
| batchEdit | 批量编辑按钮配置 | Object  | -          | {}     |
| zoom      | 缩放按钮配置     | Object  | -          | {}     |
| search    | 搜索按钮配置     | Object  | -          | {}     |
| refresh   | 刷新按钮配置     | Object  | -          | {}     |
| reset     | 重置按钮配置     | Object  | -          | {}     |
| column    | 列设置按钮配置   | Object  | -          | {}     |
| handles   | 自定义按钮列表   | Array   | -          | []     |

### pagination 分页配置

| 属性名          | 说明                         | 类型    | 可选值            | 默认值                                    |
| :-------------- | :--------------------------- | :------ | :---------------- | :---------------------------------------- |
| show            | 是否显示                     | Boolean | true/false        | -                                         |
| align           | 对齐方式                     | String  | left/center/right | "right"                                   |
| pageSizes       | 每页显示个数选择器的选项设置 | Array   | -                 | [10, 20, 30, 50, 100, 200]                |
| layout          | 组件布局                     | String  | -                 | "total, sizes, prev, pager, next, jumper" |
| background      | 是否为分页按钮添加背景色     | Boolean | true/false        | true                                      |
| pagerCount      | 页码按钮的数量               | Number  | -                 | 5                                         |
| localPagination | 是否本地分页                 | Boolean | true/false        | false                                     |
| memorizeScroll  | 分页滚动位置记忆             | Boolean | true/false        | true                                      |


### empty 空状态配置

| 属性名 | 说明     | 类型   | 可选值 | 默认值     |
| :----- | :------- | :----- | :----- | :--------- |
| image  | 图片地址 | String | -      | ""         |
| size   | 图片大小 | Number | -      | 100        |
| text   | 显示文本 | String | -      | "暂无数据" |

### renderColumns 列渲染配置

| 属性名       | 说明                           | 类型                    | 可选值            | 默认值                                    |
| :----------- | :----------------------------- | :---------------------- | :---------------- | :---------------------------------------- |
| hiddenList   | 是否只隐藏列表                 | Boolean                 | true/false        | -                                         |
| children     | 嵌套列子列                     | Array                   | -                 | -                                         |
| spanProp     | 是否合并单元格                 | Boolean/String          | true/false/[prop] | -                                         |
| spanMethod   | 合并单元格方法                 | Function                | -                 | -                                         |
| isEdit       | 是否允许编辑                   | Boolean/Function        | -                 | -                                         |
| summary      | 汇总方式                       | String/Function         | sum/avg/max/min   | -                                         |
| add          | 新增时的配置                   | Object                  | -                 | {}                                        |
| edit         | 编辑时的配置                   | Object                  | -                 | {}                                        |
| view         | 查看时的配置                   | Object                  | -                 | {}                                        |
| form         | 通用表单配置                   | Object                  | -                 | {}                                        |
| search       | 搜索配置                       | Object                  | -                 | {}                                        |
| searchHeader | 搜索表头配置                   | Object                  | -                 | {}                                        |
| prop         | 字段名                         | String                  | -                 | 必填，用于数据绑定                        |
| label        | 列标题                         | String                  | -                 | 显示在表头的文本                          |
| show         | 是否显示                       | Boolean/Function        | true              | 支持函数形式，可动态控制显示              |
| hidden       | 是否隐藏                       | Boolean/Function        | false             | 支持函数形式，可动态控制隐藏              |
| required     | 是否必填                       | Boolean/Object/Function | false             | 支持函数形式，可动态控制必填状态          |
| rules        | 验证规则配置                   | Array/Function          |                   | 支持函数形式                              |
| dict         | 字典配置，支持字符串或对象形式 | Object/String           |                   | 支持函数形式                              |
| formatData   | 响应式数据格式化               | Object                  |                   |                                           |
| position     | 是否开启位置渲染               | Boolean                 | false             | 用于特殊的位置渲染场景                    |
| formatter    | 格式化函数                     | Function                | -                 | 用于格式化数据，返回处理后的文本内容      |
| html         | 是否开启HTML渲染               | Boolean                 | false             | 配合 formatter 使用，可以渲染 HTML 字符串 |
| render       | 渲染函数                       | Function                | -                 | (h, scope) => {}                          |
| comp         | 组件配置                       | Object/Function         | -                 | 用于配置组件的各种行为和属性              |

### props 字段名配置

| 属性名   | 说明           | 类型   | 可选值 | 默认值     |
| :------- | :------------- | :----- | :----- | :--------- |
| pageNum  | 页码字段名     | String | -      | "pageNum"  |
| pageSize | 每页数量字段名 | String | -      | "pageSize" |
| total    | 总数量字段名   | String | -      | "total"    |
| data     | 数据字段名     | String | -      | "data"     |


## 插槽

| 名称                | 说明                 |
| :------------------ | :------------------- |
| [prop]              | 列渲染               |
| [prop]-header       | 列渲染表头           |
| [prop]-form         | 列渲染表单状态       |
| [prop]-view         | 列渲染查看状态       |
| [prop]-edit         | 列渲染编辑状态       |
| [prop]-add          | 列渲染新增状态       |
| [prop]-search       | 列渲染搜索状态       |
| [prop]-searchHeader | 列渲染搜索表头状态   |
| empty               | 空状态               |
| title               | 标题(覆盖原有内容)   |
| title-left          | 标题左侧             |
| title-right         | 标题右侧             |
| title-top           | 标题顶部             |
| title-bottom        | 标题底部             |
| handleRow           | 操作行(覆盖原有内容) |
| handleRow-left      | 操作行左侧           |
| handleRow-right     | 操作行右侧           |
| handleRow-top       | 操作行顶部           |
| handleRow-bottom    | 操作行底部           |
| toolbar             | 工具栏(覆盖原有内容) |
| toolbar-left        | 工具栏左侧           |
| toolbar-right       | 工具栏右侧           |
| toolbar-top         | 工具栏顶部           |
| toolbar-bottom      | 工具栏底部           |
| pagination          | 分页(覆盖原有内容)   |
| pagination-left     | 分页左侧             |
| pagination-right    | 分页右侧             |
| pagination-top      | 分页顶部             |
| pagination-bottom   | 分页底部             |


<style>
table {
  width: 100% !important;
  display: table;
}
</style>
