var passport = require('passport');
var flash = require('connect-flash');
var matchs = require('../config/match');
var Match = require('../models/match');

module.exports = function(app, passsport){

	//INDEX
	app.get('/index', function(req, res){
		res.render('index', { title: 'Express' });
	});

	app.get('/', function(req, res){
		res.redirect('/home');
	})

	//LOGIN
	//Show login form
	app.get('/login', function(req, res){
		res.render('login.jade', {message: req.flash('loginMessage')});
	});

	app.post('/login', passport.authenticate('local-login', {

		successRedirect: '/home',
		failureRedirect: '/login',
		failureFlash: true
	}));

	//SIGNUP
	app.get('/signup', function(req, res){
		res.render('signup.jade', {message: req.flash('signupMessage')});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home',
		failureRedirect : '/signup',
		failureFlash : true
	}));


	//PROFILE
	//Have to be logged to access
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.jade', {
			user: req.user
		});
	});

	//LOGOUT
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	//HOME
	app.get('/home', isLoggedIn, function(req, res){
		Match.find().lean().exec(function(err, match){
		  if(!err){
		  	//console.log("Partidos" +matchs);
		    res.render('home.jade', {
		    	matchs: match,
		    	title: 'Home - PadelPlay',
		    	user: req.user
		    });
		  }
		  else
		    console.log('Error: '+err);
		});
	});

	//Create Match
	app.get('/matchs', isLoggedIn, function(req, res){
		res.render('matchs.jade', {
			title: 'Create Match'
		});
	});

	//PROBLEMAS - Semisolucionados
	app.post('/matchs', function(req, res){
		console.log(req.body);
		matchs.createMatch(req, res);
	});


	//SEARCH
	app.get('/search', isLoggedIn, function(req, res){
		console.log(req.param('city'));
		var cit = new RegExp(req.param('city'), 'i');  // 'i' makes it case insensitive
		Match.find({'city' : cit}, function(err, match){
			if(!err){
				res.render('home.jade', {
					matchs: match,
					title: req.param('city')+' - PadelPlay',
					user: req.user
				});
			}
			else
				console.log('Error: '+err);
		});

	});


	//Play GAME
	app.get('/play/:id', isLoggedIn, function(req, res){

		matchs.playMatch(req, res, req.user);
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