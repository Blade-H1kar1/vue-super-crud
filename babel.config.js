module.exports = {
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        useBuiltIns: "entry",
        corejs: 3,
        modules: false, // 保持ES模块用于tree shaking
      },
    ],
    [
      "@vue/babel-preset-jsx",
      {
        injectH: false,
      },
    ],
  ],
  plugins: ["./vue-jsx-sync"],
};
