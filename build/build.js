const merge = require("webpack-merge");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const alias = require("./alias");
let config = require("./config");
const path = require("path");
const prd = process.env.TARGET;
const isDev = prd === "dev";
const isAnalyze = process.env.ANALYZE === "true";

module.exports = merge(config, {
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
  plugins: [
    new VueLoaderPlugin(),
    new ProgressBarPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: isDev ? false : true,
    }),
    ...(isAnalyze
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: "server",
            openAnalyzer: true,
            generateStatsFile: true,
            statsFilename: "stats.json",
          }),
        ]
      : []),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_debugger: true,
            pure_funcs: ["console.log"],
          },
          mangle: true,
        },
      }),
    ],
  },
});
