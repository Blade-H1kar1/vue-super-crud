---
name: sc-crud
description: vue-super-crud 库组件。只要用户需要生成、编写、修改任何表格、列表、CRUD 页面，无论是提到"表格""列表""增删改查""sc-crud""sc-table"还是直接让你写页面，都必须立即使用本 skill。本 skill 负责生成完整的 sc-crud options 配置，涵盖 renderColumns 列渲染、search 搜索、pagination 分页、handleRow 操作行、action 操作列、selection/index/expand 特殊列、editConfig 编辑模式、listApi/deleteApi、插槽等所有表格相关配置。
---

# vue-super-crud sc-crud 表格配置

## 重要前提

- `sc-crud` 是基于 `el-table` 的二次封装。**所有 `el-table` 原生的属性、事件、方法均可继续使用**。
- `renderColumns` 的通用渲染细则（comp/render/slot/formatter/dict/校验等）请同时应用子 Skill `renderColumns`


## 组件绑定（模板侧）

```html
<sc-crud
  :options="options"
  :data="data"
  :total="total"
  :loading.sync="loading"
  :search.sync="searchParams"
  @getList="getList"
/>
```

- `@getList`：远程分页时由组件自动触发（搜索参数变化、翻页等）
- `listApi` / `deleteApi`：当接口不需要特殊处理时优先使用，而不是先使用`@getList`、`@delete`
- **搜索功能已内置**：只需在 `renderColumns` 的列上配置 `search: true`，组件头部会自动出现搜索表单，**无需在页面中额外编写搜索表单**

## 完整 options 带注释配置对象

把下面这份配置按需裁剪。**注释即文档**，每个字段的含义、可选值、默认值都写在同行注释里。

