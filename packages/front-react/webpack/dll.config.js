const path = require("path");
const webpack = require("webpack");
const dllDir = path.resolve(__dirname, "../dist/dll");

module.exports = {
  mode: "development",
  entry: {
    react: ["react", "react-dom"],
    fetch: ["axios"],
    shared: ["lodash"]
  },
  output: {
    path: dllDir,
    filename: "[name].[contenthash].dll.js",
    library: "[name]_dll",
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(dllDir, "[name]-manifest.json"),
      name: "[name]_dll",
      format: true
    }),
  ],
};
