# 基本使用

`Dialog` 是一个基于 `element-ui` 的弹窗组件封装，提供了丰富的弹窗功能和灵活的渲染方式。它支持普通弹窗和抽屉式弹窗，并提供了拖拽、调整大小等扩展功能。

## 基本使用

`Dialog` 组件支持两种渲染方式：
- 通过 `render` 函数渲染内容
- 通过 `comp` 配置组件渲染内容

<ClientOnly>
<common-code-format>
  <dialog-baseUse-base slot="source"></dialog-baseUse-base>
  
<<< @/docs/.vuepress/components/dialog/baseUse/base.vue
</common-code-format>
</ClientOnly>

## 通过实例控制弹窗

`Dialog` 组件返回的实例提供了多种控制方法：
- `show()` 打开弹窗
- `hide()` 关闭弹窗
- `loading` 控制加载状态

通过保存弹窗实例，可以在组件内部进行弹窗控制。

<ClientOnly>
<common-code-format>
  <dialog-baseUse-control slot="source"></dialog-baseUse-control>
  
<<< @/docs/.vuepress/components/dialog/baseUse/control.vue
</common-code-format>
</ClientOnly>

<!-- ## v-insertSlot插入插槽渲染弹窗

`v-insertSlot` 获取模板，插入弹窗实例</br>

<ClientOnly>
<common-code-format>
  <dialog-baseUse-insertSlot slot="source"></dialog-baseUse-insertSlot>
  
<<< @/docs/.vuepress/components/dialog/baseUse/insertSlot.vue
</common-code-format>
</ClientOnly> -->


## 确认和取消前的钩子函数

`Dialog` 组件提供了确认和取消前的钩子函数，可以在这些函数中执行自定义逻辑：
- `confirm` 确认前钩子，可以执行表单验证等操作
- `cancel` 取消前钩子，可以执行确认提示等操作

这些钩子函数接收一个回调函数作为参数，需要手动调用该回调函数才能关闭弹窗。

<ClientOnly>
<common-code-format>
  <dialog-baseUse-beforeConfirm slot="source"></dialog-baseUse-beforeConfirm>
  
<<< @/docs/.vuepress/components/dialog/baseUse/beforeConfirm.vue
</common-code-format>
</ClientOnly>


## 自定义底部按钮

`Dialog` 组件支持自定义底部按钮区域：
- `footer` 配置底部按钮，可以是对象或布尔值
- `footer.align` 设置底部按钮的对齐方式，支持 `left`、`center`、`right`
- `footer.confirm` 配置确认按钮，设为 `false` 可隐藏
- `footer.cancel` 配置取消按钮，设为 `false` 可隐藏
- `footer.handles` 添加自定义按钮
- `footer.hidden` 设为 `true` 可隐藏整个底部区域
- `footer` 设为 `false` 可隐藏整个底部区域

通过 `footer.render` 函数可以完全自定义底部内容，该函数接收三个参数：
- `h` - 渲染函数
- `vm` - 弹窗实例
- `buttonRender` - 默认按钮渲染函数，可以在自定义内容中调用此函数渲染默认按钮

```javascript
// 示例：自定义底部内容，添加额外按钮并保留默认按钮
footer: { 
  render: (h, vm, buttonRender) => { 
    return ( 
      <div class="custom-dialog-footer"> 
        <el-button type="primary"> 
          自定义按钮 
        </el-button> 
        <div>{buttonRender()}</div> 
      </div> 
    ); 
  }, 
},
```

<ClientOnly>
<common-code-format>
  <dialog-baseUse-footer slot="source"></dialog-baseUse-footer>
  
<<< @/docs/.vuepress/components/dialog/baseUse/footer.vue
</common-code-format>
</ClientOnly>


## 抽屉式弹窗

`Dialog` 组件支持抽屉式弹窗模式：
- 设置 `drawer: true` 可启用抽屉模式
- 抽屉模式下，弹窗从右侧滑出
- 抽屉模式继承了 Element UI 的 Drawer 组件的所有特性

