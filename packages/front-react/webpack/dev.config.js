const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const distPath = path.resolve(__dirname, "../dist");

module.exports = {
  mode: "development",
  entry: {
    index: path.join(__dirname, "../src/index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: distPath,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "demo1",
      template: path.join(__dirname, "../src/index.ejs"),
    }),
  ],
};
