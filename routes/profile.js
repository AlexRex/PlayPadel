var passport = require('passport');
var flash = require('connect-flash');

var commentConfig = require('../config/comment');


var Comments = require('../models/comment');
var Users = require('../models/user');
module.exports = function(app, passsport){


	//YOUR OWN PROFILE
	//Have to be logged to access
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.jade', {
			message: req.flash('loginMessage'),
			user: req.user,
			title: req.user.local.name + ' ' + req.user.local.lastName
		});
	});

	//Accessing other profile
	app.get('/user/:id', isLoggedIn, function(req, res){
		Users.findById(req.params.id, function(err, user){
			console.log(user);
			if(user){
				res.render('profile.jade', {
					user: user,
					title: user.local.name + ' ' + user.local.lastName
				});
			}
			else
				console.log('Error accediendo a un usuario ' + err);
		});
	});

};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/index');
}