const app = require('../server');
const json = require('./helper').json;
const should = require('chai').should();

module.exports = function () {

  describe('records api', () => {

    describe('create', () => {

      it('should response new record', (done) => {
        json('post', `/api/users/${this.userId}/jogRecords`, this.userToken).
        send({
          date: '2015-12-26',
          distance: 10000,
          time: 3600
        }).
        expect(200).
        end(function (err, res) {
          should.not.exist(err);
          res.body.should.have.property('id');
          res.body.should.have.property('date');
          res.body.should.have.property('distance');
          res.body.should.have.property('time');
          done();
        });
      });

      const testWith = (role, token, conj, expectStatus) => {
        describe(role, () => {
          it(conj + ' create record', (done) => {
            json('post', `/api/users/${this.userId}/jogRecords`, token()).
            send({
              date: '2015-12-26',
              distance: 10000,
              time: 3600
            }).
            expect(expectStatus).
            end(function (err, res) {
              should.not.exist(err);
              done();
            });
          });
        });
      };

      testWith('user', () => this.userToken, 'can', 200);
      testWith('other', () => this.otherToken, 'cannot', 401);
      testWith('manager', () => this.managerToken, 'cannot', 401);
      testWith('admin', () => this.adminToken, 'can', 200);

    });

    describe('read list', () => {

      it('should response an array of record', (done) => {
        json('get', `/api/users/${this.userId}/jogRecords`, this.userToken).
        expect(200).
        end((err, res) => {
          should.not.exist(err);
          res.body.should.be.an.array;
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('date');
          res.body[0].should.have.property('distance');
          res.body[0].should.have.property('time');
          done();
        });
      });

      const testWith = (role, token, conj, expectStatus) => {
        describe(role, () => {
          it(conj + ' get read list', (done) => {
            json('get', `/api/users/${this.userId}/jogRecords`, token()).
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
      testWith('manager', () => this.managerToken, 'cannot', 401);
      testWith('admin', () => this.adminToken, 'can', 200);

    });

    const getOneRecord = (userId, cb) => {
      app.models.user.findById(userId, (err, user) => {
        if (err) return cb(err);

        user.jogRecords.findOne((err, r) => {
          if (err) return cb(err);

          cb(null, r);
        });
      });
    };

    describe('read one item', () => {
      var id = null;

      before((done) => {
        getOneRecord(this.userId, (err, r) => {
          id = r.id;
          done();
        });
      });

      it('should response date, distance, time', (done) => {
        const url = `/api/users/${this.userId}/jogRecords/${id}`;
        json('get', url, this.userToken).
        expect(200).
        end((err, res) => {
          should.not.exist(err);
          res.body.should.have.property('date');
          res.body.should.have.property('distance');
          res.body.should.have.property('time');
          done();
        });
      });

      const testWith = (role, token, conj, expectStatus) => {
        describe(role, () => {
          it(conj + ' get read record', (done) => {
            const url = `/api/users/${this.userId}/jogRecords/${id}`;
            json('get', url, token()).
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
      testWith('manager', () => this.managerToken, 'cannot', 401);
      testWith('admin', () => this.adminToken, 'can', 200);

    });

    describe('update one item', () => {
      var id = null;

      before((done) => {
        getOneRecord(this.userId, (err, r) => {
          id = r.id;
          done();
        });
      });

      it('should response new record data', (done) => {
        const url = `/api/users/${this.userId}/jogRecords/${id}`;
        json('put', url, this.userToken).
        send({
          date: '2015-12-31',
          distance: 3000,
          time: 1800
        }).
        expect(200).
        end((err, res) => {
          should.not.exist(err);
          res.body.should.have.property('date');
          res.body.should.have.property('distance', 3000);
          res.body.should.have.property('time', 1800);
          done();
        });
      });

      const testWith = (role, token, conj, expectStatus) => {
        describe(role, () => {
          it(conj + ' update user', (done) => {
            const url = `/api/users/${this.userId}/jogRecords/${id}`;
            json('put', url, token()).
            send({
              time: 4000
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
      testWith('manager', () => this.managerToken, 'cannot', 401);
      testWith('admin', () => this.adminToken, 'can', 200);

    });

    describe('delete one item', () => {
      var id = null;

      beforeEach((done) => {
        app.models.JogRecord.count({time: 300000}, (err, count) => {
          if (count > 0) return done();

          json('post', `/api/users/${this.userId}/jogRecords`, this.userToken).
          send({
            date: '2015-12-26',
            distance: 10000,
            time: 300000
          }).
          expect(200).
          end(function (err, res) {
            id = res.body.id;
            done();
          });
        });
      });

      it('should delete record', (done) => {
        const url = `/api/users/${this.userId}/jogRecords/${id}`;
        json('delete', url, this.userToken).
        expect(204).
        end((err, res) => {
          should.not.exist(err);
          json('get', url, this.userToken).
          expect(404).
          end((err, res) => {
            should.not.exist(err);
            done();
          });
        });
      });

      const testWith = (role, token, conj, expectStatus, expectCount) => {
        describe(role, () => {
          it(conj + ' delete record', (done) => {
            const url = `/api/users/${this.userId}/jogRecords/${id}`;
            json('delete', url, token()).
            expect(expectStatus).
            end((err, res) => {
              should.not.exist(err);
              done();
            });
          });
        });
      };

      testWith('user', () => this.userToken, 'can', 204);
      testWith('other', () => this.otherToken, 'cannot', 401);
      testWith('manager', () => this.managerToken, 'cannot', 401);
      testWith('admin', () => this.adminToken, 'can', 204);
    });

  });

};
