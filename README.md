# vue-super-crud

基于 Element UI 二次封装的快速开发组件库

[![npm version](https://img.shields.io/npm/v/vue-super-crud.svg)](https://www.npmjs.com/package/vue-super-crud)
[![license](https://img.shields.io/github/license/blade-h1kar1/vue-super-crud)](https://github.com/blade-h1kar1/vue-super-crud/blob/master/LICENSE)

## 文档

详细文档请访问：[https://blade-h1kar1.github.io/vue-super-crud/](https://blade-h1kar1.github.io/vue-super-crud/)

## 特性

- 🚀 **快速开发**：基于 Element UI 二次封装，极少的代码即可完成一个crud页面
- 📦 **模板复用**：配置并复用代码模板，减少重复开发，提升开发效率
- 🎨 **高度自定义**：支持更灵活、丰富的组件配置，以满足不同项目的高度自定义需求
- ⚡ **极致优化**：表格更新渲染性能比 avue 快 2 倍以上

## 安装

### 使用 npm 安装

```bash
npm install vue-super-crud
```

### 使用 CDN 引入

```html
<!-- 引入样式 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vue-super-crud@latest/lib/index.css">
<!-- 引入组件库 -->
<script src="https://cdn.jsdelivr.net/npm/vue-super-crud@latest/lib/super-crud.min.js"></script>
```

## 快速开始

```javascript
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueSuperCrud from 'vue-super-crud'
import 'vue-super-crud/lib/index.css'

Vue.use(ElementUI)
Vue.use(VueSuperCrud, {
  // 全局配置
})
```

## 开发指南

```bash
# 克隆项目
git clone https://github.com/blade-h1kar1/vue-super-crud.git

# 安装依赖
npm install

# 启动开发服务
npm run serve

# 构建文档
npm run docs:build

# 构建组件库
npm run build
```

## 版本历史

查看 [CHANGELOG.md](CHANGELOG.md) 了解每个版本的详细更改。

## 开源协议

[MIT](LICENSE)

Copyright (c) 2024-present Blade