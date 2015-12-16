var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function (app) {
  var mongoDB = app.dataSources.mongoDB;

  var automigrate = function (modelName) {
    return new Promise(function (resolve, reject) {
      mongoDB.automigrate(modelName, function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  };

  var modelCreate = function (modelName, data) {
    var Model = app.models[modelName];

    return new Promise(function (resolve, reject) {
      Model.create(data, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };

  var createGenerator = function (modelName) {
    return function (data) {
      // console.log('create ' + modelName + ': ' + JSON.stringify(data, null, 2));
      return automigrate(modelName).then(function () {
        return modelCreate(modelName, data);
      });
    };
  };

  var createUsers = createGenerator('user');
  var createRecords = createGenerator('JogRecord');
  var createRoles = createGenerator('Role');

  var RoleMapping = app.models.RoleMapping;
  var createRoleMapping = function (user, role) {
    return new Promise(function (resolve, reject) {
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: user.id
      }, function (err, principal) {
        if (err) return reject(err);

        resolve(principal);
      });
    });
  };

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

  app.importing = true;
  createUsers(
    admins.
    concat(managers).
    concat(users)
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

    return createRecords(records).return(users);
  }).then(function (users) {
    var admin = users[0];
    var manager = users[1];

    return createRoles([
      {name: 'admin'},
      {name: 'manager'}
    ]).then(function (roles) {
      var adminRole = roles[0];
      var managerRole = roles[1];

      return automigrate('RoleMapping').then(function () {
        return Promise.all([
          createRoleMapping(admin, adminRole),
          createRoleMapping(manager, managerRole)
        ]);
      });
    });
  }).
  catch(console.error).
  done(function () {
    delete app.importing;
    app.emit('import done');
    console.log('Preparing sample data done');
  });
};
