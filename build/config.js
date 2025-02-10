const path = require("path");
const aliases = require("./alias");
const prd = process.env.TARGET;

const externals = {
  vue: {
    root: "Vue",
    commonjs2: "vue",
    commonjs: "vue",
    amd: "vue",
  },
  "element-ui": {
    root: "ELEMENT",
    commonjs2: "element-ui",
    commonjs: "element-ui",
    amd: "element-ui",
  },
  axios: "axios",
  mockjs: "mockjs",
  vuedraggable: "vuedraggable",
};
const resolve = (p) => {
  const base = p.split("/")[0];
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1));
  } else {
    return path.resolve(__dirname, "../", p);
  }
};

const builds = {
  prod: {
    entry: resolve("src/index.js"),
    dest: resolve("lib"),
    filename: "super-crud.min.js",
    env: "production",
    externals: externals,
  },
  dev: {
    entry: resolve("src/index.js"),
    dest: resolve("lib"),
    filename: "super-crud.js",
    env: "development",
    externals: externals,
  },
};
function genConfig(name) {
  const opts = builds[name];
  const config = {
    entry: {
      app: [opts.entry],
    },
    output: {
      filename: opts.filename,
      path: opts.dest,
      chunkFilename: "[id].js",
      libraryExport: "default",
      libraryTarget: "umd",
      library: "super-crud",
      umdNamedDefine: true,
      globalObject: "this",
    },
    externals: opts.externals,
    devtool: name === "dev" ? "cheap-module-eval-source-map" : false,
  };
  config.mode = builds[name].env;
  return config;
}

module.exports = genConfig(prd || "prod");
