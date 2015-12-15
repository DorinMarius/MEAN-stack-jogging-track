var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function (app) {
  var mongoDB = app.dataSources.mongoDB;

  var createGenerator = function (modelName) {
    var Model = app.models[modelName];

    return function (data) {
      // console.log('create ' + modelName + ': ' + JSON.stringify(data, null, 2));
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
    {username: 'Ray', email: 'ray@gmail.com', password: 'qwer1234'},
    {username: 'Iris', email: 'iris@yahoo.com', password: 'asdfqwer'},
    {username: 'Angela', email: 'angela@hotmail.com', password: 'zxcvasdf'}
  ];

  var managers = [
    {username: 'JogTal Manager', email: 'manager@jogtal.com', password: '1234qwer'}
  ];

  var admins = [
    {username: 'Jogtal Admin', email: 'admin@jogtal.com', password: 'asdfqwer'}
  ];

  var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
  var randInt = function (n) {
    return Math.floor((Math.random() * n));
  };

  createUsers(
    users.
    concat(managers).
    concat(admins)
  ).then(function (users) {
    var records = _(users).map(function (user) {
      var days = 5 + randInt(10);
      return _.range(days).map(function () {
        return {
          date: Date.now() - DAY_IN_MILLISECONDS * randInt(30),
          distance: randInt(15000),
          time: randInt(2 * 60 * 60),
          userId: user.id
        };
      });
    }).flatten().value();

    return createRecords(records);
  }).
  catch(console.error).
  done(function () {
    console.log('done prepare sample data');
  });
};
