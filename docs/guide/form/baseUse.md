# 基本使用

##  基本使用

`v-model="data"` 绑定的表单值`data`可以不用声明属性`name`,`gender`来绑定响应式，组件内部会自动进行响应式处理</br>
`action` 配置表单按钮

<common-code-format>
  <form-baseUse-base slot="source"></form-baseUse-base>
  
<<< @/docs/.vuepress/components/form/baseUse/base.vue
</common-code-format>


## 布局

`layout` 布局类型默认`grid`</br>
`layout` 布局类型如果为 `el-row`，则参考element-ui的布局设置</br>
### 设置 columns 固定每行列数
`columns` 表单列数，`columnGap` 列间距， `rowGap` 行间距 </br>
`renderColumns`项中，`widthSize` 占据列数，`heightSize` 占据行数</br>

<common-code-format>
  <form-baseUse-gridLayout slot="source"></form-baseUse-gridLayout>
  
<<< @/docs/.vuepress/components/form/baseUse/gridLayout.vue
</common-code-format>

### 设置 columnWidth 固定每列宽度,不固定数量

<common-code-format>
  <form-baseUse-inlineLayout slot="source"></form-baseUse-inlineLayout>
  
<<< @/docs/.vuepress/components/form/baseUse/inlineLayout.vue
</common-code-format>


## 提示

`renderColumns`项中，`tooltip` 提示文本，`tooltipRender` 提示渲染函数</br>
`#[prop]-tooltip` 提示插槽 </br>

<common-code-format>
  <form-baseUse-tooltip slot="source"></form-baseUse-tooltip>
  
<<< @/docs/.vuepress/components/form/baseUse/tooltip.vue
</common-code-format>


## label

`renderColumns`项中，`label` label文本，`labelRender` label渲染函数 </br>
`#[prop]-label` label插槽 </br>
`hiddenLabel` 隐藏label，在`renderColumns`项中配置单个隐藏 </br>
`labelOverTip` label超出隐藏，在`renderColumns`项中配置单个超出隐藏 </br>

<common-code-format>
  <form-baseUse-label slot="source"></form-baseUse-label>
  
<<< @/docs/.vuepress/components/form/baseUse/label.vue
</common-code-format>


## 校验

`renderColumns`项中，`required` 必填，`rules` 匹配规则模板和自定义规则</br>
详情参考[crud-校验](/guide/crud/validate.html#基本使用)

<common-code-format>
  <form-baseUse-validate slot="source"></form-baseUse-validate>
  
<<< @/docs/.vuepress/components/form/baseUse/validate.vue
</common-code-format>


## 显示/隐藏

`renderColumns`项中，`hidden` 隐藏，`show` 显示</br>

<common-code-format>
  <form-baseUse-hidden slot="source"></form-baseUse-hidden>
  
<<< @/docs/.vuepress/components/form/baseUse/hidden.vue
</common-code-format>


## 分组

`type: group` 设置分组</br>
`renderColumns`项中，`children` 配置表单项 </br>

<common-code-format>
  <form-baseUse-group slot="source"></form-baseUse-group>
  
<<< @/docs/.vuepress/components/form/baseUse/group.vue
</common-code-format>


## 数据格式化

当后端接口数据格式与前端不一致时，可以使用`formatData`进行数据格式化</br>
`formatData.input` 将外部后端接口的数据格式转化成内部表单所需的格式</br>
`formatData.output` 将内部表单的数据格式反转回原来的格式</br>
`formatData` 接收字符串时则匹配预设的全局格式化模板</br>
`formatData.getFormatValue = true` 可获取格式化后的值，默认绑定在 `scope.row[$ + prop]` 上，如果配置`getFormatValue`为字符串则绑定在 `scope.row[getFormatValue]` 上

<common-code-format>
  <form-baseUse-dataFormat slot="source"></form-baseUse-dataFormat>
  
<<< @/docs/.vuepress/components/form/baseUse/dataFormat.vue
</common-code-format>


## 深度绑定

`deepProp` 绑定的对象数据是双向的，改变任意一个，另外一个也会改变

<common-code-format>
  <form-baseUse-deep slot="source"></form-baseUse-deep>
  
<<< @/docs/.vuepress/components/form/baseUse/deep.vue
</common-code-format>