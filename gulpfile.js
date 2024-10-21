const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
var autoprefixer = require("gulp-autoprefixer");
var cssmin = require("gulp-cssmin");
const webpack = require("webpack");
const webpackConf = require("./build/build.js");

// 构建webpack配置
gulp.task("webpack", async function () {
  await webpack(webpackConf, function (err, stats) {
    if (err) {
      console.log(err);
    }
  });
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
gulp.task("build", gulp.series(["compile", "webpack"]));

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
});

gulp.task("watch", gulp.series(["compile", "webpack", "listen"]));
