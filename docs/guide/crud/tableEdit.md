# 表格编辑

## 自由编辑

`freeEdit` 自由编辑 </br>
renderColumns项中的 `isEdit` 为`true`时，也可自由编辑

<ClientOnly>
<common-code-format>
  <crud-tableEdit-free slot="source"></crud-tableEdit-free>
  
<<< @/docs/.vuepress/components/crud/tableEdit/free.vue
</common-code-format>
</ClientOnly>

## 表格编辑

`batchEdit` 批量编辑 </br>
`@batchEdit`,`@batchSave`,`@batchCancel` 分别为批量编辑、保存、取消事件

<ClientOnly>
<common-code-format>
  <crud-tableEdit-batchEdit slot="source"></crud-tableEdit-batchEdit>
  
<<< @/docs/.vuepress/components/crud/tableEdit/batchEdit.vue
</common-code-format>
</ClientOnly>

## 行编辑

`rowEdit` 行编辑

<ClientOnly>
<common-code-format>
  <crud-tableEdit-rowEdit slot="source"></crud-tableEdit-rowEdit>
  
<<< @/docs/.vuepress/components/crud/tableEdit/rowEdit.vue
</common-code-format>
</ClientOnly>

## 批量行编辑

`batchRowEdit` 批量行编辑 </br>
`@batchEdit`,`@batchSave`,`@batchCancel` 分别为批量编辑、保存、取消事件

<ClientOnly>
<common-code-format>
  <crud-tableEdit-batchRowEdit slot="source"></crud-tableEdit-batchRowEdit>
  
<<< @/docs/.vuepress/components/crud/tableEdit/batchRowEdit.vue
</common-code-format>
</ClientOnly>

## 控制编辑状态

`isRowEdit` 控制行编辑状态 </br>
renderColumns项中的 `isEdit` 可控制单元格或列是否可编辑

<ClientOnly>
<common-code-format>
  <crud-tableEdit-controlEdit slot="source"></crud-tableEdit-controlEdit>
  
<<< @/docs/.vuepress/components/crud/tableEdit/controlEdit.vue
</common-code-format>
</ClientOnly>


## 单元格编辑

`cellEdit` 单元格编辑

<ClientOnly>
<common-code-format>
  <crud-tableEdit-cellEdit slot="source"></crud-tableEdit-cellEdit>
  
<<< @/docs/.vuepress/components/crud/tableEdit/cellEdit.vue
</common-code-format>
</ClientOnly>


## 弹窗编辑

`dialog` 自定义弹窗配置（具体参考函数式弹窗组件配置） </br>
`formOptions` 自定义表单配置（具体参考表单组件配置）

<ClientOnly>
<common-code-format>
  <crud-tableEdit-dialog slot="source"></crud-tableEdit-dialog>
  
<<< @/docs/.vuepress/components/crud/tableEdit/dialog.vue
</common-code-format>
</ClientOnly>

## 自定义编辑组件

`#[prop]-form` 插槽自定义编辑组件 </br>
`column.form` 列配置编辑组件字段

<ClientOnly>
<common-code-format>
  <crud-tableEdit-custom slot="source"></crud-tableEdit-custom>
  
<<< @/docs/.vuepress/components/crud/tableEdit/custom.vue
</common-code-format>
</ClientOnly>

## 操作触发事件

`@add` 点击新增触发 </br>
`@edit` 点击编辑触发 </br>
`@save` 点击保存触发（自由编辑不存在save） </br>
`@view` 点击查看触发 </br>
`@delete` 点击删除触发 </br>
`@cancel` 点击取消触发（自由编辑不存在cancel） </br>
`@getDetail` 获取查看、编辑表单详情 </br>

事件参数： </br>
`done` 回调函数，成功后执行，可以传递一个参数 </br>
`scope` 一系列参数，包含行数据row，当前操作模式等</br>
`unLoading` 是否取消loading，失败时可手动关闭loading


<ClientOnly>
<common-code-format>
  <crud-tableEdit-events slot="source"></crud-tableEdit-events>
  
<<< @/docs/.vuepress/components/crud/tableEdit/events.vue
</common-code-format>
</ClientOnly>

## 删除、操作成功提示

自定义提示信息，接收一个函数或字符串 </br>

`deleteMsgTip` 自定义删除提示，传`false` 则不提示 </br>
`batchDeleteMsgTip` 自定义批量删除提示，传`false` 则不提示 </br>
`successTip` 自定义操作成功提示，传`false` 则不提示 </br>


<ClientOnly>
<common-code-format>
  <crud-tableEdit-deleteTip slot="source"></crud-tableEdit-deleteTip>
  
<<< @/docs/.vuepress/components/crud/tableEdit/deleteTip.vue
</common-code-format>
</ClientOnly>