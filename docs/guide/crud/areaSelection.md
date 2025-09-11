# 类 Excel 区域选择

## 概述

区域选择功能为表格提供了类似 Excel 的操作体验，支持单元格区域选择、复制粘贴、智能填充、撤销重做等功能。该功能特别适用于需要批量编辑数据的场景。

## 功能特性

- **区域选择**：支持鼠标拖拽选择单元格区域
- **整列选择**：点击、拖拽表头可选择整列数据
- **整行选择**：针对特殊列（如序号列、选项列）支持点击、拖拽选择整行
- **键盘操作**：支持 Ctrl+A 全选、Ctrl+C 复制、Ctrl+V 粘贴、Ctrl+X 剪切等快捷键
- **智能填充**：支持数值序列、日期序列、文本序列的智能识别和填充
- **撤销重做**：支持 Ctrl+Z 撤销和 Ctrl+Y 重做操作
- **复制粘贴**：支持单元格数据的复制粘贴，包括跨表格操作
- **自定义填充**：支持自定义填充列表，如星期、月份等
- **复杂表格兼容**：完美兼容固定列、合并单元格、树级折叠等复杂表格结构


## 快捷键操作

区域选择功能支持以下快捷键操作：

| 快捷键                         | 功能       | 说明                         |
| ------------------------------ | ---------- | ---------------------------- |
| `Ctrl + A`                     | 全选       | 选择表格中所有可编辑的单元格 |
| `Ctrl + C`                     | 复制       | 复制选中区域的数据           |
| `Ctrl + Shift + C`             | 复制带表头 | 复制选中区域的数据并携带表头 |
| `Ctrl + V`                     | 粘贴       | 粘贴剪贴板数据到选中区域     |
| `Ctrl + X`                     | 剪切       | 剪切选中区域的数据           |
| `Ctrl + Z`                     | 撤销       | 撤销上一步操作               |
| `Ctrl + Y`、`Ctrl + Shift + Z` | 重做       | 重做上一步撤销的操作         |


## 复制粘贴操作

支持单元格数据的复制粘贴，包括表格内部和外部应用程序（如Excel）之间的数据交换。
黏贴时，支持智能填充和循环填充。

### 粘贴模式
- **智能粘贴**：根据目标单元格的组件类型自动格式化数据
- **循环填充**：当选中区域数倍于复制区域时，自动循环填充

<ClientOnly>
<common-code-format>
  <crud-areaSelection-copyPaste slot="source"></crud-areaSelection-copyPaste>
  
<<< @/docs/.vuepress/components/crud/areaSelection/copyPaste.vue
</common-code-format>
</ClientOnly>

## 智能填充

智能填充功能可以自动识别数据模式并生成序列数据。

### 操作说明

1. 选择包含模式数据的单元格（至少2个）
2. 拖拽选择区域右下角的填充手柄
3. 系统会自动识别数据模式并填充

### 支持的填充模式

1. **数值序列**：如 1, 2, 3... 或 10, 20, 30...
2. **日期序列**：如 2024-01-01, 2024-01-02...
3. **文本+数字序列**：如 项目1, 项目2, 项目3...
4. **自定义列表**：如星期一, 星期二... 或一月, 二月...
5. **复制模式**：当无法识别模式时，重复复制源数据。

::: tip
按住 `Ctrl` 键时，强制使用复制模式。
:::

## 自定义填充列表

可以通过 `fillCustomLists` 配置自定义的填充序列：

```javascript
// 配置自定义填充列表
areaSelection: {
  fillCustomLists: [
    ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    ['第一季度', '第二季度', '第三季度', '第四季度']
  ]
}
```

<ClientOnly>
<common-code-format>
  <crud-areaSelection-smartFill slot="source"></crud-areaSelection-smartFill>
  
<<< @/docs/.vuepress/components/crud/areaSelection/smartFill.vue
</common-code-format>
</ClientOnly>


## 撤销重做

支持操作历史的撤销和重做功能： </br>

撤销：按 Ctrl+Z 回退上一步操作 </br>
重做：按 Ctrl+Y 或 Ctrl+Shift+Z 重新执行上一步撤销的操作 </br>

## 复杂表格支持

<ClientOnly>
<common-code-format>
  <crud-areaSelection-comprehensive slot="source"></crud-areaSelection-comprehensive>
  
<<< @/docs/.vuepress/components/crud/areaSelection/comprehensive.vue
</common-code-format>
</ClientOnly>

## API


### areaSelection 配置项

| 参数            | 说明                 | 类型    | 默认值 |
| --------------- | -------------------- | ------- | ------ |
| show            | 是否显示区域选择功能 | boolean | true   |
| hidden          | 是否隐藏区域选择功能 | boolean | false  |
| operationType   | 数据操作类型         | string  | 'edit' |
| selectAll       | 是否启用全选功能     | boolean | true   |
| copy            | 是否启用复制功能     | boolean | true   |
| paste           | 是否启用粘贴功能     | boolean | true   |
| cut             | 是否启用剪切功能     | boolean | true   |
| fill            | 是否启用填充功能     | boolean | true   |
| undo            | 是否启用撤销功能     | boolean | true   |
| redo            | 是否启用重做功能     | boolean | true   |
| selection       | 是否启用区域选择     | boolean | true   |
| fillCustomLists | 自定义填充列表       | Array   | []     |

### operationType 说明

- **'all'**：对所有数据进行操作，包括只读单元格
- **'edit'**：仅对可编辑的单元格进行操作（默认）

<!-- ### 自定义配置示例

<ClientOnly>
<common-code-format>
  <crud-areaSelection-customConfig slot="source"></crud-areaSelection-customConfig>
  
<<< @/docs/.vuepress/components/crud/areaSelection/customConfig.vue
</common-code-format>
</ClientOnly> -->