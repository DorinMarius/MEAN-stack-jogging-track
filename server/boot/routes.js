var path = require('path');
var root = path.join(__dirname, '../../');

module.exports = function (app) {
  app.get(/^\/(?!bundle|api)/, function (req, res) {
    res.sendFile('./client/target/index.html', {root: root});
  });
};
