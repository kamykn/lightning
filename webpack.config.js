const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: "./assets/js/bootstrap.js",
  output: {
    path: path.resolve(__dirname, "dist"),
	filename: "bundle.js", // string
	publicPath: "/dist/", // string
  },
  // resolve: {
  //   alias: {
  //     'vue$': 'vue/dist/vue.esm.js'
  //   },
  //   extensions: ['.js', '.vue']
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  devtool: "source-map",
};