更多配置可参考 [Element UI Drawer 组件](https://element.eleme.cn/#/zh-CN/component/drawer)

<ClientOnly>
<common-code-format>
  <dialog-baseUse-drawer slot="source"></dialog-baseUse-drawer>
  
<<< @/docs/.vuepress/components/dialog/baseUse/drawer.vue
</common-code-format>
</ClientOnly>

## 扩展功能：拖拽和调整大小

`Dialog` 组件提供了丰富的交互功能，增强用户体验：

| 属性         | 说明                                              | 类型      | 默认值  |
| ------------ | ------------------------------------------------- | --------- | ------- |
| `drag`       | 启用拖拽功能，可通过拖动标题栏移动弹窗位置        | `Boolean` | `false` |
| `dragSize`   | 启用调整大小功能，可通过拖动弹窗边缘调整大小      | `Boolean` | `false` |
| `fullscreen` | 启用全屏功能，可通过点击标题栏图标最大化/还原弹窗 | `Boolean` | `false` |

启用这些功能后，弹窗支持以下交互操作：
- 点击标题栏中的 <i class="el-icon-full-screen"></i> 图标可以最大化/还原弹窗
- 点击标题栏中的 <i class="el-icon-rank"></i> 图标可以拖拽弹窗（按住拖动）
- 拖动弹窗右边缘可以调整宽度
- 拖动弹窗下边缘可以调整高度
- 拖动弹窗右下角可以同时调整宽度和高度

## API 文档

继承 `el-dialog` 和 `el-drawer` 组件的 API

### 属性

| 属性名         | 说明                 | 类型             | 默认值  |
| -------------- | -------------------- | ---------------- | ------- |
| title          | 弹窗标题             | `String`         | -       |
| width          | 弹窗宽度             | `String`         | '600px' |
| drawer         | 是否使用抽屉模式     | `Boolean`        | `false` |
| drag           | 是否启用拖拽功能     | `Boolean`        | `true`  |
| dragSize       | 是否启用调整大小功能 | `Boolean`        | `true`  |
| fullscreen     | 是否启用全屏功能     | `Boolean`        | `true`  |
| footer         | 底部按钮配置         | `Object/Boolean` | -       |
| footer.align   | 底部按钮对齐方式     | `String`         | 'right' |
| footer.hidden  | 是否隐藏底部         | `Boolean`        | `false` |
| footer.confirm | 确认按钮配置         | `Object/Boolean` | -       |
| footer.cancel  | 取消按钮配置         | `Object/Boolean` | -       |
| footer.handles | 自定义按钮列表       | `Array`          | []      |
| footer.render  | 自定义底部内容       | `Function`       | -       |
| render         | 内容渲染函数         | `Function`       | -       |
| comp           | 组件配置             | `Object`         | -       |
| cache          | 关闭后是否缓存实例   | `Boolean`        | `false` |
| class          | 自定义类名           | `String`         | -       |

### 方法

| 方法名  | 说明         | 参数                                  | 返回值   |
| ------- | ------------ | ------------------------------------- | -------- |
| show    | 显示弹窗     | (confirmCb:()=>{}, cancelCb:()=>{}) | 弹窗实例 |
| hide    | 隐藏弹窗     | -                                     | 弹窗实例 |
| confirm | 触发确认操作 | (params)                              | Promise  |
| cancel  | 触发取消操作 | (params)                              | 弹窗实例 |
| destroy | 销毁弹窗实例 | -                                     | -        |

### 钩子函数

| 名称    | 说明           | 参数                                  |
| ------- | -------------- | ------------------------------------- |
| confirm | 确认前钩子     | (callback:()=>{}, instance, params)   |
| cancel  | 取消前钩子     | (callback:()=>{}, instance, params)   |
| closed  | 弹窗关闭后钩子 | (instance)                            |
| created | 弹窗创建时钩子 | (instance)                            |
| mounted | 弹窗挂载时钩子 | (instance)                            |
