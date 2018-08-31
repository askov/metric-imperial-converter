'use strict';

require('dotenv').config();

const mongoose = require('mongoose');

const dbUri = process.env.DB_TEST_URL || process.env.DB_URL;

(function initMongoose() {
  /* eslint-disable no-console */

  // Settings
  mongoose.Promise = Promise;
  mongoose.set('debug', true);
  // Events
  mongoose.connection.on('connected', () => {
    console.log(`Mongoose connection opened at: ${dbUri}`);
  });
  mongoose.connection.on('error', error => {
    console.log(`Mongoose connection error: ${error}`);
  });
  mongoose.connection.on('disconnected', () => {
    console.log(`Mongoose connection closed at: ${dbUri}`);
  });
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection closed due to app termination.');
      process.exit(0);
    });
  });
})();

module.exports.connect = function (cb) {
  mongoose.connect(dbUri).then(() => {
    cb && cb();
  }, err => {
    cb && cb(err);
  });
};

module.exports.drop = function (cb) {
  mongoose.connection.db.dropDatabase(function () {
    cb();
  });
};

module.exports.disconnect = function (cb) {
  mongoose.connection.db.dropDatabase(function () {
    mongoose.connection.close(cb);
  });
};
