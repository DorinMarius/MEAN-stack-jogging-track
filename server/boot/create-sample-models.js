var Promise = require('bluebird');
var _ = require('underscore');

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

/*
var async = require('async');
module.exports = function(app) {
  //data sources
  var mongoDs = app.dataSources.mongoDs;
  var mysqlDs = app.dataSources.mysqlDs;
  //create all models
  async.parallel({
    reviewers: async.apply(createReviewers),
    coffeeShops: async.apply(createCoffeeShops),
  }, function(err, results) {
    if (err) throw err;
    createReviews(results.reviewers, results.coffeeShops, function(err) {
      console.log('> models created sucessfully');
    });
  });
  //create reviewers
  function createReviewers(cb) {
    mongoDs.automigrate('Reviewer', function(err) {
      if (err) return cb(err);
      var Reviewer = app.models.Reviewer;
      Reviewer.create([
        {email: 'foo@bar.com', password: 'foobar'},
        {email: 'john@doe.com', password: 'johndoe'},
        {email: 'jane@doe.com', password: 'janedoe'}
      ], cb);
    });
  }
  //create coffee shops
  function createCoffeeShops(cb) {
    mysqlDs.automigrate('CoffeeShop', function(err) {
      if (err) return cb(err);
      var CoffeeShop = app.models.CoffeeShop;
      CoffeeShop.create([
        {name: 'Bel Cafe', city: 'Vancouver'},
        {name: 'Three Bees Coffee House', city: 'San Mateo'},
        {name: 'Caffe Artigiano', city: 'Vancouver'},
      ], cb);
    });
  }
  //create reviews
  function createReviews(reviewers, coffeeShops, cb) {
    mongoDs.automigrate('Review', function(err) {
      if (err) return cb(err);
      var Review = app.models.Review;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Review.create([
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 4),
          rating: 5,
          comments: 'A very good coffee shop.',
          publisherId: reviewers[0].id,
          coffeeShopId: coffeeShops[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 3),
          rating: 5,
          comments: 'Quite pleasant.',
          publisherId: reviewers[1].id,
          coffeeShopId: coffeeShops[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 2),
          rating: 4,
          comments: 'It was ok.',
          publisherId: reviewers[1].id,
          coffeeShopId: coffeeShops[1].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS),
          rating: 4,
          comments: 'I go here everyday.',
          publisherId: reviewers[2].id,
          coffeeShopId: coffeeShops[2].id,
        }
      ], cb);
    });
  }
};
*/
