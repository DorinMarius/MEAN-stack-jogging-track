var app = require('../server');

describe('test', function () {

  before(function importSampleData(done) {
    this.timeout(50000);

    setTimeout(done, 3000);
    // if (app.importing) {
    //   app.on('import done', done);
    // } else {
    //   done();
    // }
  });

  it('should work', function (done) {
    app.models.user.find(function (err, users) {
      console.log(users);
      done();
    });
  });

  /*
   * register
   * login
   * user CRUD
   *    self    - ok
   *    other   - block
   *    manager - ok
   *    admin   - ok
   *
   * record CRUD
   *    self    - ok
   *    other   - block
   *    manager - block
   *    admin   - ok
   *    test fields (date, distance, time)
   */
});

