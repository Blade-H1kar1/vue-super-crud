const path = require("path");

const resolve = (p) => path.resolve(__dirname, "../", p);

module.exports = {
  src: resolve("src"),
  utils: resolve("src/utils"),
  pak: resolve("packages"),
  core: resolve("packages/core"),
};
