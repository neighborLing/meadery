const { merge } = require("webpack-merge");
const common = require("./common.config.js");
const webpack = require("webpack");
const path = require("path");
const { getDllManifest, getDll } = require('./utils/dll.js');
const dllPath = path.join(__dirname, "../dist/dll");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
//   devServer: {
//     static: "./dist",
//   },
  plugins: [
    // ...getDllManifest(dllPath).map(manifest => {
    //   return new webpack.DllReferencePlugin({
    //     context: dllPath,
    //     manifest: require(path.resolve(dllPath, manifest)), // eslint-disable-line
    //   })
    // }),
    new HtmlWebpackPlugin({
      title: "demo1",
      template: path.join(__dirname, "../src/index.ejs"),
      templateParameters: {
        dll: getDll(dllPath, '/dll').map(i => `/dll/${i}`)
      }
    }),
    new BundleAnalyzerPlugin(),
  ],
});