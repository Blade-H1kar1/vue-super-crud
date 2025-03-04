# 按钮配置

# 通用配置

按钮配置对象接收`el-button`属性, 详情参考[element-ui](https://element.eleme.cn/#/zh-CN/component/button)</br>
`button.handles` 添加自定义按钮 </br>
`button.hidden` 自定义按钮隐藏, 可接收函数, 在操作列`action`按钮中使用可获取行数据 </br>
`button.children` 为折叠按钮,可配置多个子按钮 </br>

`controlButton` 控制所有按钮，返回所需的按钮组 </br>

<ClientOnly>
<common-code-format>
  <crud-buttons-common slot="source"></crud-buttons-common>
  
<<< @/docs/.vuepress/components/crud/buttons/common.vue
</common-code-format>
</ClientOnly>
