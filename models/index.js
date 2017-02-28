'use strict'
const fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  db = {};

let options = {};
options.storage = path.join(__dirname, '../data/data.sql' );
options.dialect = 'sqlite';
options.logging = false;

let sequelize = new Sequelize(options);

fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function (file) {
  var model = sequelize['import'](path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
