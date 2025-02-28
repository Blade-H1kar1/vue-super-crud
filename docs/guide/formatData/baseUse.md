# 基本使用

## 概述

数据格式化（formatData）用于解决组件所需数据格式与业务数据格式不一致的问题。它提供了两个核心功能：
- `input`: 将业务数据转换为组件所需格式
- `output`: 将组件数据转换回业务所需格式

## 示例

<ClientOnly>
<common-code-format>
  <formatData-baseUse slot="source"></formatData-baseUse>
  
<<< @/docs/.vuepress/components/formatData/baseUse.vue
</common-code-format>
</ClientOnly>

## 预设格式化模板

`formatData` 直接指定预设模板的名称：

```javascript
{
  label: "省市区",
  prop: "province",
  formatData: {
    type: "multiPropToArr",
    multiProp: ["province", "city", "district"] // 绑定的多字段参数
  }
}
```

## 自定义当前列的格式化函数

```javascript
{
  label: "自定义",
  prop: "custom",
  formatData: {
    input: (value) => value.join(","),
    output: (value) => value.split(","),
  }
}
```

## 格式化值的存储

如果需要同时保留原始值和格式化后的值，可以通过 `formatValue` 配置存储位置：

```javascript
{
  label: "金额",
  prop: "amount",
  formatData: {
    formatValue: true, // 格式化后的值会存储在 row.$amount
    // 或
    formatValue: "formattedAmount" // 格式化后的值会存储在 row.formattedAmount
  }
}
```

## 全局注册格式化模板

`item` 即为当前列配置，可以获取到传入的配置信息 prop、label、formatData配置 等

```javascript
import superCrud from "src";

Vue.use(superCrud, {
  template: {
    formatData: {
      "custom": (item) => {
        const { prop, label, formatData } = item;
        return {
          input: (value) => value.join(","),
          output: (value) => value.split(","),
        }
      }
    }
  },
});
```

## 在render或插槽渲染中使用

在render或插槽渲染中使用时，需要使用 `$value` 对象来获取和设置值。

```javascript
{
  label: "自定义",
  prop: "custom",
  formatData: "strToArr",
  render: (h, { $value }) => {
    return <el-input value={$value.get} onInput={(v)=>$value.set(v)} />;
  }
}
```
