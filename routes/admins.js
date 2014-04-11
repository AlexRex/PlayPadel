var passport = require('passport');
var flash = require('connect-flash');
var matchConfig = require('../config/match');
var Match = require('../models/match');

module.exports = function(app, passsport){

	app.get('/admin/index', isAdmin, function(req, res){
		res.render('admin.jade',{
			user: req.user
		});
	});


};



// route middleware to make sure a user is logged in
function isAdmin(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated() && req.user.group === 'admin' )
		return next();

	// if they aren't redirect them to the home page
	res.send(401, 'Unauthorized');
}