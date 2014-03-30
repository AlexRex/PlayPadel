//USER MODEL

var mongoose = require('mongoose');
var Schema = mongoose.Schema;



//Schema for USER

var matchSchema = new Schema({

	city: {type: String},
	club: {type: String},
	price: {type: Number},
	cat: {type: String},
	players: {type: [String]}
});



//Create the MODEL

module.exports = mongoose.model('Match', matchSchema);