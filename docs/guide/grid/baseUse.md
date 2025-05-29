# 布局组件

布局组件基于CSS Grid实现，提供了灵活的网格布局系统。组件包含两个主要部分：
- `sc-grid`: 网格容器组件
- `sc-cell`: 网格单元格组件

## 基本使用

```vue
<template>
  <sc-grid :columns="3" :gap="20">
    <sc-cell :widthSize="2">占据2列</sc-cell>
    <sc-cell>占据1列</sc-cell>
    <sc-cell>占据1列</sc-cell>
  </sc-grid>
</template>
```

## 布局模式

### 固定列数模式（默认）

最基本的网格布局方式，通过columns属性指定列数：

```vue
<sc-grid :columns="3">
  <sc-cell>1</sc-cell>
  <sc-cell>2</sc-cell>
  <sc-cell>3</sc-cell>
</sc-grid>
```

### 自动填充模式-自动适应
```vue
<sc-grid autoFill="autoFit" :columnWidth="200">
  <sc-cell>自适应宽度</sc-cell>
  <sc-cell>自适应宽度</sc-cell>
</sc-grid>
```

### 自动填充模式-固定宽度
```vue
<sc-grid autoFill="fixedWidth" :columnWidth="200">
  <sc-cell>固定宽度</sc-cell>
  <sc-cell>固定宽度</sc-cell>
</sc-grid>
```

### 自动填充模式-响应式布局
```vue
<sc-grid 
  autoFill="autoFit" 
  :minColumns="2" 
  :maxColumns="4" 
  :columnWidth="300"
>
  <sc-cell>响应式单元格</sc-cell>
  <sc-cell>响应式单元格</sc-cell>
  <sc-cell>响应式单元格</sc-cell>
</sc-grid>
```


### 列宽控制-固定列宽
```vue
<sc-grid :columns="3" columnWidth="200px">
  <sc-cell>固定200px</sc-cell>
  <sc-cell>固定200px</sc-cell>
</sc-grid>
```

### 列宽控制-最小最大列宽
```vue
<sc-grid :columns="3" :minColumnWidth="200" :maxColumnWidth="300">
  <sc-cell>最小200px，最大300px</sc-cell>
  <sc-cell>最小200px，最大300px</sc-cell>
</sc-grid>
```

### 列宽控制-自适应列宽
```vue
<sc-grid :columns="3">
  <sc-cell>自适应宽度</sc-cell>
  <sc-cell>自适应宽度</sc-cell>
</sc-grid>
```

## 单元格布局

###  基础跨列
```vue
<sc-grid :columns="3">
  <sc-cell :widthSize="2">占据2列</sc-cell>
  <sc-cell>占据1列</sc-cell>
</sc-grid>
```

###  跨行跨列
```vue
<sc-grid :columns="3">
  <sc-cell :widthSize="2" :heightSize="2">占据2x2</sc-cell>
  <sc-cell>占据1x1</sc-cell>
  <sc-cell>占据1x1</sc-cell>
</sc-grid>
```

###  指定位置
```vue
<sc-grid :columns="3">
  <sc-cell :left="2" :top="1">从第2列第1行开始</sc-cell>
  <sc-cell>默认位置</sc-cell>
</sc-grid>
```

###  居中对齐
```vue
<sc-grid :columns="3">
  <sc-cell center>居中内容</sc-cell>
  <sc-cell>默认对齐</sc-cell>
</sc-grid>
```

## 高级用法

### 网格区域

使用areas属性定义网格区域，实现复杂布局：

```vue
<sc-grid 
  :columns="3" 
  :areas="[
    'header header header',
    'sidebar main main',
    'footer footer footer'
  ]"
>
  <sc-cell area="header">头部</sc-cell>
  <sc-cell area="sidebar">侧边栏</sc-cell>
  <sc-cell area="main">主要内容</sc-cell>
  <sc-cell area="footer">底部</sc-cell>
</sc-grid>
```

### 自定义样式

通过gridStyle和cellStyle属性自定义样式：

