# 渲染方式

## 格式化渲染

`formatter` 用于格式化数据，返回处理后的文本内容 </br>
`html` 配合 formatter 使用，可以渲染 HTML 字符串

<ClientOnly>
<common-code-format>
  <commonConfig-renderType-formatter slot="source"></commonConfig-renderType-formatter>
<<< @/docs/.vuepress/components/commonConfig/renderType/formatter.vue
</common-code-format>
</ClientOnly>

## 插槽渲染

`#[prop]` 插槽名称与 renderColumns 的 prop 属性对应 </br>
插槽可以接收`scope`作为作用域参数

<ClientOnly>
<common-code-format>
  <commonConfig-renderType-slot slot="source"></commonConfig-renderType-slot>
<<< @/docs/.vuepress/components/commonConfig/renderType/slot.vue
</common-code-format>
</ClientOnly>

## render函数渲染

使用 render 函数或 JSX 语法进行渲染 </br>
当 render 函数接收一个参数时，参数为`scope`；当 render 函数接收两个参数时，第一个参数为`h`，第二个参数为`scope`

<ClientOnly>
<common-code-format>
  <commonConfig-renderType-render slot="source"></commonConfig-renderType-render>
<<< @/docs/.vuepress/components/commonConfig/renderType/render.vue
</common-code-format>
</ClientOnly>

## 组件配置渲染

通过配置对象`comp`来定义组件的各种行为和属性 </br>

默认配置：
- clearable: 默认为 true </br>
- placeholder: 默认为"请输入/请选择" + 列标签 </br>
- size: 继承父组件的 size 配置 </br>

<ClientOnly>
<common-code-format>
  <commonConfig-renderType-component slot="source"></commonConfig-renderType-component>
<<< @/docs/.vuepress/components/commonConfig/renderType/component.vue
</common-code-format>
</ClientOnly>

### 组件类型转换

原先名字为 el-select 的组件会转化为封装的 sc-select 组件，支持 options 配置, 快速生成选项，[字典组件配置](/guide/dict/component.html#字典组件配置) 

| 原组件            | 转换后组件  |
| ----------------- | ----------- |
| el-select         | sc-select   |
| el-checkbox-group | sc-checkbox |
| el-radio-group    | sc-radio    |
| el-switch         | sc-switch   |
| el-cascader       | sc-cascader |

### 组件属性设置
支持两种方式设置组件属性：
1. 直接属性配置
```js
{
  name: 'el-input',
  type: 'text',
  placeholder: '请输入',
  clearable: true
}
```

2. bind 配置，支持函数形式，可获取 scope 参数
```js
{
  name: 'el-input',
  bind: {
    placeholder: '请输入',
    clearable: true
  }
}
```

### 事件处理配置

组件支持两种事件配置方式：

1. on 对象配置
```js
{
  name: 'el-input',
  on: {
    change: (val, scope) => {
      console.log('值变化:', val)
    },
    input: (val, scope) => {
      console.log('输入值:', val)
    }
  }
}
```

2. on 前缀配置
```js
{
  name: 'el-input',
  onChange: (val, scope) => {
    console.log('值变化:', val)
  },
  onInput: (val, scope) => {
    console.log('输入值:', val)
  }
}
```

### children 属性详细说明

children 属性用于配置组件的子元素，支持多种配置方式，常用于下拉选择、单选组、复选组等需要子组件、子元素的场景。

1. 返回子组件，支持数组与对象
```js
{
  name: 'el-select',
  children: [
    { name: 'el-option', label: '选项1', value: 1 },
    { name: 'el-option', label: '选项2', value: 2 }
  ] // { name: 'el-option', label: '选项1', value: 1 }
}
```

2. 函数形式
```js
{
  name: 'el-select',
  children: (scope) => {
    return scope.dict.map(item => ({
      name: 'el-option',
      label: item.label,
      value: item.value
    }))
  }
}

```

3. 返回子元素
```js
{
  name: 'el-button',
  children: '按钮'
}

```

## 组件配置项

| 配置项   | 类型                  | 说明                                               | 示例                                       |
| -------- | --------------------- | -------------------------------------------------- | ------------------------------------------ |
| name     | String/Component      | 组件名称或组件对象。字符串时必须为已注册的全局组件 | 'el-input' 或 导入的组件                   |
| bind     | Object/Function       | 组件的属性配置，函数时可获取 scope 参数            | {placeholder: '请输入'} 或 (scope) => ({}) |
| on       | Object                | 组件的事件监听配置                                 | {change: (val, scope) => {}}               |
| slots    | Object                | 组件的插槽配置，接收render函数                     | {default: (h, scope) => []}                |
| children | Array/Object/Function | 子组件配置或默认插槽内容                           | [{name: 'el-option'}]                      |
| nativeOn | Object                | 原生事件监听                                       | {click: () => {}}                          |
| mounted  | Function(scope, ref)  | 组件挂载后调用，可以获取组件实例 ref 对象          | (scope, ref) => {}                         |


## scope 作用域对象

| 属性   | 说明                                                     |
| ------ | -------------------------------------------------------- |
| row    | 当前行数据                                               |
| self   | 当前组件实例                                             |
| dict   | 字典数据                                                 |
| $value | 格式化值的 get/set，{ get: () => {} , set: (val) => {} } |
