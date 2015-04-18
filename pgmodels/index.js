"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "test";
var config    = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    console.log(file);
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  console.log("Object key is :"+modelName);
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db['user'].belongsToMany(db['match'], { through: db['comment'] });
db['match'].belongsToMany(db['user'], { through: db['comment'] });
db['user'].belongsToMany(db['match'], { through: 'play' });
db['match'].belongsToMany(db['user'], { through: 'play' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;