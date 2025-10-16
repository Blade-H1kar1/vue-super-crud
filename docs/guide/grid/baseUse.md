# 基本使用

`Grid` 是一个基于 CSS Grid 布局封装的灵活网格组件，提供了丰富的布局功能和灵活的配置选项。它可以轻松创建响应式网格布局，支持自动填充、固定列数、区域命名等多种布局方式。

## 固定列数布局

`columns` 列数，`columnGap` 列间距，`rowGap` 行间距。

<ClientOnly>
<common-code-format>
  <grid-base slot="source"></grid-base>
                  
  <<< @/docs/.vuepress/components/grid/base.vue
</common-code-format>
</ClientOnly>

## 固定列数-列宽控制布局

通过设置 `columns` 属性来固定列数，并通过不同的 `columnWidth` 来控制布局：

- **平均分配模式**：所有列平均分配可用空间(默认), `columnWidth="1fr"`
- **固定宽度模式**：所有列使用固定宽度，`columnWidth="200px"` 
- **最小最大宽度约束模式**：列宽在最小值和最大值之间自适应， `columnWidth="{min: 100, max: 300}"`
- **独立列宽模式**：每列可以独立设置不同的宽度， `columnWidth="[120, 200, 180]"`
- **高级独立列宽模式**：每列可以独立设置最小宽度和最大宽度， `columnWidth="[{min: 100, max: 300}, {min: 150, max: 250}]"`

<ClientOnly>
<common-code-format>
  <grid-fixedColumns slot="source"></grid-fixedColumns>
                  
  <<< @/docs/.vuepress/components/grid/fixedColumns.vue
</common-code-format>
</ClientOnly>

## 自动填充模式

自动填充响应式网格布局。
`autoFill` 开启自动填充，`columnWidth` 设置每列最小宽度。

<ClientOnly>
<common-code-format>
  <grid-autoFill slot="source"></grid-autoFill>
                  
  <<< @/docs/.vuepress/components/grid/autoFill.vue
</common-code-format>
</ClientOnly>

## 自定义单元格大小、位置

`sc-cell` 组件可以通过 `widthSize`、`heightSize`、`left` 和 `top` 属性精确控制单元格的大小和位置。

<ClientOnly>
<common-code-format>
  <grid-cell slot="source"></grid-cell>
                  
  <<< @/docs/.vuepress/components/grid/cell.vue
</common-code-format>
</ClientOnly>

## 网格区域

`Grid` 组件支持通过 `areas` 属性定义命名的网格区域，配合 `Cell` 组件的 `area` 属性使用。网格区域是CSS Grid布局中的一个强大特性，允许您为网格的特定区域命名，然后将内容放置在这些命名区域中。

<ClientOnly>
<common-code-format>
  <grid-areas slot="source"></grid-areas>
                  
  <<< @/docs/.vuepress/components/grid/areas.vue
</common-code-format>
</ClientOnly>



## API 文档

### Grid 属性

| 属性名         | 说明                                                                                                                                                                                                                  | 类型                               | 默认值 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------ |
| columns        | 列数                                                                                                                                                                                                                  | `Number`                           | 1      |
| autoFill       | 自动填充模式                                                                                                                                                                                                          | `Boolean / String`                 | false  |
| columnWidth    | 设置列的基础宽度。支持多种形式：<br/>- 字符串/数字：统一设置所有列宽度，如 `"200px"`<br/>- 对象：设置最小最大宽度约束，如 `{min: 100, max: 300}`<br/>- 数组：为每列独立设置宽度，如 `[120, 200, 180]`<br/>- 数组(对象)：高级独立列宽配置，如 `[{min: 100, max: 300}, {width: 200}]` | `String / Number / Array / Object` | -      |
| gap            | 网格间隙（同时设置行列间隙）                                                                                                                                                                                          | `String / Number`                  | -      |
| columnGap      | 列间隙                                                                                                                                                                                                                | `String / Number`                  | -      |
| rowGap         | 行间隙                                                                                                                                                                                                                | `String / Number`                  | -      |
| areas          | 网格区域名称                                                                                                                                                                                                          | `String / Array`                   | -      |
| minRowHeight   | 最小行高                                                                                                                                                                                                              | `String / Number`                  | 'auto' |
| maxRowHeight   | 最大行高                                                                                                                                                                                                              | `String / Number`                  | 'auto' |
| alignContent   | 垂直对齐方式                                                                                                                                                                                                          | `String`                           | -      |
| rows           | 行数配置                                                                                                                                                                                                              | `Number / String`                  | -      |
| justifyContent | 水平对齐方式                                                                                                                                                                                                          | `String`                           | -      |
| flow           | 网格流动方向                                                                                                                                                                                                          | `String`                           | -      |
| height         | 容器高度                                                                                                                                                                                                              | `String / Number`                  | 'auto' |
| gridStyle      | 自定义网格样式                                                                                                                                                                                                        | `Object`                           | {}     |
| fillCell       | 是否填充空白单元格                                                                                                                                                                                                    | `Boolean`                          | false  |

### Cell 属性

| 属性名     | 说明                     | 类型              | 默认值 |
| ---------- | ------------------------ | ----------------- | ------ |
| widthSize  | 单元格宽度（跨越的列数） | `Number / String` | 1      |
| heightSize | 单元格高度（跨越的行数） | `Number / String` | 1      |
| area       | 网格区域名称             | `String`          | -      |
| center     | 是否居中显示内容         | `Boolean`         | false  |
| left       | 起始列位置               | `Number / String` | -      |
| top        | 起始行位置               | `Number / String` | -      |
| cellStyle  | 自定义单元格样式         | `Object`          | {}     |