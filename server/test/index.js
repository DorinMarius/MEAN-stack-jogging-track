const json = require('./helper').json;
const prepareTokens = require('./helper').prepareTokens;

var app = require('../server');

before(function importSampleData(done) {
  this.timeout(50000);

  if (app.importing) {
    app.on('import done', done);
  } else {
    done();
  }
});

describe('REST', function () {

  before(prepareTokens.bind(this));

  require('./session').bind(this)();
  require('./users').bind(this)();
  require('./records').bind(this)();

  /*
   * change role of permission
   *    toggle admin
   *    toggle manager
   *    only admin can do it
   */
});

