const merge = require("webpack-merge");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const alias = require("./alias");
let config = require("./config");
const path = require("path");

module.exports = merge(config, {
  output: {
    filename: "super-crud.common.js",
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: alias,
    modules: [
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "packages"),
      "node_modules",
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true, // 启用babel-loader缓存
        },
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: "vue-loader",
        options: {
          preserveWhitespace: false,
        },
      },
    ],
  },
  plugins: [new VueLoaderPlugin(), new ProgressBarPlugin()],
  optimization: {
    minimize: false,
  },
});
