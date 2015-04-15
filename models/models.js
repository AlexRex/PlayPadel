var Sequelize = require('sequelize');

module.exports = function(sequelize){
	//Models
	var user = sequelize.define("user",{
		email:{
	    	type: Sequelize.STRING,
	   	 primaryKey: true
	 	 },
	 	 first_name: { type: Sequelize.STRING },
	 	 last_name: { type: Sequelize.STRING },
		 password: { type: Sequelize.STRING }
	});
	var match = sequelize.define("match",{
		city: { type: Sequelize.STRING },
		club: { type: Sequelize.STRING },
		category: { type: Sequelize.STRING },
		price: { type: Sequelize.FLOAT }
	});
	var comment = sequelize.define('comment', {
  		thread: { type: Sequelize.STRING },
 		content: { type: Sequelize.STRING },
	});
	//Associations
	user.belongsToMany(match, { through: comment });
	match.belongsToMany(user, { through: comment });
	user.belongsToMany(match, { through: 'play' });
	match.belongsToMany(user, { through: 'play' });
	
	return{
		user: user,
		comment: comment,
		match: match
	}
	
};