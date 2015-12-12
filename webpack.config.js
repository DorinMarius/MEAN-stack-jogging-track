var path = require('path');
var root = path.join(__dirname, 'client');

module.exports = {
  entry: path.join(root, "./src/js/app.js"),
  output: {
    path: path.join(root, "./target/js"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
