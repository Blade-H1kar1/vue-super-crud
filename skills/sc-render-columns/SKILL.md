---
name: vue-super-crud-render-columns
description: vue-super-crud 库通用子 skill。作为 sc-crud/sc-form skill 的子 skill，处理 renderColumns 列渲染细节。也可独立触发：当用户单独提到 sc-form、render 函数/JSX、comp 配置、formatter、插槽命名（slot/#prop/#prop-mode）、渲染优先级、scope.row/dict/self、add/edit/view/detail 模式拆分、列不生效排错等场景时使用。
---

# vue-super-crud renderColumns 通用规则

## prop 深度绑定

`prop` 支持**点号路径**绑定嵌套对象。

```js
// 数据为 { deep1: { deep2: { name: "名称" } } }
{ prop: "deep1.deep2.name", label: "名称" }
```

## 快速判断：该用哪种写法
- **纯文本**：无需任何配置，默认取值 `scope.row[prop]`（深度 prop 自动解析路径）。
- **只格式化展示**：优先用 `formatter`（必要时配 `html: true`）。
- **少量自定义、想在模板里写**：用插槽 `#prop` 或 `#prop-mode`。
- **复杂节点结构/交互**：用 `render(h, scope)`（JSX/VNode）。
- **输入组件/可编辑/字典展示**：用 `comp`（对象或函数）+（可选）`bind(scope)`。

## 通用渲染优先级（抢占顺序）
1. **插槽 slot**：`#prop` 或 `#prop-mode`
2. **render 函数**：`render(h, scope)`
3. **comp 组件配置**：`comp`（对象或函数）
4. **默认渲染**：表格默认文本；表单默认 `el-input`（可配 `formatter` 改文本）

## scope 速查
- `scope.row`：当前数据（表格=当前行；表单=整个 model）
- `scope.dict`：字典数据
- `scope.self`：Render 组件实例

## comp 配置要点
### comp 两种形态（都能拿 scope）
- 正常配置：
```js
comp: {
  name: "el-select",
  on: { change: (val, scope) => {} },
  clearable: true,
}
```

- 函数获取参数
```js
comp: (scope) => ({
  name: "el-input",
  disabled: scope.row?.status === "disabled"
})
```

- 所有使用comp渲染的表单组件默认以下参数
  - placeholder 默认为"请输入/请选择 + `label`"，不需要额外配置，
  - clearable 默认为 true

## 模式拆分与继承（最常见踩坑点）

### sc-form（详情态）
- 详情通常用 `detail` 覆写（不是 `view`）

### 默认渲染
- `sc-form` 的 `form` 编辑状态已默认渲染 `comp: { name: "el-input" }`

### 默认继承（减少重复写）
当写 `form/add/edit/view/detail` 这些嵌套对象时，通常会**继承基础列的** `label/prop/dict` 信息；因此优先在"基础列"写通用信息，在子模式里只写差异项。

## 插槽命名（避免"不生效"）
- `#prop`：影响所有 mode
- `#prop-mode`：只影响对应 mode（例：`#name-edit`、`#status-view`、`#date-search`、`#date-search-label`）

## formatData 数据格式化

解决**组件所需格式与业务数据格式不一致**的问题（如 el-cascader 需要数组、但后端存多个字段）。
- `input`：业务数据 → 组件格式（读取时转换）
- `output`：组件格式 → 业务数据（提交时转换）
- `formatValue`：`true` 时格式化后的值额外存到 `row.$prop`；传字符串则存到指定字段名

