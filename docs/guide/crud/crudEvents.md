# 增删改查操作方法

## api快捷操作

`api` 接收一个对象，每个属性分别接收 promise 请求方法</br> 
`props` 自定义数据格式

<ClientOnly>
<common-code-format>
  <crud-crudEvents-api slot="source"></crud-crudEvents-api>
  
<<< @/docs/.vuepress/components/crud/crudEvents/api.vue
</common-code-format>
</ClientOnly>

## 操作触发事件

`add` 点击新增触发 </br>
`edit` 点击编辑触发 </br>
`save` 点击保存触发（自由编辑不存在save） </br>
`view` 点击查看触发 </br>
`delete` 点击删除触发 </br>
`cancel` 点击取消触发（自由编辑不存在cancel） </br>
`change` 数据变化触发 </br>
`getDetail` 获取查看、编辑表单详情 </br>

事件参数： </br>
`done` 回调函数，成功后执行，可以传递一个参数 </br>
`scope` 一系列参数，包含行数据row，当前操作模式等</br>
`unLoading` 是否取消loading，失败时可手动关闭loading


<ClientOnly>
<common-code-format>
  <crud-crudEvents-events slot="source"></crud-crudEvents-events>
  
<<< @/docs/.vuepress/components/crud/crudEvents/events.vue
</common-code-format>
</ClientOnly>

## 自定义提示

自定义提示信息，接收一个函数或字符串 </br>

`deleteMsgTip` 自定义删除提示，传`false` 则不提示 </br>
`batchDeleteMsgTip` 自定义批量删除提示，传`false` 则不提示 </br>
`successTip` 自定义操作成功提示，传`false` 则不提示 </br>


<ClientOnly>
<common-code-format>
  <crud-crudEvents-deleteTip slot="source"></crud-crudEvents-deleteTip>
  
<<< @/docs/.vuepress/components/crud/crudEvents/deleteTip.vue
</common-code-format>
</ClientOnly>