const path = require("path");

module.exports = {
  externals: {
    express: "require('express')",
  },
  entry: "./src/index.cjs",
  output: {
    filename: "main.cjs",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  resolve: {
    fallback: {
      path: false,
      buffer: false,
      crypto: false,
      url: false,
      util: false,
      fs: false,
      string_decoder: false,
      querystring: false,
      http: false,
      net: false,
      os: false,
      zlib: false,
      stream: false,
    },
  },
};
