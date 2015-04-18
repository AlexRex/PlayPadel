"use strict";

module.exports = function(sequelize, DataTypes) {
  var match = sequelize.define("match",{
    city: { type: DataTypes.STRING },
    club: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    price: { type: DataTypes.FLOAT }
  });
  return match;
};
