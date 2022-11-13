const { merge } = require("webpack-merge");
const common = require("./common.config.js");
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "demo1",
      template: path.join(__dirname, "../src/index.ejs")
    })
  ],
  optimization: {
    runtimeChunk: 'single'
  }
});