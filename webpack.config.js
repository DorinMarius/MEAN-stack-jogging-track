var path = require('path');
var root = path.join(__dirname, 'client');

module.exports = {
  entry: {
    javascript: path.join(root, './src/js/app.js'),
    html: path.join(root, './src/index.html')
  },

  output: {
    path: path.join(root, './target'),
    filename: 'bundle.js'
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
      }
    ]
  }
};
