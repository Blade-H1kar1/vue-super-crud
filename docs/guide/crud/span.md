# 表格合并

表格支持按照指定字段对行进行合并，支持多字段优先级合并。并根据配置的合并字段，自动使用多级排序。

## 基础用法

通过配置合并字段 `spanProp` 启用列的合并功能。自动合并`相同字段值`的行。</br>
特殊列也可以启用合并功能，`index` 列可以获取合并后的索引。

<ClientOnly>
<common-code-format>
  <crud-span-base slot="source"></crud-span-base>
  
<<< @/docs/.vuepress/components/crud/span/base.vue
</common-code-format>
</ClientOnly>

## 特殊列处理

索引列配置`spanProp`，可以获取合并后的索引。</br>
选中列配置`spanProp`，可以操作合并后的选中数据，实际选中还是合并前的数据。</br>

<ClientOnly>
<common-code-format>
  <crud-span-special slot="source"></crud-span-special>

  <<< @/docs/.vuepress/components/crud/span/special.vue
</common-code-format>
</ClientOnly>

## 列级别自定义

通过 `spanMethod` 属性可以自定义某一列的合并规则。

```js
renderColumns: [
  {
    prop: "status",
    label: "状态",
    // 自定义合并规则
    spanMethod: ({ row, rowIndex }) => {
      if (row.status === "pending") {
        return {
          rowspan: 2,
          colspan: 1,
        };
      }
      return {
        rowspan: 1,
        colspan: 1,
      };
    },
  },
];
```

## 表格级别自定义

通过 `spanMethod` 可以自定义整个表格的合并规则。

```js
spanMethod: ({ row, column, rowIndex, columnIndex }) => {
  if (row.status === "pending") {
    return {
      rowspan: 2,
      colspan: 1,
    };
  }
  return {
    rowspan: 1,
    colspan: 1,
  };
};
```

## API

### Column 配置

| 参数       | 说明                 | 类型           | 默认值 |
| ---------- | -------------------- | -------------- | ------ |
| spanProp   | 是否启用列合并       | boolean/string | false  |
| spanMethod | 列级别自定义合并方法 | Function       | -      |

### Options 配置

| 参数       | 说明                   | 类型     | 默认值 |
| ---------- | ---------------------- | -------- | ------ |
| spanMethod | 表格级别自定义合并方法 | Function | -      |

### spanMethod 参数

| 参数        | 说明   | 类型   |
| ----------- | ------ | ------ |
| row         | 行数据 | object |
| column      | 列配置 | object |
| rowIndex    | 行索引 | number |
| columnIndex | 列索引 | number |
