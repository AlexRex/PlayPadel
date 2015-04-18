"use strict";
//var bcrypt=require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    email:{
        type: DataTypes.STRING,
       unique: true
     },
     first_name: { type: DataTypes.STRING },
     last_name: { type: DataTypes.STRING },
     password: { type: DataTypes.STRING }
  });
  return user;
};
