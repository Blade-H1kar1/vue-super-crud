# 搜索

## 基本使用
`search` 表单对象 </br>
`searchForm`、`searchHeader` 搜索表单、搜索头显示/隐藏（表单默认折叠） </br>
`@search`、`@reset` 搜索/重置事件 </br>
`renderColumns`中、`search.reset()` 单个属性重置方法 </br>

<common-code-format>
  <crud-search-1 slot="source"></crud-search-1>
  
<<< @/docs/.vuepress/components/crud/search/1.vue
</common-code-format>

## 自定义内容与label
`#[prop]-search` 内容插槽名、`#[prop]-search-label` 标题插槽名 </br>
`labelRender` 标题渲染函数 </br>
列配置`search.prop` `search.label` 自定义search取值字段与标题

<common-code-format>
  <crud-search-2 slot="source"></crud-search-2>

  <<< @/docs/.vuepress/components/crud/search/2.vue

</common-code-format>

## 搜索表单、搜索头配置
`searchForm` 搜索表单配置其余属性与Form组件配置相同  </br>
`searchHeader` 搜索头配置其余属性与el-popover组件配置相同  </br>
列配置`searchHeader` 单个搜索头配置

<common-code-format>
  <crud-search-3 slot="source"></crud-search-3>

  <<< @/docs/.vuepress/components/crud/search/3.vue

</common-code-format>