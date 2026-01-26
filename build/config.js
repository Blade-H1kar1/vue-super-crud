const path = require("path");
const aliases = require("./alias");

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
  "async-validator": "async-validator",
};
const resolve = (p) => {
  const base = p.split("/")[0];
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1));
  } else {
    return path.resolve(__dirname, "../", p);
  }
};

module.exports = {
  mode: "production",
  entry: {
    app: resolve("src/index.js"),
  },
  output: {
    path: resolve("lib"),
    filename: "super-crud.min.js",
    chunkFilename: "[id].js",
    libraryExport: "default",
    libraryTarget: "umd",
    library: "super-crud",
    umdNamedDefine: true,
    globalObject: "this",
  },
  externals: externals,
};
