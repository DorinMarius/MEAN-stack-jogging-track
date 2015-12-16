const json = require('./helper').json;

require('chai').should();

module.exports = function () {

  // this two test are relative and need to execute in this sequence
  describe('session', () => {

    it('should able to register', (done) => {
      json('post', '/api/users').
        send({
          email: 'test@gmail.com',
          password: 'test'
        }).
        expect(200).
        end(function (err, res) {
          // user id
          res.body.should.have.property('id');
          done();
        });
    });

    it('should able to login', function (done) {
      json('post', '/api/users/login').
        send({
          email: 'test@gmail.com',
          password: 'test'
        }).
        expect(200).
        end(function (err, res) {
          // token
          res.body.should.have.property('id');
          done();
        });
    });
  });

};
