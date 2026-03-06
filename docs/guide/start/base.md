# 快速开始

## 使用 npm 安装（推荐）

```bash
npm install vue-super-crud
```

在项目入口文件中引入：

```js
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import SuperCrud from 'vue-super-crud'
import 'vue-super-crud/lib/index.css'

Vue.use(ElementUI)
Vue.use(SuperCrud, {
  // 全局配置
})
```

## 使用 CDN 引入

在 HTML 文件中直接引入：

```html
<!-- 引入样式 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vue-super-crud@latest/lib/index.css">
<!-- 引入组件库 -->
<script src="https://cdn.jsdelivr.net/npm/vue-super-crud@latest/lib/super-crud.min.js"></script>
```

## 本地引入

如果你希望手动管理文件，可以：

1. 使用 `npm run build` 打包最新组件文件
2. 从 `lib` 目录获取打包好的文件：
   - `super-crud.min.js`
   - `index.css`
3. 将文件放入你项目的 `public/superCrud` 或其他静态资源目录
4. 在项目中引入：

```js
import SuperCrud from "/public/superCrud/super-crud.min.js"
import "/public/superCrud/index.css"

Vue.use(SuperCrud, {
  // 全局配置
})
```

## 安装 Cursor Agent Skills（可选）

本项目内置了 Cursor Agent Skills，安装后可以让 Cursor AI 更准确地理解组件 API，在 Agent 模式下自动生成高质量的组件代码。

```bash
npx vue-super-crud install-skills
```

## 注意事项

- 使用前请确保已引入 Vue 和 Element UI
- Cursor Agent Skills 需要在 Cursor IDE 中使用才能生效