var passport = require('passport');
var flash = require('connect-flash');
var matchConfig = require('../config/match');
var Match = require('../models/match');
var Comments = require('node-comment')({database: 'kdd'});

module.exports = function(app, passsport){

	//INDEX
	app.get('/index', function(req, res){
		res.render('index', { title: 'PadelPlay', message: req.flash('loginMessage') });
	});

	app.get('/', function(req, res){
		res.redirect('/home');
	})

	//PROFILE
	//Have to be logged to access
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.jade', {
			message: req.flash('loginMessage'),
			user: req.user,
			title: req.user.local.name + ' ' + req.user.local.lastName
		});
	});

	//HOME
	app.get('/home', isLoggedIn, function(req, res){
		Match.find().lean().exec(function(err, match){
		  if(!err){
		  	//console.log("Partidos" +matchs);
		    res.render('home.jade', {
		    	messageGame: req.flash('playGame'),
		    	matchs: match,
		    	title: 'Home - PadelPlay',
		    	user: req.user
		    });
		  }
		  else
		    console.log('Error: '+err);
		});
	});

	//SEARCH
	app.get('/search', isLoggedIn, function(req, res){
		var cit = new RegExp(req.param('city'), 'i');  // 'i' makes it case insensitive
		Match.find({'city' : cit}, function(err, match){
			if(!err){
				res.render('home.jade', {
					messageGame: req.flash('playGame'),
					matchs: match,
					title: req.param('city')+' - PadelPlay',
					user: req.user
				});
			}
			else
				console.log('Error: '+err);
		});

	});


	//404
	app.use(function (req,res) { //1
	    res.send('404 on search for ' +req.url); //2
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