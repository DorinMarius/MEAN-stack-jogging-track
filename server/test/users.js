const app = require('../server');
const json = require('./helper').json;
const should = require('chai').should();

module.exports = function () {

  describe('user api', () => {

    describe('create', () => {

      describe('anyone', () => {

        it('can create user', (done) => {
          json('post', '/api/users').
          send({
            email: 'test2@gmail.com',
            password: 'test2'
          }).
          expect(200).
          end(function (err, res) {
            should.not.exist(err);
            // user id
            res.body.should.have.property('id');
            done();
          });
        });

      });

    });

    describe('read list', () => {

      it('should response an array of user', (done) => {
        json('get', '/api/users', this.managerToken).
        expect(200).
        end((err, res) => {
          should.not.exist(err);
          res.body.should.be.an.array;
          res.body[0].should.have.property('username');
          res.body[0].should.have.property('email');
          done();
        });
      });

      const testWith = (role, token, conj, expectStatus) => {
        describe(role, () => {
          it(conj + ' get read list', (done) => {
            json('get', '/api/users', token()).
            expect(expectStatus).
            end((err, res) => {
              should.not.exist(err);
              done();
            });
          });
        });
      };


      testWith('unauthenticated', () => {}, 'cannot', 401);
      testWith('user', () => this.userToken, 'cannot', 401);
      testWith('manager', () => this.managerToken, 'can', 200);
      testWith('admin', () => this.adminToken, 'can', 200);
    });

    describe('read one item', () => {

      it('should response user with role', (done) => {
        const includeRolesJSON = encodeURIComponent(
          JSON.stringify({include: 'roles'}));
        const url = `/api/users/${this.adminId}?filter=${includeRolesJSON}`;
        json('get', url, this.adminToken).
        expect(200).
        end((err, res) => {
          should.not.exist(err);
          res.body.should.have.property('email');
          res.body.should.have.property('username');
          res.body.should.have.property('roles');
          res.body.roles[0].should.have.property('name', 'admin');
          done();
        });
      });

      const testWith = (role, token, conj, expectStatus) => {
        describe(role, () => {
          it(conj + ' get user', (done) => {
            json('get', `/api/users/${this.userId}`, token()).
            expect(expectStatus).
            end((err, res) => {
              should.not.exist(err);
              done();
            });
          });
        });
      };

      testWith('user', () => this.userToken, 'can', 200);
      testWith('other', () => this.otherToken, 'cannot', 401);
      testWith('manager', () => this.managerToken, 'can', 200);
      testWith('admin', () => this.adminToken, 'can', 200);

    });

    describe('update one item', () => {

      it('should response updated user data', (done) => {
        const url = `/api/users/${this.userId}`;
        json('put', url, this.managerToken).
        send({
          username: 'foobar',
          email: 'foo@gmail.com'
        }).
        expect(200).
        end((err, res) => {
          should.not.exist(err);
          res.body.should.have.property('email', 'foo@gmail.com');
          res.body.should.have.property('username', 'foobar');
          done();
        });
      });

      const testWith = (role, token, conj, expectStatus) => {
        describe(role, () => {
          it(conj + ' update user', (done) => {
            json('put', `/api/users/${this.userId}`, token()).
            send({
              username: 'foobar',
              email: 'foo@gmail.com'
            }).
            expect(expectStatus).
            end((err, res) => {
              should.not.exist(err);
              done();
            });
          });
        });
      };

      testWith('user', () => this.userToken, 'can', 200);
      testWith('other', () => this.otherToken, 'cannot', 401);
      testWith('manager', () => this.managerToken, 'can', 200);
      testWith('admin', () => this.adminToken, 'can', 200);

    });

    describe('delete one item', () => {
      var userId = null;

      beforeEach((done) => {
        app.models.user.count({email: 'bar@gmail.com'}, (err, count) => {
          if (count > 0) return done();

          json('post', '/api/users').
          send({
            email: 'bar@gmail.com',
            password: 'foobar'
          }).
          expect(200).
          end(function (err, res) {
            userId = res.body.id;
            done();
          });
        });
      });

      it('should delete user', (done) => {
        const url = `/api/users/${userId}`;
        json('delete', url, this.managerToken).
        expect(200).
        end((err, res) => {
          should.not.exist(err);
          app.models.user.count({email: 'bar@gmail.com'}, (err, count) => {
            count.should.equal(0);
            done();
          });
        });
      });

      const testWith = (role, token, conj, expectStatus, expectCount) => {
        describe(role, () => {
          it(conj + ' delete user', (done) => {
            json('delete', `/api/users/${userId}`, token()).
            expect(expectStatus).
            end((err, res) => {
              should.not.exist(err);
              app.models.user.count({email: 'bar@gmail.com'}, (err, count) => {
                count.should.equal(expectCount);
                done();
              });
            });
          });
        });
      };

      testWith('other', () => this.otherToken, 'cannot', 401, 1);
      testWith('manager', () => this.managerToken, 'can', 200, 0);
      testWith('admin', () => this.adminToken, 'can', 200, 0);
    });

  });

};
