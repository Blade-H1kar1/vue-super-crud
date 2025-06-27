# 性能优化

## 延迟渲染

`delayRender:true` 开启延迟渲染功能，可以提升大数据量复杂表格的渲染性能。开启后，可见区域之外的数据会先渲染成空白单元格，只有当滚动到可见区域时才会渲染真实内容，兼容性较强。

<ClientOnly>
<common-code-format>
  <crud-optimize-delay slot="source"></crud-optimize-delay>

<<< @/docs/.vuepress/components/crud/optimize/delay.vue
</common-code-format>
</ClientOnly>


## 虚拟列表

`virtualized:true` 开启虚拟列表功能，性能更强但是兼容性较差，复杂表格容易出现样式错乱。

<ClientOnly>
<common-code-format>
  <crud-optimize-virtualized slot="source"></crud-optimize-virtualized>

<<< @/docs/.vuepress/components/crud/optimize/virtualized.vue
</common-code-format>
</ClientOnly>


## 与同数据量原生el-table对比

<ClientOnly>
<common-code-format>
  <crud-optimize-origin slot="source"></crud-optimize-origin>

<<< @/docs/.vuepress/components/crud/optimize/origin.vue
</common-code-format>
</ClientOnly>

## 树级数据本地自动懒加载


`autoLazy:true` 开启树级数据自动懒加载功能。

<ClientOnly>
<common-code-format>
  <crud-optimize-lazyTree slot="source"></crud-optimize-lazyTree>

<<< @/docs/.vuepress/components/crud/optimize/lazyTree.vue
</common-code-format>
</ClientOnly>
