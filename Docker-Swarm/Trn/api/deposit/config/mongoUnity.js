const mongo = require('./mongodb.js');
module.exports = {
  insertOne: (collection, data, option = {}) => {
    return new Promise(function (resolve, reject) {
      mongo.db.collection(collection).insertOne(data, option || {}, (err, res) => {
        !err ? resolve(res) : reject(err);
      });
    });
  },
  insertMany: (collection, data, option = {}) => {
    return new Promise(function (resolve, reject) {
      mongo.db.collection(collection).insertMany(data, option || {}, (err, res) => {
        if (!err) resolve(res);
        err && err.code === 11000 && option && option.ordered === false ? resolve(res) : reject(err);
      });
    });
  },
  updateOne: (collection, query, set, option = {}) => {
    return new Promise(function (resolve, reject) {
      mongo.db.collection(collection).updateOne(query, set, option || {}, (err, res) => {
        !err ? resolve(res) : reject(err);
      });
    });
  },
  updateMany: (collection, query, set, option = {}) => {
    return new Promise(function (resolve, reject) {
      mongo.db.collection(collection).updateMany(query, set, option || {}, (err, res) => {
        !err ? resolve(res) : reject(err);
      });
    });
  },
  deleteOne: (collection, query, option = {}) => {
    return new Promise(function (resolve, reject) {
      mongo.db.collection(collection).deleteOne(query, option || {}, (err, res) => {
        !err ? resolve(res) : reject(err);
      });
    });
  },
  deleteMany: (collection, query, option = {}) => {
    return new Promise(function (resolve, reject) {
      mongo.db.collection(collection).deleteMany(query, option || {}, (err, res) => {
        !err ? resolve(res) : reject(err);
      });
    });
  },
  aggregate: (collection, query, option = {}) => {
    return new Promise(function (resolve, reject) {
      mongo.db

        .collection(collection)
        .aggregate(query, option || {})
        .toArray((err, res) => {
          !err ? resolve(res) : reject(err);
        });
    });
  },
  count: (collection, query) => {
    return new Promise(function (resolve, reject) {
      mongo.db.collection(collection).estimatedDocumentCount(query, (err, res) => {
        !err ? resolve(res) : reject(err);
      });
    });
  },
};
