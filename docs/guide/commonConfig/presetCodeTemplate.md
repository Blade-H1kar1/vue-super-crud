# 预设配置模板

## 基本使用

`presetType` 匹配预设的配置，实现配置复用。</br>

通用`presetType` 匹配到的配置对象会与原有的配置合并，形成一个新的配置对象，达到配置复用的效果。

<common-code-format>
  <commonConfig-presetCodeTemplate-base slot="source"></commonConfig-presetCodeTemplate-base>
  
<<< @/docs/.vuepress/components/commonConfig/presetCodeTemplate/base.vue
</common-code-format>



## 预设配置的动态化

预设的配置如果是一个函数，接收的参数为原有的配置对象`item`，可以动态的返回一个配置对象，实现配置的动态化。

<common-code-format>
  <commonConfig-presetCodeTemplate-customParams slot="source"></commonConfig-presetCodeTemplate-customParams>
  
<<< @/docs/.vuepress/components/commonConfig/presetCodeTemplate/customParams.vue
</common-code-format>



# 自定义预设配置

::: tip
在全局配置对象 `template` 下添加新的预设配置 。
:::

```js

Vue.use(superCrud, {
  template: {
    render: { // 渲染模板
      dateRange: () => ({
        comp: {
          name: "el-date-picker",
          type: "daterange",
          "range-separator": "-",
          "start-placeholder": "开始",
          "end-placeholder": "结束",
          valueFormat: "yyyy-MM-dd",
        },
      }),
    },
    rules: { // 校验模板
       required: (rules, { item }) => {
          return {
            required: true,
            message: item.label + "不能为空",
            trigger: item.rules.trigger,
          };
        },
    },
    dict: { // 字典模板
      ...
    },
  }})
```