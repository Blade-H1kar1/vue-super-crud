# 表格校验

## 基本使用
`ref.validate()` 校验表格方法 </br>
`ref.clearValidate()` 清除表格校验方法 </br>
`ref.validateField(index)` 校验表格指定行方法 </br>
`column.required` 是否必填 `Boolean：true | false` </br>
`column.required` 自定义必填参数 `Object：{ message: 'xxxx必填', trigger: 'blur' }`

<common-code-format>
  <crud-validate-base slot="source"></crud-validate-base>
  
<<< @/docs/.vuepress/components/crud/validate/base.vue
</common-code-format>

## 正则校验

`column.rules` 正则校验规则 `Array：['integer', { regular: xx, message: 'xxxx' }]`（接收匹配模板正则的字符串或接收完整正则校验对象）

<common-code-format>
  <crud-validate-regulars slot="source"></crud-validate-regulars>
  
<<< @/docs/.vuepress/components/crud/validate/regulars.vue
</common-code-format>


## 自定义校验规则

`column.rules` 自定义校验规则 `Array：[{ validator:()=>{},trigger: "change" } ]`

<common-code-format>
  <crud-validate-custom slot="source"></crud-validate-custom>
  
<<< @/docs/.vuepress/components/crud/validate/custom.vue
</common-code-format>