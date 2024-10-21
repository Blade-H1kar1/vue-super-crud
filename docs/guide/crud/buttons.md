# 按钮配置

# 通用配置

按钮配置对象接收`el-button`属性, 详情参考[element-ui](https://element.eleme.cn/#/zh-CN/component/button)</br>
`button.handles` 添加自定义按钮 </br>
`button.hidden` 自定义按钮隐藏, 可接收函数, 在操作列`action`按钮中使用可获取行数据 </br>
`button.children` 为折叠按钮,可配置多个子按钮 </br>

`controlButton` 控制所有按钮，返回所需的按钮组 </br>
<!-- TODO 按钮 -->
<!-- `tempGlobalButton` 为在全局配置template.handleRow.tempGlobalButton: {...}中自定义的全局按钮 </br>
`presetType: add` 为全局按钮的另一种使用方式, 不使用自定义可以简写为`add`</br> -->

<common-code-format>
  <crud-buttons-common slot="source"></crud-buttons-common>
  
<<< @/docs/.vuepress/components/crud/buttons/common.vue
</common-code-format>


# 按钮快捷操作

`confirm` 操作确认 </br>
`successBack` 操作后返回指定页 </br>

<common-code-format>
  <crud-buttons-fast slot="source"></crud-buttons-fast>
  
<<< @/docs/.vuepress/components/crud/buttons/fast.vue
</common-code-format>