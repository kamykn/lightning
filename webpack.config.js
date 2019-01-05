const path = require('path');
const WorkerPlugin = require('worker-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: "./assets/js/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
	publicPath: "/dist/",
	filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              minimize: true,
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['./dist']),
	new WorkerPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ],
  devtool: "source-map",
};