```js
const options = {
  // ─── 基础 ──────────────────────────────────────────────
  title:    "表格标题",           // 表格标题文本
  init:     true,                // true = 组件挂载后自动触发 @getList
  disabled: false,               // 全局禁用
  height:   "auto",              // 固定表格高度（"auto" 自适应窗口 / "400px" / 不填）
  maxHeight: "",                 // 最大表格高度
  calcHeight: 0,                 // height 为 auto 时，需额外减去的底部高度值（px）
  gap:      20,                  // 表格外间距（px）

  // ─── 内置 API（配置后无需手动 @getList）────────────────
  listApi:   (params) => api.getList(params),   // 列表获取 API
  deleteApi: (row)   => api.delete(row.id),     // 删除 API

  // ─── 唯一标识 ───────────────────────────────────────────
  uniqueId: false,               // true = 本地为每行生成唯一 _uid 字段
  valueKey: "id",                // 行数据的唯一值字段名，默认 "id"

  // ─── 选择列 / 序号列 / 展开列 ──────────────────────────
  singleSelection: {             // 单选列（布尔简写：singleSelection: true）
    width:  50,
    align:  "center",
  },
  selection: {                   // 多选列（布尔简写：selection: true）
    width:            50,
    align:            "center",
    reserveSelection: true,      // 翻页保留选中状态
    banner:           true,      // 开启选中栏，显示已选项
    labelKey:         "name",    // 选中栏显示的字段名
    clear:            true,      // 选中栏显示清除按钮
    selectable: (row, index) => true, // 控制某行是否可选
  },
  index: {                       // 序号列（布尔简写：index: true）
    label: "序号",
    width: 50,
    align: "center",
  },
  expand: {                      // 展开行列（布尔简写：expand: true）
    width: 50,
    align: "center",
  },

  // ─── 分页 ──────────────────────────────────────────────
  pagination: { // 通常只需要简写为 pagination: true，自带全部参数
    show:            true,
    align:           "right",                                  // left / center / right
    pageSizes:       [10, 20, 30, 50, 100, 200],
    layout:          "total, sizes, prev, pager, next, jumper",
  }, 
  localPagination: false,        // true = 前端本地分页
  localSearch:     false,        // true = 前端本地搜索

  // ─── 行上方操作区（表格左上角）────────────────────────
  handleRow: {
    show:        true,
    handles: [                                             // 自定义按钮
      {
        label:   "批量导出",
        type:    "warning",
        onClick: () => {},
      },
    ],
  },
  // 简写：handleRow: [{ label, onClick }]

  // ─── 操作列（表格最右列）──────────────────────────────
  action: {
    show:         true,
    prop:         "action",      // 列 prop
    label:        "操作",
    handles: [                                       // 自定义按钮
      {
        label:   "详情",
        type:    "text",  // 默认为text类型
        onClick: ({ row }) => {},
        hidden:  ({ row }) => row.status === "disabled",
        confirm: "确定要操作吗？",  // 有值则点击后先弹确认框

        textSubmit: { // 需要输入原因后再提交确认框
          title: '驳回原因',
          label: '驳回原因',
          rows: 4, // 默认值
        },
        onClick: ({ row }, cb, reason)=> { // 结合textSubmit
          console.log("驳回原因:", cb, reason);
          cb(); // 完成后调用回调
        }
      },
    ],
  },
  // 简写：action: [{ label, onClick }]
  // 隐藏操作列：action: false

  // ─── 编辑配置 ──────────────────────────────────────────
  editConfig: {
    mode:    "dialog",             // "free"|"cell"|"row"|"dialog"
    trigger: "manual",             // "manual"|"click"|"dblclick"，默认 manual
    autofocus: true,               // 编辑时自动聚焦（传 string 可指定 prop）
    exclusive: false,              // 行编辑互斥（同时只能编辑一行）
    isRowEdit: ({ row }) => true,  // 控制某行是否可编辑

    // 编辑按钮（presetButtonType 或 buttonItem）
    edit:        { label: "编辑",    type: "primary" },
    add:         { label: "新增",    addType: "last" }, // addType: "first"|"last"
    lastAdd:     { label: "底部新增" },
    addChild:    { label: "新增子级" },
    delete:      { label: "删除",    type: "danger" },
    view:        { label: "查看" },                     // 仅 dialog 模式有效

    // 批量操作（仅 row 模式）
    batch:       { label: "批量编辑", isSelect: true },
    batchDelete: { label: "批量删除" },
  },
  validateMsg: true,             // 校验失败时是否弹提示

  // ─── 渲染列（核心，必填）──────────────────────────────
  // 编辑事件处理见下方「编辑事件」章节
  // 通用列渲染细则（slot/render/comp/formatter/模式拆分等）请见子 Skill: vue-super-crud-render-columns
  renderColumns: [
    // --- 最简列 ---
    { prop: "id", label: "ID" },

    // --- 列显隐控制 ---
    { prop: "remark",  label: "备注", hidden: true },         // 隐藏
    { prop: "secret",  label: "机密", hiddenList: true },     // 仅隐藏列表展示（搜索表单仍显示）

    // --- 搜索条件与表格列不一致时的常用模式 ---
    // 该列在表格中不存在/不需要展示，但需要作为搜索条件始终显示在搜索区
    {
      prop:       "keyword",
      label:      "关键词",
      hiddenList: true,                       // 隐藏表格列
      search: {
        alwaysShow: true,                     // 搜索条件始终展示，不随搜索框收缩而隐藏
        comp: { name: "el-input" },
      },
    },

    // --- 展示格式化 ---
    { prop: "amount", label: "金额", formatter: (row) => `¥${row.amount}` },

    // --- 字典展示 + 下拉搜索 ---
    {
      prop:   "status",
      label:  "状态",
      dict:   "sys_status",
      comp:   { name: "sc-value-format" },
      search: { comp: { name: "el-select" } },
    },

    // --- 编辑态（add/edit 共用写 form）---
    {
      prop:    "name",
      label:   "名称",
      search:  true,              // 开启搜索，默认 el-input
      form: {
        comp:     { name: "el-input" },
        required: true,
        rules:    [{ message: "不能为空", trigger: "blur" }],
      },
    },

    // --- 合并单元格（优先使用 spanProp）---
    // spanProp: true  → 该列相邻同值自动合并行；多列同时配置时自动启用多级排序
    // spanProp: "xx"  → 跟随指定列的合并结果（从属合并，不独立计算）
    { prop: "category", label: "分类", spanProp: true },
    { prop: "name",     label: "名称", spanProp: true },        // 多列 spanProp：先按 category 再按 name 合并
    { prop: "area",     label: "区域", spanProp: "category" },  // 跟随 category 的合并结果
    // index / selection 特殊列同样支持 spanProp，index 会显示合并后的序号

    // --- 嵌套列（多级表头）---
    {
      label:    "时间信息",
      children: [
        { prop: "createTime", label: "创建时间", width: 160 },
        { prop: "updateTime", label: "更新时间", width: 160 },
      ],
    },

    // --- 列汇总 ---
    {
      prop:    "qty",
      label:   "数量",
      summary: {
        type:     "sum",   // sum / avg / max / min / Function
        suffix:   " 件",
        decimals: 0,
      },
    },
  ],
};
```

## 编辑事件：@save / @delete / @batchSave / @batchDelete

