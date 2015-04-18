module.exports = function(sequelize){
  
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