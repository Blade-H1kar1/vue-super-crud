# 基本使用

## 概述

方位插槽是一个灵活的布局组件，用于在内容周围添加上、下、左、右四个位置的插槽内容。

## 单独用法


<ClientOnly>
<common-code-format>
  <positionSlot-base slot="source"></positionSlot-base>
  
<<< @/docs/.vuepress/components/positionSlot/base.vue
</common-code-format>
</ClientOnly>

## 搭配组件内置插槽使用

组件内部各种插槽均已封装方位组件。

<ClientOnly>
<common-code-format>
  <positionSlot-table slot="source"></positionSlot-table>
  
<<< @/docs/.vuepress/components/positionSlot/table.vue
</common-code-format>
</ClientOnly>

## 在渲染单元格中使用

在渲染单元格中使用时，需要使用 `position` 属性，并传入 `true` 启用方位插槽。</br>
方位插槽可以获取单元格 `scope` 数据。

::: tip
在编辑单元格中使用时 `position` 属性需要配置在 `form`或`edit`配置对象下。
:::

<ClientOnly>
<common-code-format>
  <positionSlot-form slot="source"></positionSlot-form>
  
<<< @/docs/.vuepress/components/positionSlot/form.vue
</common-code-format>
</ClientOnly>