**核心规则：接口调用结束后（成功或失败）必须调用 `done()`**，否则按钮持续 loading、编辑状态不复位。

| 事件           | 参数                     | 说明                                      |
| -------------- | ------------------------ | ----------------------------------------- |
| `@save`        | `done, scope, unLoading` | 行/弹窗保存；单元格额外多 `value, column` |
| `@delete`      | `done, scope, unLoading` | 行删除                                    |
| `@batchSave`   | `done, rows, unLoading`  | 批量保存，仅 row 模式                     |
| `@batchDelete` | `done, rows, unLoading`  | 批量删除，仅 row 模式                     |

```js
// 以 @save 为例，其余事件同理
async handleSave(done, scope) {
  try {
    await api.update(scope.row)
    done()        // 退出编辑状态；done(newRow) 可同时更新行数据
  } catch(e) {
    done()        // 失败也必须调用
  }
}
```

### 保存前校验（有 required/rules 时必须先 validate）

`validate()` / `validateAll()` 返回 Promise，校验失败会 reject，`await` 写法可自动中断后续代码，**无需手动 try/catch 判断结果**。

```js
// 模板中获取组件实例
// <sc-crud ref="crud" ... />

async handleSave(done, scope) {
  try {
    await this.$refs.crud.validate()   // 校验失败直接抛出，不执行后面的代码
    await api.update(scope.row)
    done()
  } catch(e) {
    done()                             // 校验失败或接口报错都必须调用 done()
  }
}

// 全量校验（本地分页 / 树形数据等场景）
async handleSave(done, scope) {
  try {
    await this.$refs.crud.validateAll()  // mode 默认 "all"，收集全部错误并弹窗
    // await this.$refs.crud.validateAll({ mode: "first" }) // 遇到第一个错误即中断
    await api.update(scope.row)
    done()
  } catch(e) {
    done()
  }
}
```

---

## renderColumns 模式拆分（sc-crud 专属规则）

- **展示态（非编辑）**：写在根层（如 `formatter` / `comp: { name: "sc-value-format" }`）
- **编辑态（add/edit 共用）**：优先写在 `form: { ... }`
- **仅 add 或仅 edit 不同**：再分别覆写 `add: { ... }` / `edit: { ... }`
- **搜索（内置，无需额外写搜索表单）**：在列上配置 `search` 后，组件顶部自动渲染搜索表单，点击搜索/重置自动触发 `@getList`
  - 最简：`search: true`（默认渲染 `el-input`）
  - 自定义组件：`search: { comp: { name: "el-select" } }`
- **`search` / `form` 编辑状态** 已默认渲染 `comp: { name: "el-input" }`，不需要重复配置

### 列宽与省略号（表格默认行为，无需手动配置）
- 表格列会根据**表头文本宽度**自动计算并设置一个合适的最小宽度，一般**不需要手动配置 `width`/`minWidth`**，只有在与需求差距较大时再显式指定。
- 单元格内容超长时，默认会自动省略并提供悬浮提示（即 `showOverflowTooltip` 已默认开启），通常**不需要再手动设置 `showOverflowTooltip: true`**。

## 插槽速查

列插槽：`[prop]` / `[prop]-header` / `[prop]-form` / `[prop]-add` / `[prop]-edit` / `[prop]-view` / `[prop]-search` / `[prop]-searchHeader`

区域插槽（`title` / `handleRow` / `toolbar` / `pagination`）：直接写插槽名覆盖整块；加 `-left/right/top/bottom` 后缀则在对应侧扩展，如 `handleRow-left`。

其他：`empty`（空状态）

## 简写规范化规则（必须记住）

- `selection / index / expand / singleSelection`：`true` → `{ show: true }`，`false` → 隐藏
- `toolbar / handleRow / action`：`true` → `{ show: true }`，数组 → `{ handles: [...] }`，`false` → 隐藏
- `action: false` 隐藏操作列

## 快速排错

1. `renderColumns` 漏写或为 `[]` → 表格空白
2. 搜索不生效 → 检查列是否写了 `search`，搜索插槽是否用 `#prop-search`
3. 编辑态组件不生效 → 编辑态配置必须写进 `form/add/edit`，不能只写根层 `comp`
4. `search` 的层级是否正确 → `search: true` vs `search: { ... }`
5. 操作列不显示 → 检查 `action` 是否被设为 `false`，或内置按钮（edit/view/delete）未开启
6. 工具栏按钮不显示 → 确认 `toolbar.show` 不为 `false`，各内置按钮 `show` 未被禁用