```js
// ① 预设类型（type 字符串）
{ prop: "tags",    label: "标签",  formatData: { type: "strToArr" } }          // "前端,Vue" ↔ ["前端","Vue"]
{ prop: "address", label: "省市区", formatData: { type: "multiPropToArr", multiProp: ["province","city","district"], isObject: true } } // 多字段 ↔ 数组
{ prop: "price",   label: "金额",  formatData: { type: "numberFormat", prefix: "¥", precision: 2, thousandth: true } }
// ② 直接写预设名（简写，不需要其他参数时）
{ prop: "tags", label: "标签", formatData: "strToArr" }

// ③ 自定义 input/output 函数
{
  prop: "custom",
  label: "自定义",
  formatData: {
    input:  (value) => value + "--suffix",   // 业务值 → 组件值
    output: (value) => value.replace("--suffix", ""), // 组件值 → 业务值
    formatValue: true,   // 同时在 row.$custom 保存格式化后的值
  },
}
// ④ 在 render/插槽中使用 formatData：通过 $value 读写（不能直接用 scope.row[prop]）
{
  prop: "tags",
  label: "标签",
  formatData: "strToArr",
  render: (h, { $value }) => (
    <el-input value={$value.get} onInput={(v) => $value.set(v)} />
  ),
}
```

### 预设类型速查

| type             | 说明          | 关键参数                                      |
| ---------------- | ------------- | --------------------------------------------- |
| `strToArr`       | 字符串 ↔ 数组 | `separator`（默认 `,`）                       |
| `multiPropToArr` | 多字段 ↔ 数组 | `multiProp`（字段名数组）、`isObject`         |
| `numberFormat`   | 数字格式化    | `prefix`、`precision`、`thousandth`、`suffix` |

## presetType 预设模板
通常可以从当前项目下的`template/render` 查找可用的规则
`presetType` 是列配置的快捷引用，匹配全局注册的列模板，避免重复写相同的 comp/formatter 配置。

模板可以是**对象**（静态）或**函数**（接收当前列配置 `item`，可读取列上的自定义字段）：

```js
// 模板注册示例（函数形式，可读取列上的任意字段）
// "testCodeTemplate": (item) => ({
//   search: { comp: { name: item.searchCompName } },
//   form:   { comp: { name: item.formCompName } },
//   formatter: (row) => row[item.prop] + item.suffix,
// })

// 使用时额外字段直接写在列上，模板函数通过 item 读取
{
  prop:           "name",
  label:          "姓名",
  presetType:     "testCodeTemplate",
  searchCompName: "el-select",   // 传给模板的自定义参数
  formCompName:   "el-select",
  suffix:         "元",
}
```

### rules 预设正则规则
通常可以从当前项目下的`template/rules` 查找可用的规则
```js
// 比如正整数
rules: ["integer"]    
```

## 校验配置（required / rules）

校验配置写在列的**根层**即可。

```js
// required：必填
{ prop: "name", label: "姓名", required: true }

// rules 三种形式可混用
{
  prop: "phone",
  label: "手机号",
  rules: [
    "phone",            // ① 内置预设字符串（integer / integer100 / phone / email / number），完整列表见上方「内置 rules 预设字符串」
    { regular: /^\d+$/, message: "只能输入数字" },  // ② 自定义正则
    {                   // ③ validator 函数（第四个参数 scope 是本组件扩展的，可拿整行数据）
      trigger: "change",
      validator: (rule, value, callback, scope) => {
        if (!value) return callback(new Error("不能为空"))
        callback()
      }
    }
  ]
}

// rules 也可以是函数，整体接收 scope，实现联动校验
{
  prop: "endDate",
  label: "结束日期",
  rules: (scope) => [{
    validator: (rule, value, callback) => {
      if (value <= scope.row.startDate) return callback(new Error("须晚于开始日期"))
      callback()
    }
  }]
}
```

> **与标准 el-form 的区别**：`validator` 多了第四个参数 `scope`；`rules` 整体支持函数形式 `(scope) => []`，两者都可直接访问当前行数据。

## 排错清单（renderColumns 不生效时按顺序查）
1. **slot 名是否该用 `prop-mode`**（模式不匹配会导致看起来"不执行"）
2. **是否被更高优先级抢占**（slot/render/comp 会让 formatter 看起来"不生效"）
