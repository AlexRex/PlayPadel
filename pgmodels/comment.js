"use strict";

module.exports = function(sequelize, DataTypes) {
  var comment = sequelize.define('comment', {
  		thread: { type: DataTypes.STRING },
 		content: { type: DataTypes.STRING },
	});
  return comment;
};