var request = require('supertest');
var chai = require('chai');
var app = require('../server');

chai.should();

function json(verb, url, token) {
  var r = request(app)[verb](url).
    set('Content-Type', 'application/json').
    set('Accept', 'application/json').
    expect('Content-Type', /json/);

  if (token) {
    r = r.set('Authorization', token);
  }

  return r;
};

describe('session', function () {

  it('should able to login', function (done) {
    json('post', '/api/users/login').
      send({
        email: 'ray@gmail.com',
        password: 'qwer1234'
      }).
      expect(200).
      end(function (err, res) {
        // token
        res.body.should.have.property('id');
        done();
      });

    // app.models.user.find(function (err, users) {
    //   console.log(users);
    //   done();
    // });
  });

  /*
   * register
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
   *
   * change role of permission
   *    toggle admin
   *    toggle manager
   *    only admin can do it
   */
});

