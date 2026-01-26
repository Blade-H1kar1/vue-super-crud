const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
var autoprefixer = require("gulp-autoprefixer");
var cssmin = require("gulp-cssmin");
const webpack = require("webpack");
const webpackConf = require("./build/build.js");
const webpackConfCommon = require("./build/build.common.js");

// 构建webpack配置
gulp.task("webpack", async function () {
  try {
    const stats = await new Promise((resolve, reject) => {
      webpack(webpackConf, (err, stats) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(stats);
      });
    });

    // 处理编译过程中的错误和警告
    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error("\x1b[31m%s\x1b[0m", "打包失败！"); // 红色文字
      console.error(info.errors);
      throw new Error("Webpack 编译失败");
    }

    if (stats.hasWarnings()) {
      console.warn("\x1b[33m%s\x1b[0m", "打包警告："); // 黄色文字
      console.warn(info.warnings);
    }

    console.log("\x1b[32m%s\x1b[0m", "打包成功！"); // 绿色文字
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "打包过程发生错误："); // 红色文字
    console.error(error);
    throw error; // 抛出错误以中断 gulp 任务
  }
});

// 构建webpack配置
gulp.task("webpack.common", async function () {
  try {
    const stats = await new Promise((resolve, reject) => {
      webpack(webpackConfCommon, (err, stats) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(stats);
      });
    });

    // 处理编译过程中的错误和警告
    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error("\x1b[31m%s\x1b[0m", "打包失败！"); // 红色文字
      console.error(info.errors);
      throw new Error("Webpack 编译失败");
    }

    if (stats.hasWarnings()) {
      console.warn("\x1b[33m%s\x1b[0m", "打包警告："); // 黄色文字
      console.warn(info.warnings);
    }

    console.log("\x1b[32m%s\x1b[0m", "打包成功！"); // 绿色文字
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "打包过程发生错误："); // 红色文字
    console.error(error);
    throw error; // 抛出错误以中断 gulp 任务
  }
});

// 处理样式的配置
gulp.task("compile", function () {
  return gulp
    .src("./styles/index.scss")
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ["ie > 9", "last 2 versions"],
        cascade: false,
      })
    )
    .pipe(cssmin())
    .pipe(gulp.dest("./lib/"));
});

// 打包文件
gulp.task(
  "build",
  gulp.series("compile", gulp.parallel("webpack", "webpack.common"))
);

function debounce(func, wait) {
  let timeout;

  return function () {
    let context = this;
    let args = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, wait);
  };
}

// 监听文件变化
gulp.task("listen", async function () {
  gulp.watch(["./styles/**"], debounce(gulp.series(["compile"]), 2000));
  gulp.watch(
    ["./src/**", "./packages/**"],
    debounce(gulp.series(["webpack"]), 2000)
  );
  gulp.watch(
    ["./src/**", "./packages/**"],
    debounce(gulp.series(["webpack.common"]), 2000)
  );
});

// 监听 UMD 变化
gulp.task("listen:umd", async function () {
  gulp.watch(["./styles/**"], debounce(gulp.series(["compile"]), 2000));
  gulp.watch(
    ["./src/**", "./packages/**"],
    debounce(gulp.series(["webpack"]), 2000)
  );
});

// 监听 CommonJS 变化
gulp.task("listen:common", async function () {
  gulp.watch(["./styles/**"], debounce(gulp.series(["compile"]), 2000));
  gulp.watch(
    ["./src/**", "./packages/**"],
    debounce(gulp.series(["webpack.common"]), 2000)
  );
});

// 监听文件变化并打包
gulp.task(
  "watch",
  gulp.series("compile", gulp.parallel("webpack", "webpack.common"), "listen")
);

// 监听 UMD 并打包
gulp.task("watch:umd", gulp.series("compile", "webpack", "listen:umd"));

// 监听 CommonJS 并打包
gulp.task(
  "watch:common",
  gulp.series("compile", "webpack.common", "listen:common")
);
