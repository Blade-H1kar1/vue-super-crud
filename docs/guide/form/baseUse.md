# 基本配置

## 基本使用

`v-model="data"` 绑定的表单值`data`可以不用声明属性`name`,`gender`来绑定响应式，组件内部会自动进行响应式处理。

### 基础配置
- `action` 配置表单按钮
- `labelWidth` 标签宽度，默认 100px
- `labelPosition` 标签位置，默认 right
- `layout` 布局类型，默认 grid
- `shrinkLabel` 是否收缩标签，默认 true
- `scrollError` 是否滚动至错误信息，默认 true
- `hiddenLabel` 是否隐藏标签
- `labelOverTip` 标签超出一行是否隐藏并显示隐藏内容

<ClientOnly>
<common-code-format>
  <form-baseUse-base slot="source"></form-baseUse-base>
  
<<< @/docs/.vuepress/components/form/baseUse/base.vue
</common-code-format>
</ClientOnly>

## 布局

### Grid布局（默认）
表单默认使用Grid网格布局，提供灵活的响应式布局能力：

**基础配置：**
- `columns` - 设置表单列数，默认为1列
- `columnGap` - 列间距
- `rowGap` - 行间距

**renderColumns项配置：**
- `widthSize` - 表单项占据的列数（跨列）
- `heightSize` - 表单项占据的行数（跨行）

Grid布局支持表单项的跨行跨列显示，适合复杂的表单布局需求。更多Grid组件配置请参考 [Grid布局组件文档](/guide/grid/baseUse.html)

<ClientOnly>
<common-code-format>
  <form-baseUse-gridLayout slot="source"></form-baseUse-gridLayout>
  
<<< @/docs/.vuepress/components/form/baseUse/gridLayout.vue
</common-code-format>
</ClientOnly>


### Element UI 布局
当 `layout="el-row"` 时，可以使用 Element UI 的栅格布局系统。

## 校验功能

`renderColumns` 项中支持以下校验配置：
- `required` 必填
- `rules` 校验规则
- 支持异步校验
- 支持自定义校验规则

<ClientOnly>
<common-code-format>
  <form-baseUse-validate slot="source"></form-baseUse-validate>
  
<<< @/docs/.vuepress/components/form/baseUse/validate.vue
</common-code-format>
</ClientOnly>

## 显示/隐藏控制

`renderColumns` 项中支持：
- `hidden` 隐藏字段
- `show` 显示字段
- 支持动态控制显示隐藏

<ClientOnly>
<common-code-format>
  <form-baseUse-hidden slot="source"></form-baseUse-hidden>
  
<<< @/docs/.vuepress/components/form/baseUse/hidden.vue
</common-code-format>
</ClientOnly>

## 提示功能

`renderColumns` 项中支持：
- `tooltip` 提示文本
- `tooltipRender` 提示渲染函数
- `#[prop]-tooltip` 提示插槽

<ClientOnly>
<common-code-format>
  <form-baseUse-tooltip slot="source"></form-baseUse-tooltip>
  
<<< @/docs/.vuepress/components/form/baseUse/tooltip.vue
</common-code-format>
</ClientOnly>

## 标签配置

- `colon` 标签后面是否添加冒号

`renderColumns` 项中支持：
- `label` 标签文本
- `labelRender` 标签渲染函数
- `#[prop]-label` 标签插槽
- `hiddenLabel` 隐藏标签
- `labelOverTip` 标签超出隐藏
- `labelWidth` 单独设置标签宽度

<ClientOnly>
<common-code-format>
  <form-baseUse-label slot="source"></form-baseUse-label>
  
<<< @/docs/.vuepress/components/form/baseUse/label.vue
</common-code-format>
</ClientOnly>

## 草稿箱功能

表单组件内置了草稿箱功能，支持：
- 保存草稿：右键菜单或通过 `contextMenu.saveDraft` 配置
- 加载草稿：支持加载当前字段或完整加载
- 草稿管理：支持预览、删除、清空等操作
- 草稿搜索：支持按名称搜索草稿

配置示例：
```js
{
  contextMenu: {
    saveDraft: true, // 启用保存草稿
    loadDraft: true, // 启用加载草稿
    draft: true // 启用草稿箱
  }
}
```

## 右键菜单

表单组件提供了丰富的右键菜单功能，包括：
- 生成测试数据（mock）
- 重置表单
- 复制数据
- 粘贴数据（支持当前/全部）
- 草稿箱相关操作

配置示例：
```js
{
  contextMenu: {
    mock: true, // 生成测试数据
    copy: true, // 复制数据
    reset: true, // 重置表单
    paste: true, // 粘贴数据
    saveDraft: true, // 保存草稿
    loadDraft: true, // 加载草稿
    draft: true, // 草稿箱
    handles: [] // 自定义菜单项
  }
}
```

## 分组功能

通过 `group` 属性开启分组模式，支持：
- 设置分组标题
- 配置分组内表单项
- 自定义分组样式

