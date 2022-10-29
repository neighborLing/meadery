const { merge } = require('webpack-merge');
const common = require('./common.config.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin()
  ],
});