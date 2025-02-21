const alias = require("../../build/alias");

module.exports = {
  title: "VueSuperCrud",
  description: "基于element-ui二次封装，快速开发CRUD业务组件库",
  theme: "reco",
  base: "/vue-super-crud/",
  port: 1235,
  head: [
    [
      "link",
      { rel: "shortcut icon", type: "image/x-icon", href: `/favicon.ico` },
    ],
  ],
  markdown: {
    // lineNumbers: true // 代码块显示行号
  },
  themeConfig: {
    repo: "https://github.com/Blade-H1kar1/vue-super-crud.git",
    // 自定义仓库链接文字。
    repoLabel: "GitHub",
    sidebarDepth: 3,
    subSidebar: "auto",
    searchMaxSuggestions: 10,
    nav: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/guide/start/base" },
    ],
    sidebar: {
      "/guide/": [
        {
          title: "指南",
          collapsable: true,
          children: [{ title: "快速使用", path: "start/base" }],
        },
        {
          title: "通用配置",
          collapsable: true,
          children: [
            "commonConfig/renderType",
            "commonConfig/jsx",
            "commonConfig/presetCodeTemplate",
          ],
        },
        {
          title: "字典管理",
          collapsable: true,
          children: ["dict/config", "dict/component", "dict/baseUse"],
        },
        {
          title: "响应式数据格式化",
          collapsable: true,
          children: ["formatData/config", "formatData/baseUse"],
        },
        {
          title: "crud组件",
          collapsable: true,
          children: [
            "crud/config",
            "crud/baseUse",
            "crud/renderType",
            "crud/search",
            "crud/tableEdit",
            "crud/validate",
            "crud/contextMenu",
            "crud/buttons",
            "crud/selection",
          ],
        },
        {
          title: "form组件",
          collapsable: true,
          children: ["form/baseUse", "form/detail"],
        },
        {
          title: "dialog组件",
          collapsable: true,
          children: ["dialog/baseUse"],
        },
      ],
    },
  },
  configureWebpack: {
    output: {
      publicPath: "/vue-super-crud/", // 修改为根路径
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@vue/cli-plugin-babel/preset",
                [
                  "@vue/babel-preset-jsx",
                  {
                    injectH: false,
                  },
                ],
              ],
              plugins: ["./vue-jsx-sync"],
            },
          },
        },
      ],
    },
    resolve: {
      alias: {
        "core-js/library/fn": "core-js/features",
        ...alias,
      },
    },
  },
  plugins: ["code-copy", "fulltext-search"],
};
