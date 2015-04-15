module.exports = function(sequelize){
	var path = require('path');
	var models = require("../models/models.js")(sequelize);
	var user = models.user;
	return{
		create: function(req, res){
			var newUser = {
				email : 'cristian@gmail.com',
				first_name: 'Cristian',
				last_name: 'Botella',
				password: 'clash'
			}
			user.create(newUser).success(function(){
				console.log('Cristian created succesfully');
			});
		}
	};
};