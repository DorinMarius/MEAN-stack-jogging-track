var path = require('path');
var root = path.join(__dirname, 'client');

module.exports = {
  entry: {
    javascript: path.join(root, './src/js/app.js'),
    html: path.join(root, './src/index.html'),
    css: path.join(root, './src/bootstrap.min.css')
  },

  output: {
    path: path.join(root, './target'),
    filename: 'bundle/app.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        loader: 'file?name=bundle/[name].[ext]'
      }
    ]
  }
};
