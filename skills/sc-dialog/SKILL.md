---
name: sc-dialog
description: vue-super-crud 库组件。当用户需要使用函数式弹窗 $scDialog、弹窗组件、抽屉弹窗，或涉及弹窗内嵌表单/组件、确认取消钩子、底部按钮自定义时使用。
---

# $scDialog 函数式弹窗

`this.$scDialog(options)` 创建并返回弹窗实例，基于 `el-dialog` / `el-drawer` 封装，所有原生属性均可透传。

## 常用写法速查

```js
// ─── render 函数（可访问外部 this，适合内嵌 sc-form 并双向绑定）
this.$scDialog({
  title: "编辑",
  width: "500px",
  render: (h, vm) => (             // vm 是弹窗实例，可调用 vm.hide() 等
    <sc-form v-model={this.form} renderColumns={this.renderColumns} />
  ),
}).show(
  () => { /* 点确认后 */ },
  () => { /* 点取消后 */ }
)

// ─── comp 配置（sc-form 的 renderColumns 等 props 直接写在 comp 同层）
// 组件的 v-model 绑定的是弹窗实例的 vm.value，确认后从 vm.value 取值
const dialog = this.$scDialog({
  title: "编辑",
  comp: {
    name: "sc-form",
    renderColumns: this.renderColumns,  // 注意：直接写在 comp 内，不是 props 嵌套
  },
  confirm: (cb, vm) => {
    api.save(vm.value)  // 表单数据从 vm.value 取，而非外部 this.form
    cb()                              // 必须调用
  },
})

// ─── 实例控制（在 render 内部操作弹窗）
const vm = this.$scDialog({
  title: "控制示例",
  render: (h) => (
    <el-button onClick={() => vm.hide()}>关闭</el-button>
  ),
})
vm.show(() => { /* 确认回调 */ })
vm.loading = true    // 控制 loading
```

## 确认/取消钩子

**`cb()` 必须调用，否则弹窗不关闭。**

```js
this.$scDialog({
  title: "审核",
  render: () => (
    <sc-form ref="form" v-model={this.form} renderColumns={this.renderColumns} />
  ),
  confirm: async (cb, instance) => {
    await this.$refs.form.validate()  // render 写法需手动校验；comp 写法点确认时内部已自动校验，无需此行
    await api.save(this.form)
    cb()                              // 必须调用
  },
  cancel: (cb, instance) => {
    cb()                              // 必须调用
  },
}).show()
```

## 底部按钮配置

```js
footer: {
  align:   "right",              // left / center / right
  confirm: { label: "提交" },    // false = 隐藏确认按钮
  cancel:  false,                // 隐藏取消按钮
  handles: [                     // 增加自定义按钮
    {
      label:   "暂存",
      type:    "warning",
      onClick: (vm) => { vm.hide() },  // onClick 第一个参数是弹窗实例
    },
  ],
  hidden: true,                  // 隐藏整个底部
  render: () => {}               // 完全自定义底部
}
// footer: false  → 同 hidden: true
```

## 完整配置项

```js
this.$scDialog({
  title:      "标题",
  width:      "600px",   // 默认 600px
  drawer:     false,     // true = 抽屉模式
  drag:       true,      // 可拖拽，默认 true
  dragSize:   true,      // 可调整大小，默认 true
  fullscreen: true,      // 标题栏全屏按钮，默认 true
  cache:      false,     // 关闭后是否保留实例，默认 false
  class:      "",        // 自定义类名

  render:  (h, vm) => <div/>,    // 内容渲染（与 comp 二选一）
  comp:    { name: "MyComp" },  // 组件渲染

  footer:  { ... },      // 见上方「底部按钮配置」
  confirm: (cb, instance) => { cb() },
  cancel:  (cb, instance) => { cb() },
  closed:  (instance) => {},
  created: (instance) => {},
  mounted: (instance) => {},
})
```

## 关键规则

1. `confirm` / `cancel` 钩子中 **`cb()` 必须调用**，否则弹窗不关闭
2. `comp` 写法中，传给组件的 props 直接写在 `comp` 对象同层（如 `renderColumns`），**不是嵌套在 `props` 字段里**；组件的 `v-model` 绑定的是 **`vm.value`**，在确认回调里通过 `vm.value` 取表单数据
3. `render(h, vm)` 第二个参数 `vm` 是弹窗实例；`footer.handles[].onClick(vm)` 第一个参数同样是弹窗实例
4. **`comp` 写法**内嵌 `sc-form` / `sc-crud` 时，点击确认**自动触发校验**，无需手动调用 `validate()`；**`render` 写法**需在 `confirm` 钩子里手动调用 `this.$refs.form.validate()`
