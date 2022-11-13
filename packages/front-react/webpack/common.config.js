const path = require("path");
const distPath = path.resolve(__dirname, "../dist");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    index: path.join(__dirname, "../src/index.js"),
  },
  output: {
    filename: "[name].[contenthash].bundle.js",
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
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
    ],
  },
  resolve: {
    mainFiles: ["index", "default"],
    extensions: [".js", ".json", ".jsx"],
    alias: {
      "@": path.join(__dirname, "../src"),
    },
  },
  plugins: [new MiniCssExtractPlugin({
    filename: "[name].[contenthash:8].css",
    chunkFilename: `[name].[contenthash:8].chunk.css`,
  })],
};
