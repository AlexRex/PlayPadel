//USER MODEL

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;



//Schema for USER

var userSchema = new Schema({

	local:{
		email: String,
		password: String,
	},
	facebook:{
		id: String,
		token: String,
		email: String,
		name: String
	}

});


//generate hash for password

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Check validation password

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
};

//Create the MODEL

module.exports = mongoose.model('User', userSchema);