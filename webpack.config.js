var path = require('path');
var root = path.join(__dirname, 'client');

module.exports = {
  context: root,
  entry: "./src/js/app.js",
  output: {
    path: path.join(root, "./target/js"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
    ]
  }
};