```vue
<sc-grid 
  :gridStyle="{ backgroundColor: '#f5f5f5' }"
  :columns="3"
>
  <sc-cell 
    :cellStyle="{ padding: '20px', backgroundColor: '#fff' }"
  >
    自定义样式单元格
  </sc-cell>
</sc-grid>
```

### 间距控制

使用gap属性控制网格间距：

```vue
<sc-grid :columns="3" :gap="20">
  <sc-cell>间距20px</sc-cell>
  <sc-cell>间距20px</sc-cell>
</sc-grid>
```

也可以分别控制行列间距：

```vue
<sc-grid 
  :columns="3" 
  :columnGap="20"
  :rowGap="30"
>
  <sc-cell>列间距20px，行间距30px</sc-cell>
  <sc-cell>列间距20px，行间距30px</sc-cell>
</sc-grid>
```

## 常见应用场景

### 表单布局
```vue
<sc-grid :columns="2" :gap="20">
  <sc-cell>表单项1</sc-cell>
  <sc-cell>表单项2</sc-cell>
  <sc-cell :widthSize="2">表单项3（占满行）</sc-cell>
</sc-grid>
```

### 卡片布局
```vue
<sc-grid 
  autoFill="autoFit" 
  :columnWidth="300"
  :gap="20"
>
  <sc-cell>卡片1</sc-cell>
  <sc-cell>卡片2</sc-cell>
  <sc-cell>卡片3</sc-cell>
</sc-grid>
```

### 响应式页面布局
```vue
<sc-grid 
  :columns="12"
  :areas="[
    'header header header header header header header header header header header header',
    'sidebar sidebar main main main main main main main main main main',
    'footer footer footer footer footer footer footer footer footer footer footer footer'
  ]"
>
  <sc-cell area="header">头部导航</sc-cell>
  <sc-cell area="sidebar">侧边菜单</sc-cell>
  <sc-cell area="main">主要内容</sc-cell>
  <sc-cell area="footer">页脚信息</sc-cell>
</sc-grid>
```

## 注意事项

1. Grid组件必须设置columns属性来定义网格列数
2. Cell组件的widthSize不能超过Grid的columns值
3. 使用areas属性时，需要确保每个cell都有对应的area属性
4. 自动填充模式下，columnWidth属性是必需的
5. 使用minColumnWidth和maxColumnWidth时，建议同时设置columns属性

## API

### Grid 属性

| 参数           | 说明             | 类型                                 | 默认值 |
| -------------- | ---------------- | ------------------------------------ | ------ |
| columns        | 网格列数         | number                               | 1      |
| autoFill       | 自动填充模式     | boolean \| 'autoFit' \| 'fixedWidth' | -      |
| fillCell       | 是否填充满单元格 | boolean                              | false  |
| minColumns     | 最小列数         | number                               | -      |
| maxColumns     | 最大列数         | number                               | -      |
| columnWidth    | 列宽             | string \| number                     | -      |
| minColumnWidth | 最小列宽         | string \| number                     | -      |
| maxColumnWidth | 最大列宽         | string \| number                     | -      |
| gap            | 网格间距         | object                               | -      |
| columnGap      | 列间距           | string \| number                     | -      |
| rowGap         | 行间距           | string \| number                     | -      |
| areas          | 网格区域         | array \| string                      | -      |
| minRowHeight   | 最小行高         | string \| number                     | -      |
| maxRowHeight   | 最大行高         | string \| number                     | -      |
| alignContent   | 垂直对齐方式     | string                               | -      |
| rows           | 行数             | number \| string                     | -      |
| justifyContent | 水平对齐方式     | string                               | -      |
| flow           | 网格流向         | string                               | -      |
| height         | 容器高度         | string \| number                     | 'auto' |
| gridStyle      | 自定义样式       | object                               | {}     |

### Cell 属性

| 参数       | 说明         | 类型             | 默认值 |
| ---------- | ------------ | ---------------- | ------ |
| widthSize  | 占据列数     | number \| string | 1      |
| heightSize | 占据行数     | number \| string | 1      |
| area       | 网格区域名称 | string           | -      |
| center     | 是否居中     | boolean          | -      |
| left       | 起始列位置   | number           | -      |
| top        | 起始行位置   | number           | -      |
| cellStyle  | 自定义样式   | object           | {}     |