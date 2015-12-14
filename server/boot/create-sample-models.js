var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function (app) {
  var mongoDB = app.dataSources.mongoDB;

  var createGenerator = function (modelName) {
    var Model = app.models[modelName];

    return function (data) {
      console.log('create ' + modelName + ': ' + JSON.stringify(data, null, 2));
      return new Promise(function (resolve, reject) {
        mongoDB.automigrate(modelName, function (err) {
          if (err) return reject(err);
          Model.create(data, function (err, result) {
            if (err) return reject(err);
            resolve(result);
          });
        });
      });
    };
  };

  var createUsers = createGenerator('user');
  var createRecords = createGenerator('JogRecord');

  var users = [
    {username: 'JogTal Admin', email: 'admin@jogtal.com', password: 'qwer1234'}
  ];

  var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
  var randInt = function (n) {
    return Math.floor((Math.random() * n));
  };

  createUsers(users).
    then(function (users) {
      var days = 10 + randInt(10);
      var records = _.range(days).map(function () {
        return {
          date: Date.now() - DAY_IN_MILLISECONDS * randInt(30),
          distance: randInt(15000),
          time: randInt(2 * 60 * 60),
          userId: users[0].id
        }
      });

      return createRecords(records);
    }).
    catch(console.error).
    done(function () {
      console.log('done');
    });
};
