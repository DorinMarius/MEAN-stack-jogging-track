var app = require('../server');

before(function importSampleData(done) {
  this.timeout(50000);

  if (app.importing) {
    app.on('import done', done);
  } else {
    done();
  }
});

require('./session');

