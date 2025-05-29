# 表格校验

表格组件支持表单校验功能,包括必填校验、正则校验和自定义校验规则。同时提供了错误提示和错误状态管理。

## 基础用法

通过配置列的 `required` 属性来启用必填校验。支持布尔值和对象两种配置方式:

```js
renderColumns: [
  {
    prop: "name",
    label: "姓名", 
    required: true // 简单配置
  },
  {
    prop: "age",
    label: "年龄",
    required: { // 详细配置 
      message: "年龄不能为空",
      trigger: "blur"
    }
  }
]
```

<ClientOnly>
<common-code-format>
  <crud-validate-base slot="source"></crud-validate-base>
  
<<< @/docs/.vuepress/components/crud/validate/base.vue
</common-code-format>
</ClientOnly>

## 正则校验

通过配置列的 `rules` 属性来添加正则校验规则。支持内置正则模板和自定义正则对象:

```js
renderColumns: [
  {
    prop: "phone",
    label: "手机号",
    rules: ["integer"] // 使用内置正则或预设规则
  },
  {
    prop: "email", 
    label: "邮箱",
    rules: [{ // 自定义正则
      regular: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: "请输入正确的邮箱格式"
    }]
  }
]
```

<ClientOnly>
<common-code-format>
  <crud-validate-regulars slot="source"></crud-validate-regulars>
  
<<< @/docs/.vuepress/components/crud/validate/regulars.vue
</common-code-format>
</ClientOnly>

## 自定义校验

通过配置 `rules` 的 validator 函数来自定义校验规则。支持获取 `scope` 参数:

```js
renderColumns: [
  {
    prop: "age",
    label: "年龄", 
    rules: [{
      validator: (rule, value, callback, scope) => {
        if (value < 18) {
          callback(new Error("年龄不能小于18岁"));
        } else {
          callback();
        }
      },
      trigger: "change"
    }]
  },
  {
    prop: "age",
    label: "年龄", 
    rules: (scope)=>[{
      validator: (rule, value, callback) => {
        if (value < 18) {
          callback(new Error("年龄不能小于18岁"));
        } else {
          callback();
        }
      },
      trigger: "change"
    }]
  }
]
```

<ClientOnly>
<common-code-format>
  <crud-validate-custom slot="source"></crud-validate-custom>
  
<<< @/docs/.vuepress/components/crud/validate/custom.vue
</common-code-format>
</ClientOnly>


## 树级校验

<ClientOnly>
<common-code-format>
  <crud-validate-tree slot="source"></crud-validate-tree>
  
<<< @/docs/.vuepress/components/crud/validate/tree.vue
</common-code-format>
</ClientOnly>


## 联动校验

通过方法 `validateField` 函数来精确控制每个校验单元格。

<ClientOnly>
<common-code-format>
  <crud-validate-relation slot="source"></crud-validate-relation>
  
<<< @/docs/.vuepress/components/crud/validate/relation.vue
</common-code-format>
</ClientOnly>

## API

### Column 配置

| 参数     | 说明     | 类型                         | 默认值 |
| -------- | -------- | ---------------------------- | ------ |
| required | 是否必填 | boolean/object               | false  |
| rules    | 校验规则 | string/array/function(scope) | -      |

### rules 配置

| 属性名    | 类型     | 说明           |
| :-------- | :------- | :------------- |
| validator | Function | 自定义验证函数 |
| message   | String   | 错误提示信息   |
| trigger   | String   | 触发方式       |

### Methods

| 方法名        | 说明         | 参数                          | 返回值  |
| ------------- | ------------ | ----------------------------- | ------- |
| validate      | 校验整个表格 | callback(可选)                | Promise |
| validateField | 校验指定行   | options: {index/id/row, prop} | Promise |
| clearValidate | 清除校验     | -                             | -       |

### validateField 方法options参数

| 参数  | 说明         | 类型          |
| ----- | ------------ | ------------- |
| index | 行索引       | number        |
| id    | 行ID         | string/number |
| row   | 行数据对象   | object        |
| prop  | 校验的字段名 | string        |