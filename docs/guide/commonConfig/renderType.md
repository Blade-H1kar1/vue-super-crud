# 自定义组件内容

## 默认 formatter

`column.formatter` 返回格式化数据 </br>
`column.html` 渲染html

<ClientOnly>
<common-code-format>
  <commonConfig-renderType-formatter slot="source"></commonConfig-renderType-formatter>
<<< @/docs/.vuepress/components/commonConfig/renderType/formatter.vue
</common-code-format>
</ClientOnly>

## 插槽 slot

`#[prop]` renderColumns中配置的prop属性即为插槽名称

<ClientOnly>
<common-code-format>
  <commonConfig-renderType-slot slot="source"></commonConfig-renderType-slot>
<<< @/docs/.vuepress/components/commonConfig/renderType/slot.vue
</common-code-format>
</ClientOnly>

## 组件配置 component

`comp` 接收一个组件配置对象，`name` 为组件名称，配置为字符串的组件名称必须为已注册的全局组件，非全局组件需要将引入的组件直接传给name</br>
`on` 为组件事件，事件函数参数也包含`scope`，`slots` 为组件插槽</br>
`children` 为组件的子元素、默认插槽，可配置为render函数或嵌套子级`comp`配置</br>
`comp.xxx`其他属性即为组件接收的props属性，其中`comp.bind` 同样可以配置组件属性，但是可为函数获取参数`scope`，动态配置组件属性，`on`绑定的事件参数也包含`scope`</br>

<ClientOnly>
<common-code-format>
  <commonConfig-renderType-component slot="source"></commonConfig-renderType-component>
<<< @/docs/.vuepress/components/commonConfig/renderType/component.vue
</common-code-format>
</ClientOnly>

## 渲染函数 render

`render` 函数可以获取`h`函数和`scope`，也可搭配使用jsx语法

<ClientOnly>
<common-code-format>
  <commonConfig-renderType-render slot="source"></commonConfig-renderType-render>
<<< @/docs/.vuepress/components/commonConfig/renderType/render.vue
</common-code-format>
</ClientOnly>