<ClientOnly>
<common-code-format>
  <form-baseUse-group slot="source"></form-baseUse-group>
   
<<< @/docs/.vuepress/components/form/baseUse/group.vue
</common-code-format>
</ClientOnly>



## API

### Form 属性

| 参数            | 说明         | 类型    | 默认值 |
| --------------- | ------------ | ------- | ------ |
| value / v-model | 表单数据对象 | object  | -      |
| loading         | 加载状态     | boolean | -      |
| options         | 组件配置     | object  | -      |

### Options 配置项

| 参数          | 说明                               | 类型    | 默认值   |
| ------------- | ---------------------------------- | ------- | -------- |
| title         | 表单标题                           | string  | -        |
| detail        | 是否开启详情模式                   | boolean | false    |
| border        | 是否开启边框模式                   | boolean | false    |
| group         | 是否开启分组模式                   | boolean | false    |
| labelWidth    | 标签宽度                           | string  | '100px'  |
| labelPosition | 标签位置                           | 'right' | 'left'   | 'top'  | 'right' |
| layout        | 布局类型                           | 'grid'  | 'el-row' | 'grid' |
| columns       | 表单列数（Grid布局时）             | number  | 1        |
| columnGap     | 列间距（Grid布局时）               | string  | -        |
| rowGap        | 行间距（Grid布局时）               | string  | -        |
| shrinkLabel   | 是否收缩标签                       | boolean | true     |
| scrollError   | 是否滚动至错误信息                 | boolean | true     |
| hiddenLabel   | 是否隐藏标签                       | boolean | false    |
| labelOverTip  | 标签超出一行是否隐藏并显示隐藏内容 | boolean | false    |
| contextMenu   | 右键菜单配置                       | object  |          |
| action        | 操作列配置                         | object  |          |
| colon         | 标签后面是否添加冒号               | boolean | false    |

### renderColumns 配置

| 参数          | 说明                               | 类型             | 默认值  |
| ------------- | ---------------------------------- | ---------------- | ------- |
| prop          | 表单字段名                         | string           | -       |
| label         | 标签文本                           | string           | -       |
| widthSize     | 占据列数（Grid布局时）             | number \ string  | 1       |
| heightSize    | 占据行数（Grid布局时）             | number \ string  | 1       |
| tooltip       | 提示文本                           | string           | -       |
| tooltipRender | 提示渲染函数                       | function         | -       |
| labelWidth    | 单独配置标签宽度                   | string           | '100px' |
| labelRender   | 标签渲染函数                       | function         | -       |
| labelOverTip  | 标签超出一行是否隐藏并显示隐藏内容 | boolean          | -       |
| hiddenLabel   | 是否隐藏标签                       | boolean          | -       |
| children      | 子表单项配置(分组时使用)           | array            | -       |
| detail        | 详情模式配置                       | boolean \ object | -       |
| initValue     | 初始值                             | any              | -       |


### contextMenu 配置

| 参数      | 说明                 | 类型    | 默认值 |
| --------- | -------------------- | ------- | ------ |
| show      | 是否显示右键菜单     | boolean | -      |
| hidden    | 是否隐藏右键菜单     | boolean | -      |
| mock      | 生成测试数据按钮配置 | object  | true   |
| copy      | 复制数据按钮配置     | object  | true   |
| reset     | 重置表单按钮配置     | object  | true   |
| paste     | 粘贴数据按钮配置     | object  | true   |
| saveDraft | 保存草稿按钮配置     | object  | true   |
| loadDraft | 加载草稿按钮配置     | object  | true   |
| draft     | 草稿箱按钮配置       | object  | true   |
| handles   | 自定义菜单项         | array   | []     |

### action 配置

| 参数    | 说明             | 类型    | 默认值   |
| ------- | ---------------- | ------- | -------- |
| show    | 是否显示操作按钮 | boolean | -        |
| hidden  | 是否隐藏操作按钮 | boolean | -        |
| submit  | 提交按钮配置     | object  | -        |
| reset   | 重置按钮配置     | object  | -        |
| handles | 自定义按钮       | array   | []       |
| align   | 按钮对齐方式     | string  | 'center' |

### Events

| 事件名        | 说明               | 回调参数        |
| ------------- | ------------------ | --------------- |
| submit        | 表单提交时触发     | (value: object) |
| reset         | 表单重置时触发     | -               |
| mock-data     | 生成测试数据时触发 | (value: object) |
| copy          | 复制数据时触发     | (value: string) |
| paste         | 粘贴数据时触发     | (value: object) |
| draft-loaded  | 加载草稿时触发     | (draft: object) |
| draft-deleted | 删除草稿时触发     | (draft: object) |

### 插槽

| 插槽名         | 说明           | 作用域参数      |
| -------------- | -------------- | --------------- |
| [prop]-label   | 自定义标签内容 | { item, scope } |
| [prop]-tooltip | 自定义提示内容 | { item, scope } |
| title          | 自定义表单标题 | -               |