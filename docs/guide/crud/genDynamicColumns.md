# 动态列

通过 `dynamicConfig` 配置可以快速生成多层级的动态列，常用于通过树级数据生成多层级列。

## 单层级动态列

`path` 设置树级数据路径，`prop` 设置树级数据唯一标识。

<ClientOnly></ClientOnly>
<common-code-format>
<crud-genDynamicColumns-base slot="source"></crud-genDynamicColumns-base>

<<< @/docs/.vuepress/components/crud/genDynamicColumns/base.vue
</common-code-format>
</ClientOnly>

## 多层级动态列

通过 `columnConfig` 可以设置列渲染配置，可以获取树级路径 `path` 和树级数据 `source` 。

<ClientOnly>
<common-code-format>
<crud-genDynamicColumns-treeDynamic slot="source"></crud-genDynamicColumns-treeDynamic>

<<< @/docs/.vuepress/components/crud/genDynamicColumns/treeDynamic.vue
</common-code-format>
</ClientOnly>

## 多层级动态列和固定子列

通过 `source[row.$index]` 可以获取到当前行的层级数据。 </br>
支持响应式修改数据。

<ClientOnly>
<common-code-format>
<crud-genDynamicColumns-dynamicAndFixed slot="source"></crud-genDynamicColumns-dynamicAndFixed>

<<< @/docs/.vuepress/components/crud/genDynamicColumns/dynamicAndFixed.vue
</common-code-format>
</ClientOnly>

## 数据格式与转换

```js
// 数据结构为: 
const data = [
  {
    materialCode: `M001`,
    materialName: `产品1`,
    materialSpec: `规格 1`,
    quantityGradeName: "A",
    firstChildren: [
      // 第一层级
      {
        id: "S001", // 第一层级唯一标识
        name: "供应商1", // 第一层级名称
        secondChildren: [
          // 第二层级
          {
            sort: 1, // 第二层级唯一标识
            productUnitPrice: 100,
            priceFollow: "Y",
            priceDifference: -10,
            pricePercentageChange: 0.1,
          },
          {
            sort: 2,
            productUnitPrice: 90,
            priceFollow: "N",
            priceDifference: 5,
            pricePercentageChange: 0.05,
          },
        ],
      },
    ],
  },
];

// 转换后的数据结构为:

const data = [
  {
    materialCode: `M001`,
    materialName: `产品1`,
    materialSpec: `规格 1`,
    quantityGradeName: "A",
    S001: {  // 第一层级唯一标识
      id: "S001",
      name: "供应商1",
      1: { // 第二层级唯一标识
        sort: 1,
        productUnitPrice: 100,
        priceFollow: "Y",
        priceDifference: -10,
        pricePercentageChange: 0.1,
      },
      2: {
        sort: 2,
        productUnitPrice: 90,
        priceFollow: "N",
        priceDifference: 5,
        pricePercentageChange: 0.05,
      },
    },
    firstChildren: [ // 原来的数据依旧保留
      {
        id: "S001",
        name: "供应商1",
        secondChildren: [
          {
            sort: 1,
            productUnitPrice: 100,
            priceFollow: "Y",
            priceDifference: -10,
            pricePercentageChange: 0.1,
          },
          {
            sort: 2,
            productUnitPrice: 90,
            priceFollow: "N",
            priceDifference: 5,
            pricePercentageChange: 0.05,
          },
        ],
      },
    ],
  },
];
```

## options 配置项

| 参数                  | 说明                                                    | 类型   | 默认值 |
| --------------------- | ------------------------------------------------------- | ------ | ------ |
| dynamicInsertPosition | 动态列插入位置，可接收普通列的 prop 值，或者 index 索引 | String | -      |
| dynamicConfig         | 动态列配置数组                                          | Array  | -      |

## dynamicConfig 配置项

| 参数         | 说明                 | 类型                  | 默认值 |
| ------------ | -------------------- | --------------------- | ------ |
| path         | 当前层级数据路径     | String                | -      |
| prop         | 当前层级唯一标识     | String                | -      |
| label        | 当前层级标题字段     | String/Function(item) | -      |
| columnConfig | 设置真正的渲染列配置 | Function(path, item)  | -      |
