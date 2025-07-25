# 基本使用

`Grid` 是一个基于 CSS Grid 布局封装的灵活网格组件，提供了丰富的布局功能和灵活的配置选项。它可以轻松创建响应式网格布局，支持自动填充、固定列数、区域命名等多种布局方式。

## 基础布局

`Grid` 组件通过 `columns` 属性设置列数，`columnWidth` 属性设置固定列宽。

<ClientOnly>
<common-code-format>
  <grid-base slot="source"></grid-base>
                  
  <<< @/docs/.vuepress/components/grid/base.vue
</common-code-format>
</ClientOnly>

## 自动填充模式

`Grid` 组件支持自动填充模式，通过 `autoFill` 属性配置：
- `true` 或 `'autoFill'`：自动填充模式，根据容器宽度自动填充尽可能多的列
- `'autoFit'`：自动适应模式，根据容器宽度自动调整列数，确保填满整个容器
- `'fixedWidth'`：固定宽度模式，所有列使用相同的固定宽度

<ClientOnly>
<common-code-format>
  <grid-autoFill slot="source"></grid-autoFill>
                  
  <<< @/docs/.vuepress/components/grid/autoFill.vue
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

## 单元格定位

`Cell` 组件可以通过 `widthSize`、`heightSize`、`left` 和 `top` 属性精确控制单元格的大小和位置。这些属性允许您创建复杂的网格布局，而无需使用命名区域。


<ClientOnly>
<common-code-format>
  <grid-cell slot="source"></grid-cell>
                  
  <<< @/docs/.vuepress/components/grid/cell.vue
</common-code-format>
</ClientOnly>


## API 文档

### Grid 属性

| 属性名         | 说明                                                                                          | 类型               | 默认值 |
| -------------- | --------------------------------------------------------------------------------------------- | ------------------ | ------ |
| columns        | 列数                                                                                          | `Number`           | 1      |
| autoFill       | 自动填充模式                                                                                  | `Boolean / String` | false  |
| fillCell       | 是否填充空白单元格                                                                            | `Boolean`          | false  |
| columnWidth    | 设置列的基础宽度，在`autoFill`和`autoFit`模式下作为最小宽度，在`fixedWidth`模式下作为固定宽度 | `String / Number`  | -      |
| minColumnWidth | 设置列的最小宽度，仅在`autoFill`和`autoFit`模式下生效                                         | `String / Number`  | -      |
| maxColumnWidth | 设置列的最大宽度，仅在`autoFill`和`autoFit`模式下生效                                         | `String / Number`  | -      |
| gap            | 网格间隙（同时设置行列间隙）                                                                  | `String / Number`  | -      |
| columnGap      | 列间隙                                                                                        | `String / Number`  | -      |
| rowGap         | 行间隙                                                                                        | `String / Number`  | -      |
| areas          | 网格区域名称                                                                                  | `String / Array`   | -      |
| minRowHeight   | 最小行高                                                                                      | `String / Number`  | 'auto' |
| maxRowHeight   | 最大行高                                                                                      | `String / Number`  | 'auto' |
| alignContent   | 垂直对齐方式                                                                                  | `String`           | -      |
| rows           | 行数配置                                                                                      | `Number / String`  | -      |
| justifyContent | 水平对齐方式                                                                                  | `String`           | -      |
| flow           | 网格流动方向                                                                                  | `String`           | -      |
| height         | 容器高度                                                                                      | `String / Number`  | 'auto' |
| gridStyle      | 自定义网格样式                                                                                | `Object`           | {}     |

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