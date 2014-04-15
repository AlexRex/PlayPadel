var passport = require('passport');
var flash = require('connect-flash');
var matchConfig = require('../config/match');
var Match = require('../models/match');

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
			user: req.user
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

	//View for create Match
	app.get('/createMatch', isLoggedIn, function(req, res){
		res.render('createMatch.jade', {
			title: 'Create Match'
		});
	});

	//Create Match
	app.post('/createMatch', isLoggedIn, function(req, res){
		console.log(req.body);
		matchConfig.createMatch(req, res, req.user);
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

	

	app.get('/match/:id', isLoggedIn, function(req, res){

		Match.findById(req.params.id, function(err, match){
			if(err) console.log(err);
			if(match){
				res.render('match.jade', {
					user: req.user,
					match: match
				});
			}
			else console.log('Match not found');
		})
	});


	//Play GAME
	app.get('/play/:id', isLoggedIn, function(req, res){
		matchConfig.playMatch(req, res, req.user);
	});


	//Don't play
	app.get('/notplay/:id', isLoggedIn, function(req, res){
		matchConfig.dontPlay(req, res, req.user);
	});


	//Remove match
	app.get('/remove/:id', isLoggedIn, function(req, res){
		matchConfig.removeMatch(req, res, req.user);
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