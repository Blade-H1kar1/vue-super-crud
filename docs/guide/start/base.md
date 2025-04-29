# 快速开始

## 使用 CDN 引入

### 引入 JS 和 CSS

在 HTML 文件中直接引入：

```html
<!-- 引入样式 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vue-super-crud@1.7.1/lib/index.css">
<!-- 引入组件库 -->
<script src="https://cdn.jsdelivr.net/npm/vue-super-crud@1.7.1/lib/super-crud.min.js"></script>
```

## 使用 npm 安装

如果你使用 npm 管理项目，可以通过以下命令安装：

```bash
npm install vue-super-crud
```

然后在项目中引入：

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

## 注意事项

- 使用前请确保已引入 Vue 和 Element UI