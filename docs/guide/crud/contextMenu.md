# 右键菜单

:::tip

需要安装 vue-contextmenujs

:::

`contextMenu.actionBtn` 继承操作列 `action` 上的所有按钮</br>
`contextMenu.handles` 自定义右键菜单

<ClientOnly>
<common-code-format>
  <crud-contextMenu-base slot="source"></crud-contextMenu-base>
  
<<< @/docs/.vuepress/components/crud/contextMenu/base.vue
</common-code-format>
</ClientOnly>

## API

### contextMenu 配置

| 属性名    | 说明                 | 类型    | 可选值     | 默认值 |
| :-------- | :------------------- | :------ | :--------- | :----- |
| show      | 是否显示             | Boolean | true/false | -      |
| copy      | 是否启用复制功能     | Boolean | true/false | true   |
| actionBtn | 是否显示操作列按钮   | Boolean | true/false | true   |
| mock      | 是否启用数据模拟功能 | Boolean | true/false | true   |
| reset     | 是否启用重置表格功能 | Boolean | true/false | true   |
| handles   | 自定义菜单项         | Array   | -          | []     |