# 表格统计

表格支持在底部显示统计信息，内置多种统计方式，也支持自定义统计逻辑。

## 基础用法

通过配置列的 `summary` 属性启用统计功能。支持以下统计方式：
- `sum`: 求和
- `avg`: 平均值
- `max`: 最大值
- `min`: 最小值
- `count`: 计数

<ClientOnly>
<common-code-format>
  <crud-summary-base slot="source"></crud-summary-base>
  
<<< @/docs/.vuepress/components/crud/summary/base.vue
</common-code-format>
</ClientOnly>

## 格式化配置

通过 `prefix`、`suffix` 和 `decimals` 属性可以对统计结果进行格式化：

```js
renderColumns: [
  {
    prop: "amount",
    label: "金额",
    summary: {
      type: "sum",
      prefix: "¥",     // 添加前缀
      suffix: "元",    // 添加后缀
      decimals: 2      // 保留2位小数
    }
  }
]
```

## 高级统计

### 加权平均值
```js
{
  prop: "score",
  label: "加权平均分",
  summary: {
    type: "avg",
    decimals: 1,
    suffix: "分"
  }
}
```

### 条件统计
```js
{
  prop: "status",
  label: "状态统计",
  summary: {
    type: "count",
    predicate: value => value === 'active',  // 只统计active状态
    suffix: "个"
  }
}
```

## 自定义统计方法

通过传入函数作为 `method` 可以自定义统计逻辑：

```js
{
  prop: "custom",
  label: "自定义统计",
  summary: {
    type: "custom",
    method: (values, data) => {
      // values: 当前列的所有数值
      // data: 表格完整数据
      return values.reduce((sum, val) => sum + val, 0);
    },
    prefix: "¥",
    decimals: 2
  }
}
```

## 表格级别自定义

通过 `summaryMethod` 可以自定义整个表格的统计规则：

```js
options: {
  summaryMethod: ({ columns, data }) => {
    const sums = [];
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = '总计';
        return;
      }
      const values = data.map(item => Number(item[column.property]));
      sums[index] = values.reduce((sum, val) => sum + val, 0);
    });
    return sums;
  }
}
```

## 嵌套数据统计

通过 `path` 属性可以统计嵌套对象中的数据：

```js
{
  prop: "nested.value",
  label: "嵌套数据",
  summary: {
    type: "sum",
    path: "nested.value",  // 指定数据路径
    decimals: 2
  }
}
```

## API

### Column Summary 配置

| 参数       | 说明                           | 类型     | 默认值 |
| ---------- | ------------------------------ | -------- | ------ |
| type       | 统计类型                       | string   | -      |
| prefix     | 统计值前缀                     | string   | ''     |
| suffix     | 统计值后缀                     | string   | ''     |
| decimals   | 小数位数                       | number   | 2      |
| path       | 数据路径（用于嵌套数据）       | string   | -      |
| ignoreZero | 是否忽略0值                    | boolean  | false  |
| absolute   | 是否取绝对值                   | boolean  | false  |
| predicate  | 计数条件（仅用于count）        | function | -      |
| method     | 自定义统计方法（仅用于custom） | function | -      |

### Options 配置

| 参数          | 说明           | 类型     | 默认值 |
| ------------- | -------------- | -------- | ------ |
| showSummary   | 是否显示统计行 | boolean  | false  |
| summaryMethod | 自定义统计方法 | function | -      |

### 内置统计类型

| 类型   | 说明       | 支持的选项            |
| ------ | ---------- | --------------------- |
| sum    | 求和       | ignoreZero, absolute  |
| avg    | 平均值     | ignoreZero            |
| count  | 计数       | ignoreZero, predicate |
| max    | 最大值     | absolute              |
| min    | 最小值     | absolute              |
| custom | 自定义方法 | method                |

### summaryMethod 参数

| 参数    | 说明       | 类型  |
| ------- | ---------- | ----- |
| columns | 列配置数组 | array |
| data    | 表格数据   | array |