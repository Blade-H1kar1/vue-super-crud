const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const alias = require("./build/alias");
module.exports = {
  // transpileDependencies: ['element-ui'], // 解决IE浏览器本地启动白屏现象
  // outputDir: process.env.outputDir || 'dist', // 输出文件名称
  // publicPath: './', // 部署应用包时的基本 URL
  productionSourceMap: true, // 解决vue项目打包后浏览器F12查看到项目源代码false不能看到
  // productionSourceMap: true, // 测试调试打断点
  lintOnSave: false, // 去掉eslint校验

  devServer: {
    port: 1234, // 设置端口号
    // open: true, // 启动项目自动打开浏览器
    proxy: {
      // 解决跨域问题
      "/api": {
        target: "http://192.168.4.225:8080 ", // 本地json数据
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          "^/api": "", // 本地
        },
      },
    },
  },
  // 修改 src 目录 为 examples 目录
  pages: {
    index: {
      entry: "examples/main.js",
      template: "examples/index.html",
      filename: "index.html",
    },
  },
  // output: {
  //   filename: 'index.js',
  //   path: path.resolve(__dirname, './lib'),
  //   library: '@wocwin/t-ui', // 指定类库名,主要用于直接引用的方式
  //   libraryTarget: 'umd' // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
  // },
  // 强制内联CSS
  css: {
    extract: false,
  },
  configureWebpack: {
    resolve: {
      alias,
    },
  },
  configureWebpack: (config) => {
    config.devtool = "source-map";
    config.resolve.alias["#"] = resolve("examples");
  },
};
