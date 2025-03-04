# 基本使用

## 基本使用

`title` 标题、`width` 宽度 。详情参考element-ui弹窗组件配置[element-ui](https://element.eleme.cn/#/zh-CN/component/dialog)  </br>
`show()` 打开弹窗 </br>
弹窗渲染方式依旧为通用的 `render函数`，`component配置`</br>

<ClientOnly>
<common-code-format>
  <dialog-baseUse-base slot="source"></dialog-baseUse-base>
  
<<< @/docs/.vuepress/components/dialog/baseUse/base.vue
</common-code-format>
</ClientOnly>

## 通过实例控制弹窗

`hide()` 手动关闭弹窗 </br>
`loading` 控制loading

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


## 确认，取消关闭前方法

`confirm` 确认之前、`cancel` 取消之前</br>

<ClientOnly>
<common-code-format>
  <dialog-baseUse-beforeConfirm slot="source"></dialog-baseUse-beforeConfirm>
  
<<< @/docs/.vuepress/components/dialog/baseUse/beforeConfirm.vue
</common-code-format>
</ClientOnly>


## 自定义底部按钮

`footer` 自定义底部按钮</br>
`footer.align` 底部对齐方式</br>
`footer` 为`false`时或 `footer.hidden` 为`true` 隐藏底部

<ClientOnly>
<common-code-format>
  <dialog-baseUse-footer slot="source"></dialog-baseUse-footer>
  
<<< @/docs/.vuepress/components/dialog/baseUse/footer.vue
</common-code-format>
</ClientOnly>


## 抽屉式弹窗

`drawer` 抽屉式弹窗, 详情参考element-ui抽屉组件配置[element-ui](https://element.eleme.cn/#/zh-CN/component/drawer)

<ClientOnly>
<common-code-format>
  <dialog-baseUse-drawer slot="source"></dialog-baseUse-drawer>
  
<<< @/docs/.vuepress/components/dialog/baseUse/drawer.vue
</common-code-format>
</ClientOnly>