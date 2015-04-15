module.exports = function(Sequelize){
  var path      = require("path");
  var env       = process.env.NODE_ENV || "test";
  var config    = require(__dirname + '/../config/config.json')[env];
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
  var models    = require('../models/models.js')(sequelize);

  sequelize
    .authenticate()
    .complete(function(err) {
      if (!!err) {
        console.log('Unable to connect to the database:', err);
      } else {
        console.log('Connection has been established successfully.');
      }
    }).success(function(){
      sequelize.sync();
    });
}