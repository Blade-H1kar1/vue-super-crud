---
name: sc-table-select
description: vue-super-crud 库组件。当用户需要使用表格选择器、下拉表格、sc-table-select 组件，或涉及从弹窗/下拉中选择表格行数据时使用。
---

# sc-table-select 表格选择器

基于 `el-select` + `sc-crud` 封装，继承两者所有属性和插槽。下拉或弹窗中展示表格，支持单选/多选。

## 快速写法速查

```html
<!-- 单选，输出对象 -->
<sc-table-select
  v-model="value"
  :data="list"
  :columns="columns"
  labelKey="name"
/>

<!-- 单选，输出基本类型（ID） -->
<sc-table-select v-model="id" :data="list" :columns="columns" labelKey="name" basicType />

<!-- 多选，输出对象数组 -->
<sc-table-select v-model="values" :data="list" :columns="columns" labelKey="name" multiple />

<!-- 多选，输出 ID 数组 -->
<sc-table-select v-model="ids" :data="list" :columns="columns" labelKey="name" multiple basicType />
```

```js
columns: [
  { prop: "id",   label: "ID",   width: 80 },
  { prop: "name", label: "姓名", width: 120 },
  { prop: "dept", label: "部门", width: 120 },
]
```

## 值类型说明

| 模式 | basicType | v-model 类型 |
|---|---|---|
| 单选 | false（默认） | 整行对象 `{ id, name, ... }` |
| 单选 | true | 基本值（如 `id` 字段的值） |
| 多选 | false（默认） | 对象数组 |
| 多选 | true | 基本值数组（如 ID 数组） |

## tableOptions / columns 配置

表格列有两种配置方式，二选一：

```html
<!-- 方式一：columns（简单列配置，不需要搜索时使用） -->
<sc-table-select :data="list" :columns="columns" labelKey="name" />

<!-- 方式二：tableOptions（完整 sc-crud options，支持搜索、分页等） -->
<sc-table-select :data="list" :tableOptions="tableOptions" labelKey="name" />
```

```js
// tableOptions 等同于 sc-crud 的 options，renderColumns 写在内部
tableOptions: {
  renderColumns: [
    { prop: "id",   label: "ID",   width: 80 },
    { prop: "name", label: "姓名", search: true },
    { prop: "dept", label: "部门", search: true },
  ],
}
```

## 搜索配置

```html
<!-- 本地搜索：默认开启，在 tableOptions.renderColumns 列上加 search: true 即可 -->
<sc-table-select :data="list" :tableOptions="tableOptions" labelKey="name" />

<!-- 远程搜索：输入框内容变化会更新 search，并触发 @getList -->
<sc-table-select
  v-model="value"
  :data="filteredData"
  :tableOptions="tableOptions"
  :search.sync="searchParams"
  :loading="loading"
  :remote="true"
  labelKey="name"
  searchKey="name"
  @getList="getList"
/>
```

```js
// remote 模式：searchKey 决定输入框内容写入 search 的哪个字段
// getList 触发时 searchParams 已包含输入内容，请求接口后更新 filteredData 即可
async getList() {
  this.loading = true
  this.filteredData = await api.getList(this.searchParams)
  this.loading = false
}
```

## 弹窗模式

```html
<!-- useDialog：用弹窗代替下拉展示表格，适合列数多或数据量大的场景 -->
<sc-table-select
  v-model="value"
  :data="list"
  :columns="columns"
  labelKey="name"
  useDialog
  :dialogOptions="{ title: '选择用户', width: '800px' }"
/>
```

## 属性一览

| 属性 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| `v-model` | 绑定值 | Array/Object/String/Number | null |
| `data` | 表格数据 | Array | [] |
| `columns` | 列配置（简写） | Array | [] |
| `tableOptions` | 完整 sc-crud options | Object | {} |
| `labelKey` | 选中后显示的字段名 | String | 'label' |
| `valueKey` | 唯一标识字段名 | String | 'id' |
| `searchKey` | 输入框远程搜索写入的字段名 | String | 同 labelKey |
| `multiple` | 多选 | Boolean | false |
| `basicType` | 输出基本类型（ID）而非对象 | Boolean | false |
| `filterable` | 可搜索 | Boolean | true |
| `remote` | 远程搜索模式 | Boolean | false |
| `useDialog` | 弹窗模式 | Boolean | false |
| `dialogOptions` | 弹窗配置（同 $scDialog options） | Object | {} |
| `total` | 数据总数（远程分页） | Number | 0 |
| `loading` | 加载状态 | Boolean | false |

## 插槽

继承 `sc-crud` 所有插槽，另外支持位置插槽：

`content-top` / `content-bottom` / `content-left` / `content-right`：在下拉/弹窗内容的上下左右插入自定义内容。
