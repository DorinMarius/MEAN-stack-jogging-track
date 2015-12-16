var Promise = require('bluebird');
var request = require('supertest');
var app = require('../server');

const json = exports.json = (verb, url, token) => {
  var r = request(app)[verb](url).
    set('Content-Type', 'application/json').
    set('Accept', 'application/json').
    expect('Content-Type', /json/);

  if (token) {
    r = r.set('Authorization', token);
  }

  return r;
};

const login = exports.login = (email, password, cb) => {
  json('post', '/api/users/login').
    send({
      email: email,
      password: password
    }).
    expect(200).
    end(function (err, res) {
      // token
      cb(null, {
        userId: res.body.userId,
        token: res.body.id
      });
    });
};

const loginAsync = Promise.promisify(login);

exports.prepareTokens = function () {
  return Promise.all([
    loginAsync('admin@jogtal.com', 'asdfqwer').then((data) => {
      this.adminId = data.userId;
      this.adminToken = data.token;
    }),

    loginAsync('manager@jogtal.com', '1234qwer').then((data) => this.managerToken = data.token),

    loginAsync('ray@gmail.com', 'qwer1234').then((data) => {
      this.userId = data.userId;
      this.userToken = data.token;
    }),

    loginAsync('iris@yahoo.com', 'asdfqwer').then((data) => this.otherToken = data.token)
  ]);
};
