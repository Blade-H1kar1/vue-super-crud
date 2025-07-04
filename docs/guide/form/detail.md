# 详情模式

详情模式将表单转换为只读展示状态，适用于数据查看场景。

## 基础详情模式

设置 `detail: true` 开启详情模式，表单将变为只读状态。

<ClientOnly>
<common-code-format>
  <form-detail-base slot="source"></form-detail-base>
  
<<< @/docs/.vuepress/components/form/detail/base.vue
</common-code-format>
</ClientOnly>

## 边框模式

设置 `border: true` 开启带边框的详情模式，提供更清晰的数据结构展示。

<ClientOnly>
<common-code-format>
  <form-detail-border slot="source"></form-detail-border>
  
<<< @/docs/.vuepress/components/form/detail/border.vue
</common-code-format>
</ClientOnly>

## 详情配置

支持为单个字段配置独立的详情展示方式。

```javascript
{
  renderColumns: [
    {
      prop: 'name',
      label: '姓名',
      detail: {
        // 字段级详情配置
        render: (h, { row }) => {
          return <span style="color: #409eff">{row.name}</span>
        }
      }
    },
  ]
}
```