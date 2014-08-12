//USER MODEL

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Schema for USER

var commentSchema = new Schema({
	thread: String,
	author: String,
	content: String,
	created: Date,
	authorEmail: String,
	type: String
});



//Create the MODEL

module.exports = mongoose.model('Comment', commentSchema);