
# 配置文档

## 基础配置项

| 属性名        | 说明                                                             | 类型             | 可选值             | 默认值                     |
| :------------ | :--------------------------------------------------------------- | :--------------- | :----------------- | :------------------------- |
| data.sync     | 表格数据绑定值                                                   | Array            | —                  | —                          |
| search.sync   | 搜索表单绑定值                                                   | Object           | —                  | {pageNum: 1, pageSize: 10} |
| loading.sync  | 加载绑定值                                                       | Boolean          | —                  | —                          |
| options       | 表格全部配置                                                     | Object           | —                  | —                          |
| title         | 表格标题                                                         | String           | -                  | -                          |
| size          | 表格尺寸                                                         | String           | small/medium/large | small                      |
| disabled      | 是否禁用                                                         | Boolean          | true/false         | false                      |
| init          | 是否开启初始化，配合 `getList` 使用                              | Boolean          | true/false         | false                      |
| height        | 表格高度,  配置`auto` 自动计算高度                               | String           | auto/-             | -                          |
| calcHeight    | 自动计算高度的偏差值                                             | Number           | -                  | 0                          |
| gap           | 表格外间距                                                       | Number/String    | -                  | 20                         |
| uniqueId      | 是否本地生成唯一标识                                             | Boolean          | true/false         | false                      |
| valueKey      | 唯一值的Key                                                      | String           | -                  | "id"                       |
| action        | [操作列配置](/guide/crud/config.html#action-操作列配置)          | Object           | -                  | {}                         |
| toolbar       | [工具栏配置](/guide/crud/config.html#toolbar-工具栏配置)         | Object           | -                  | {}                         |
| pagination    | [分页配置](/guide/crud/config.html#pagination-分页配置)          | Object           | -                  | {}                         |
| empty         | [空状态配置](/guide/crud/config.html#empty-空状态配置)           | Object           | -                  | {}                         |
| contextMenu   | [右键菜单配置](/guide/crud/config.html#contextmenu-右键菜单配置) | Object           | -                  | {}                         |
| renderColumns | [表格列配置](/guide/crud/config.html#rendercolumns-列渲染配置)   | Array / Function | []/()=>[]          | -                          |
| props         | [字段名配置](/guide/crud/config.html#props-数据属性配置)         | Object           | -                  | {}                         |


## 按钮控制配置

| 属性名         | 说明                 | 类型    | 可选值     | 默认值 |
| :------------- | :------------------- | :------ | :--------- | :----- |
| rowAddBtn      | 是否显示行新增按钮   | Boolean | true/false | false  |
| rowAddType     | 行新增类型           | String  | first/last | first  |
| deleteBtn      | 是否显示删除按钮     | Boolean | true/false | false  |
| batchDeleteBtn | 是否显示批量删除按钮 | Boolean | true/false | false  |
| addBtn         | 是否显示弹窗新增按钮 | Boolean | true/false | false  |
| editBtn        | 是否显示弹窗编辑按钮 | Boolean | true/false | false  |
| viewBtn        | 是否显示弹窗查看按钮 | Boolean | true/false | false  |


## 编辑模式配置

| 属性名                | 说明                 | 类型           | 可选值     | 默认值 |
| :-------------------- | :------------------- | :------------- | :--------- | :----- |
| freeEdit              | 是否开启自由编辑     | Boolean        | true/false | false  |
| rowEdit               | 是否开启行编辑       | Boolean/Object | -          | false  |
| cellEdit              | 是否开启单元格编辑   | Boolean/Object | -          | false  |
| batchEdit             | 是否开启批量编辑     | Boolean/Object | -          | false  |
| batchRowEdit          | 是否开启批量行编辑   | Boolean/Object | -          | false  |
| isRowEdit             | 控制行编辑状态的函数 | Function       | -          | -      |
| editOpacity           | 是否开启编辑透明主题 | Boolean        | true/false | true   |
| refreshAfterOperation | 操作后是否刷新表格   | Boolean        | true/false | true   |

## 表单配置

| 属性名      | 说明         | 类型   | 可选值 | 默认值             |
| :---------- | :----------- | :----- | :----- | :----------------- |
| addForm     | 新增表单配置 | Object | -      | {}                 |
| editForm    | 编辑表单配置 | Object | -      | {}                 |
| viewForm    | 查看表单配置 | Object | -      | {viewType: "form"} |
| formOptions | 通用表单配置 | Object | -      | {}                 |
| dialog      | 弹窗配置     | Object | -      | {}                 |

## 搜索配置

| 属性名       | 说明             | 类型           | 可选值     | 默认值                       |
| :----------- | :--------------- | :------------- | :--------- | :--------------------------- |
| searchForm   | 搜索表单配置     | Boolean/Object | -          | {initShow: false}            |
| searchHeader | 搜索表头配置     | Boolean/Object | -          | {width: 290, resetBtn: true} |
| showPopper   | 搜索弹窗是否打开 | Boolean        | true/false | false                        |

## 特殊列配置

| 属性名    | 说明       | 类型           | 可选值 | 默认值                                      |
| :-------- | :--------- | :------------- | :----- | :------------------------------------------ |
| selection | 选择列配置 | Boolean/Object | -      | {width: 50, align: "center"}                |
| index     | 序号列配置 | Boolean/Object | -      | {label: "序号", width: 50, align: "center"} |
| expand    | 展开列配置 | Boolean/Object | -      | {width: 50, align: "center"}                |

## action 操作列配置

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

## toolbar 工具栏配置

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

## pagination 分页配置

| 属性名     | 说明                         | 类型    | 可选值            | 默认值                                    |
| :--------- | :--------------------------- | :------ | :---------------- | :---------------------------------------- |
| align      | 对齐方式                     | String  | left/center/right | "right"                                   |
| pageSizes  | 每页显示个数选择器的选项设置 | Array   | -                 | [10, 20, 30, 50, 100, 200]                |
| layout     | 组件布局                     | String  | -                 | "total, sizes, prev, pager, next, jumper" |
| background | 是否为分页按钮添加背景色     | Boolean | true/false        | true                                      |
| pagerCount | 页码按钮的数量               | Number  | -                 | 5                                         |

## empty 空状态配置

| 属性名 | 说明     | 类型   | 可选值 | 默认值     |
| :----- | :------- | :----- | :----- | :--------- |
| image  | 图片地址 | String | -      | ""         |
| size   | 图片大小 | Number | -      | 100        |
| text   | 显示文本 | String | -      | "暂无数据" |

## contextMenu 右键菜单配置

| 属性名    | 说明             | 类型    | 可选值     | 默认值 |
| :-------- | :--------------- | :------ | :--------- | :----- |
| copy      | 是否启用复制功能 | Boolean | true/false | true   |
| quickEdit | 是否启用快速编辑 | Boolean | true/false | true   |
| actionBtn | 是否显示操作按钮 | Boolean | true/false | true   |
| handles   | 自定义菜单项     | Array   | -          | []     |

## renderColumns 列渲染配置

| 属性名       | 说明           | 类型             | 可选值            | 默认值 |
| :----------- | :------------- | :--------------- | :---------------- | :----- |
| hiddenList   | 是否只隐藏列表 | Boolean          | true/false        | -      |
| children     | 嵌套列子列     | Array            | -                 | -      |
| sameRowSpan  | 是否合并单元格 | Boolean/String   | true/false/[prop] | -      |
| spanMethod   | 合并单元格方法 | Function         | -                 | -      |
| isEdit       | 是否允许编辑   | Boolean/Function | -                 | -      |
| summary      | 汇总方式       | String/Function  | sum/avg/max/min   | -      |
| add          | 新增时的配置   | Object           | -                 | {}     |
| edit         | 编辑时的配置   | Object           | -                 | {}     |
| view         | 查看时的配置   | Object           | -                 | {}     |
| form         | 通用表单配置   | Object           | -                 | {}     |
| search       | 搜索配置       | Object           | -                 | {}     |
| searchHeader | 搜索表头配置   | Object           | -                 | {}     |

## props 字段名配置

| 属性名   | 说明           | 类型   | 可选值 | 默认值     |
| :------- | :------------- | :----- | :----- | :--------- |
| pageNum  | 页码字段名     | String | -      | "pageNum"  |
| pageSize | 每页数量字段名 | String | -      | "pageSize" |

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
