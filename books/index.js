const glob = require("glob");
const path = require("path");

module.exports = glob
  .sync("*.js", {
    nodir: true,
    cwd: __dirname,
  })
  .map((file) => {
    if (file !== "index.js") return require(path.resolve(__dirname, file));
  })
  .filter(Boolean);
