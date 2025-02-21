# 表格选中


## 跨分页选中

`selected` 绑定响应式选中数据，存在数据时会自动选中 </br>
`selection` 选择列配置 </br>
`selection.reserveSelection` 开启支持跨分页选中 </br>
`selection.banner` 开启显示选中项横幅 </br>

<ClientOnly>
<common-code-format>
  <crud-selection-pagination slot="source"></crud-selection-pagination>
  
<<< @/docs/.vuepress/components/crud/selection/pagination.vue
</common-code-format>
</ClientOnly> 

## 选中事件

`@selection-change` 选中项发生变化时触发 </br>
`@select` 用户手动选择/取消选择某一行时触发 </br>
`@select-all` 用户手动选择/取消选择所有行时触发

<ClientOnly>
<common-code-format>
  <crud-selection-events slot="source"></crud-selection-events>
  
<<< @/docs/.vuepress/components/crud/selection/events.vue
</common-code-format>
</ClientOnly>


## selection 配置项

| 参数        | 说明                      | 类型    | 可选值 | 默认值 |
| ----------- | ------------------------- | ------- | ------ | ------ |
| banner      | 是否显示选中项横幅        | boolean | -      | false  |
| ctrlSelect  | 是否启用 Ctrl 键点击选中  | boolean | -      | true   |
| shiftSelect | 是否启用 Shift 键批量选中 | boolean | -      | true   |
| maxDisplay  | 直接显示的最大数量        | number  | -      | 3      |
| labelKey    | 显示的字段名              | string  | -      | 'id'   |
| clear       | 是否显示清除按钮          | boolean | -      | true   |
