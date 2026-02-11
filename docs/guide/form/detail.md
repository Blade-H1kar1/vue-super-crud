# 表单模式

## 基础详情模式

设置 `detail: true` 开启全部表单项详情模式，表单将变为只读状态。

<ClientOnly>
<common-code-format>
  <form-detail-base slot="source"></form-detail-base>
  
<<< @/docs/.vuepress/components/form/detail/base.vue
</common-code-format>
</ClientOnly>

## 单个表单项详情模式

`renderColumns` 项中支持 `detail` 配置，用于开启、关闭单个表单项的详情模式。

<ClientOnly>
<common-code-format>
  <form-detail-singleDetail slot="source"></form-detail-singleDetail>
  
<<< @/docs/.vuepress/components/form/detail/singleDetail.vue
</common-code-format>
</ClientOnly>

## 边框模式

设置 `border: true` 开启带边框的表单模式。

<ClientOnly>
<common-code-format>
  <form-detail-border slot="source"></form-detail-border>
  
<<< @/docs/.vuepress/components/form/detail/border.vue
</common-code-format>
</ClientOnly>



## 自定义详情展示

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