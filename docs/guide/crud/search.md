# 搜索

搜索功能支持表单搜索和表头搜索两种方式，并可配置本地搜索或远程搜索。

## 基础用法

通过配置列的 `search` 属性启用搜索功能。支持表单搜索和表头搜索两种方式。</br>
使用 `search.sync` 可以双向绑定搜索参数对象。

<ClientOnly>
<common-code-format>
  <crud-search-base slot="source"></crud-search-base>
  
<<< @/docs/.vuepress/components/crud/search/base.vue
</common-code-format>
</ClientOnly>

## 自定义搜索组件

支持插槽自定义搜索组件、搜索标题</br>
支持自定义搜索表单、搜索头配置。

<ClientOnly>
<common-code-format>
  <crud-search-special slot="source"></crud-search-special>

<<< @/docs/.vuepress/components/crud/search/special.vue
</common-code-format>
</ClientOnly>

### 搜索表单配置

通过 `searchForm` 可以自定义搜索表单的配置。

```js
searchForm: {
  initShow: true,  // 初始展开
  columnWidth: "200px",  // 列宽
  labelWidth: "100px",  // 标签宽度
  action: {
    search: {
      text: "查询"  // 自定义按钮文本
    },
    reset: {
      text: "重置"
    }
  }
}
```

### 表头搜索

通过 `searchHeader` 配置表头搜索的行为：

```js
options: {
  searchHeader: {
    placement: "bottom", // 弹出位置
    width: "290px"      // 搜索框宽度
  }
}
```

## 本地搜索

通过配置 `localSearch: true` 启用本地搜索功能，可直接对表格数据进行筛选，无需发送请求。</br>
启用本地搜索时，可以搭配本地分页使用 `localPagination: true`。
</br>
支持输入框搜索、下拉选择搜索、日期搜索、自定义搜索过滤。</br>
search组件使用插槽或者函数自定义时，需要指定`search.type`。

<ClientOnly>
<common-code-format>
  <crud-search-localSearch slot="source"></crud-search-localSearch>

<<< @/docs/.vuepress/components/crud/search/localSearch.vue
</common-code-format>
</ClientOnly>

### 本地搜索指定搜索类型
```js
{
  prop: "date",
  label: "日期",
  search: {
    type: "date" // 本地搜索类型
  }
}
  ```

### 本地搜索自定义搜索过滤
```js
{
  prop: "custom",
  label: "自定义",
  search: {
    filter: (cellValue, searchValue, row) => {
      // 返回 true 表示匹配，false 表示不匹配
      return customFilter(cellValue, searchValue, row);
    }
  }
}
```

## 永久展示部分搜索条件

有些搜索条件希望始终展示在搜索表单中，不随搜索框的收缩/展开而隐藏。可以通过在列搜索配置中添加 `alwaysShow` 实现。

<ClientOnly>
<common-code-format>
  <crud-search-alwaysShow slot="source"></crud-search-alwaysShow>

<<< @/docs/.vuepress/components/crud/search/alwaysShow.vue
</common-code-format>
</ClientOnly>


## API

### Column 配置

| 参数                   | 说明                                                                                                          | 类型           | 默认值              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | -------------- | ------------------- |
| search                 | 是否启用搜索                                                                                                  | boolean/object | false               |
| search.prop            | 搜索字段                                                                                                      | object         | 默认继承列的prop    |
| search.validateProp    | 搜索验证字段、用于验证表头是否为空                                                                            | string         | 默认继承search.prop |
| search.label           | 搜索标签                                                                                                      | string         | 默认继承列的label   |
| search.labelRender     | 搜索标签渲染函数                                                                                              | function       | -                   |
| search.reset           | 单个重置事件                                                                                                  | function       | -                   |
| search.comp            | 搜索组件                                                                                                      | object         | el-input            |
| search.render          | 搜索组件渲染函数                                                                                              | function       | -                   |
| search.type            | 本地搜索类型，支持input、select、date                                                                         | string         | input               |
| search.filter          | 本地搜索过滤函数                                                                                              | function       | -                   |
| search.alwaysShow      | 是否永久展示搜索条件                                                                                          | boolean        | false               |
| searchHeader           | 是否启用表头搜索， [可配置el-popover组件属性](https://element.eleme.cn/2.15/#/zh-CN/component/popover#events) | boolean/object | 默认继承search      |
| searchHeader.width     | 表头搜索宽度                                                                                                  | string         | 290px               |
| searchHeader.searchBtn | 是否显示表头搜索按钮                                                                                          | boolean        | false               |
| searchHeader.resetBtn  | 是否显示表头重置按钮                                                                                          | boolean        | true                |
| searchHeader.comp      | 表头搜索组件                                                                                                  | object         | 默认继承search      |
| searchHeader.render    | 表头搜索组件渲染函数                                                                                          | function       | 默认继承search      |

### Options 配置

| 参数         | 说明               | 类型    | 默认值 |
| ------------ | ------------------ | ------- | ------ |
| expandSearch | 初始是否展开搜索框 | boolean | false  |
| localSearch  | 是否启用本地搜索   | boolean | false  |
| searchForm   | 搜索表单配置       | object  | -      |
| searchHeader | 表头搜索配置       | object  | -      |

### Events

| 事件名 | 说明     | 参数       |
| ------ | -------- | ---------- |
| search | 搜索事件 | searchData |
| reset  | 重置事件 | -          |

### slots

| 插槽名                | 说明                 | 默认值         |
| --------------------- | -------------------- | -------------- |
| `{prop}-search`       | 自定义列搜索组件     | -              |
| `{prop}-search-label` | 自定义列搜索标签     | -              |
| `{prop}-searchHeader` | 自定义列表头搜索内容 | 默认继承search |
