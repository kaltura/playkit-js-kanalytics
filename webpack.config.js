'use strict';

const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');
const PROD = (process.env.NODE_ENV === 'production');

let plugins = [
  new CopyPlugin([{
    from: '../samples/index.html', to: '.'
  }])
];

if (PROD) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  }));
}

module.exports = {
  context: __dirname + "/src",
  entry: {
    "playkit-js-kanalytics": "kanalytics.js"
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].js'
  },
  devtool: 'source-map',
  plugins: plugins,
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: "babel-loader"
      }],
      exclude: [
        /node_modules/
      ]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      enforce: 'pre',
      use: [{
        loader: 'eslint-loader',
        options: {
          rules: {
            semi: 0
          }
        }
      }]
    }]
  },
  devServer: {
    contentBase: __dirname + "/src"
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      "node_modules"
    ]
  }
};
