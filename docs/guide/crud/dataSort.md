# 多层级数据排序

表格支持按照多个字段进行层级排序，即在上一层级排序的基础上，对相同值的数据进行下一层级的排序。常用于具有明确层级关系的数据展示,如省市区地址、组织架构等。

## 基础用法

通过配置 `sortProps` 数组来指定排序字段及其优先级。数组中的字段顺序决定了排序的优先级。

<ClientOnly>
<common-code-format>
  <crud-dataSort-base slot="source"></crud-dataSort-base>
  
<<< @/docs/.vuepress/components/crud/dataSort/base.vue
</common-code-format>
</ClientOnly>

## 高级排序配置

对象数组：为每个字段指定详细的排序规则

```js
options: {
  sortProps: [
    "province",
    { prop: "city", order: "desc", nullsPosition: "first" },
    "amount",
  ],
},
```

## 自定义排序规则

通过配置 `sortMethod` 来自定义排序逻辑。

```js
options: {
  sortProps: [
    "province",
    "city",
    { prop: "amount", sortMethod: (a, b) => b.amount - a.amount },
  ],
},
```

## API

### Options 配置

| 参数      | 说明                       | 类型     | 默认值 |
| --------- | -------------------------- | -------- | ------ |
| sortProps | 排序字段数组(按优先级排序) | string[] | []     |

### 排序参数

| 参数          | 说明           | 类型             | 默认值 |
| ------------- | -------------- | ---------------- | ------ |
| prop          | 排序字段名称   | string           | -      |
| order         | 排序方向       | 'asc' / 'desc'   | 'asc'  |
| nullsPosition | 空值位置       | 'first' / 'last' | 'last' |
| sortMethod    | 自定义排序方法 | Function(a, b)   | -      |

### Methods 方法

| 方法名     | 说明                                            | 参数          | 返回值 |
| ---------- | ----------------------------------------------- | ------------- | ------ |
| sortedData | 排序方法，默认使用 sortProps 配置并排序所有数据 | (data, props) | -      |