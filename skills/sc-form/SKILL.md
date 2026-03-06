---
name: sc-form
description: vue-super-crud 库组件。只要用户需要生成、编写、修改任何表单、详情页、sc-form 组件，无论是提到"表单""详情""sc-form"还是直接让你写表单页面，都必须立即使用本 skill。本 skill 负责生成完整的 sc-form options 配置，涵盖 renderColumns 列渲染、grid 布局、校验、详情模式、分组、action 按钮、contextMenu 右键菜单、插槽等所有表单相关配置。renderColumns 的通用渲染细则（comp/render/slot/formatter/dict 等）请同时应用子 Skill `renderColumns`。
---

# vue-super-crud sc-form 表单配置

## 重要前提

- `sc-form` 是基于 `el-form` 的二次封装，**所有 `el-form` 原生属性均可继续使用**
- `v-model` 绑定的数据对象**无需提前声明字段**，组件内部自动处理响应式
- `renderColumns` 的通用渲染细则（comp/render/slot/formatter/dict/校验等）请同时应用子 Skill `renderColumns`

## 组件绑定（模板侧）

```html
<sc-form
  v-model="formData"
  :options="options"
  :loading="loading"
/>
```

## 完整 options 带注释配置对象

```js
const options = {
  // ─── 基础 ──────────────────────────────────────────────
  title:         "表单标题",
  labelWidth:    "100px",          // 标签宽度，默认 100px
  labelPosition: "right",          // right / left / top，默认 right
  shrinkLabel:   true,             // 标签过长时自动收缩，默认 true
  hiddenLabel:   false,            // 全局隐藏所有标签
  labelOverTip:  false,            // 标签超出一行时隐藏并显示 tooltip
  colon:         false,            // 标签后加冒号
  scrollError:   true,             // 校验失败自动滚动到第一个报错项，默认 true

  // ─── 模式 ──────────────────────────────────────────────
  detail: false,                   // true = 详情只读模式（整个表单）
  border: false,                   // true = 边框模式（detail 模式下更清晰）

  // ─── 布局（Grid，默认）────────────────────────────────
  layout:      "grid",             // "grid"（默认值）| "el-row"
  columns:     2,                  // 表单列数，默认 1
  columnWidth: "300px",            // 固定列宽（与 columns 二选一）
  columnGap:   "16px",             // 列间距
  rowGap:      "8px",              // 行间距

  // ─── 渲染列（核心，必填）──────────────────────────────
  renderColumns: [
    // --- 最简列 ---
    { prop: "name", label: "姓名" },  // 默认渲染 el-input

    // --- 指定组件 ---
    {
      prop:  "gender",
      label: "性别",
      comp:  { name: "el-select", options: [{ label: "男", value: 1 }, { label: "女", value: 0 }] },
    },

    // --- 字典 ---
    { prop: "status", label: "状态", dict: "sys_status", comp: { name: "el-select" } },

    // --- 校验 ---
    {
      prop:     "phone",
      label:    "手机号",
      required: true,                          // 简写必填
      rules:    ["mobile"],                    // 内置预设规则
    },
    {
      prop:     "email",
      label:    "邮箱",
      required: true,
      rules:    [{ regular: /^.+@.+$/, message: "格式不正确" }],
    },

    // --- 跨列/跨行 ---
    { prop: "remark", label: "备注", widthSize: 2, comp: { name: "el-input", type: "textarea" } },

    // --- 显隐控制 ---
    { prop: "extra", label: "扩展", hidden: ({ model }) => !model.isAdmin },

    // --- tooltip 提示 ---
    { prop: "code", label: "编码", tooltip: "全局唯一，不可重复" },

    // --- 详情模式列级自定义 ---
    {
      prop:   "amount",
      label:  "金额",
      detail: {
        render: (h, { row }) => <span style="color:#f00">¥{row.amount}</span>,
      },
    },
  ],
};
```

## 详情模式

```js
// 整个表单只读
options: { detail: true }

// 带边框的详情（更清晰的分栏效果）
options: { detail: true, border: true }

// 单列局部只读：在列上配置 detail
{ prop: "name", label: "姓名", detail: true }  // 该字段始终只读
{ prop: "name", label: "姓名", detail: { render: (h, { row }) => <b>{row.name}</b> } }
```


## 校验方式
```js
async handleSave() {
  await this.$refs.form.validate()  // 失败则抛出，不执行后续
  await api.save(this.formData)
}
```

## 插槽速查

| 插槽名           | 说明                                          |
| ---------------- | --------------------------------------------- |
| `[prop]`         | 字段渲染（所有模式）                          |
| `[prop]-label`   | 自定义标签，作用域 `{ item, scope }`          |
| `[prop]-tooltip` | 自定义 tooltip 内容，作用域 `{ item, scope }` |
| `title`          | 表单标题区                                    |

## 简写规则

- `detail: true` → 整表只读；列上写 `detail: true` → 单字段只读
- `required: true` → 必填；`required: { message, trigger }` → 自定义必填提示
- `hidden: true` → 静态隐藏；`hidden: ({ model }) => bool` → 动态隐藏

## 快速排错

1. 表单数据不响应 → `v-model` 绑定的对象无需预声明字段，但要确保 `prop` 与字段名匹配
2. 组件不显示 → `renderColumns` 漏写或 `comp.name` 填错
3. 校验不触发 → 确认 `required`/`rules` 在列的根层，且触发方式（trigger）与操作一致
4. 详情模式编辑态仍可改 → 检查是否漏写 `detail: true`，或列上 `detail` 配置优先级覆盖了全局
5. 布局错乱 → 检查 `columns` 与 `widthSize` 之和是否超出总列数
