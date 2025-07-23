# 基本使用

`TableSelect` 是一个基于 `el-select` 和 `sc-crud` 封装的表格选择器组件，提供了丰富的选择功能和灵活的数据格式支持。它可以在下拉框中显示表格数据，支持单选和多选模式，以及多种输入输出格式。

## 值类型支持

`TableSelect` 通过 `basicType` 参数配置输入输出值类型：
- 单选模式：支持对象格式和基本类型（ID）
- 多选模式：支持对象数组和基本类型数组（ID 数组）

<ClientOnly>
<common-code-format>
  <tableSelect-valueType slot="source"></tableSelect-valueType>
                  
  <<< @/docs/.vuepress/components/tableSelect/valueType.vue
</common-code-format>
</ClientOnly>

## 搜索功能

`TableSelect` 组件支持本地搜索和远程搜索：
- 本地搜索：`filterable` 属性默认启用且默认开启表格本地搜索，支持配置`filterMethod`自定义搜索方法
- 远程搜索：通过 `remote` 和 搜索参数`search.sync` 实现

<ClientOnly>
<common-code-format>
  <tableSelect-search slot="source"></tableSelect-search>
                  
  <<< @/docs/.vuepress/components/tableSelect/search.vue
</common-code-format>
</ClientOnly>

## 弹窗模式

可以通过`useDialog`属性配置弹窗模式展示表格：

<ClientOnly>
<common-code-format>
  <tableSelect-displayMode slot="source"></tableSelect-displayMode>
                  
  <<< @/docs/.vuepress/components/tableSelect/displayMode.vue
</common-code-format>
</ClientOnly>

## 自定义内容

支持在下拉、弹窗内容的上下左右位置添加自定义内容。同样也继承了`sc-crud`的所有插槽。

<ClientOnly>
<common-code-format>
  <tableSelect-position slot="source"></tableSelect-position>
                  
  <<< @/docs/.vuepress/components/tableSelect/position.vue
</common-code-format>
</ClientOnly>

## API 文档

继承 `el-select` 组件与 `sc-crud` 组件的 API

### 属性

| 属性名          | 说明                         | 类型                               | 默认值            |
| --------------- | ---------------------------- | ---------------------------------- | ----------------- |
| value / v-model | 绑定值，支持多种格式         | `Array / Object / String / Number` | null              |
| loading         | 是否显示加载中               | `Boolean`                          | false             |
| multiple        | 是否多选                     | `Boolean`                          | false             |
| search          | 远程搜索参数                 | `Object`                           | {}                |
| data            | 表格数据                     | `Array`                            | []                |
| total           | 数据总数-远程分页            | `Number`                           | 0                 |
| columns         | 表格列配置                   | `Array`                            | []                |
| tableOptions    | 表格配置项                   | `Object`                           | {}                |
| labelKey        | 显示的标签字段               | `String`                           | 'label'           |
| valueKey        | 值字段                       | `String`                           | 'id'              |
| searchKey       | 输入框远程搜索的字段         | `String`                           | 默认等于 labelKey |
| filterable      | 是否可搜索                   | `Boolean`                          | true              |
| filterMethod    | 自定义本地搜索方法           | `Function`                         | null              |
| remote          | 是否开启远程搜索             | `Boolean`                          | false             |
| remoteMethod    | 自定义远程搜索方法           | `Function`                         | null              |
| basicType       | 是否使用基本类型作为输出格式 | `Boolean`                          | false             |
| useDialog       | 是否使用弹窗模式展示表格     | `Boolean`                          | false             |
| dialogOptions   | 弹窗配置                     | `Object`                           | {}                |

### Slots

| 插槽名             | 说明       | 作用域参数 |
| ------------------ | ---------- | ---------- |
| content-[position] | 自定义内容 | {  }       |

> 注：`[position]` 可以是 `top`、`bottom`、`left`、`right`