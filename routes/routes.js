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


	// =============================================================================
	// AUTHENTICATE (FIRST LOGIN) ==================================================
	// =============================================================================

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


	//LOGOUT
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});


	//FACEBOOK ROUTES
	//route for fb auth
	app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

	//callback
	app.get('/auth/facebook/callback',
	        passport.authenticate('facebook', {
	        	successRedirect: '/profile', 
	        	failureRedirect: '/'
	        }));
	


	// =============================================================================
	// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
	// =============================================================================


	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.jade', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));
















	//PROFILE
	//Have to be logged to access
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.jade', {
			user: req.user
		});
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

	//View for create Match
	app.get('/matchs', isLoggedIn, function(req, res){
		res.render('matchs.jade', {
			title: 'Create Match'
		});
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

	//Create Match
	app.post('/matchs', function(req, res){
		console.log(req.body);
		matchs.createMatch(req, res, req.user);
	});


	//Play GAME
	app.get('/play/:id', isLoggedIn, function(req, res){
		matchs.playMatch(req, res, req.user);
	});


	//Don't play
	app.get('/notplay/:id', isLoggedIn, function(req, res){
		matchs.dontPlay(req, res, req.user);
	});


	//Remove match
	app.get('/remove/:id', isLoggedIn, function(req, res){
		matchs.removeMatch(req, res, req.user);
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