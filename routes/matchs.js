var passport = require('passport');
var flash = require('connect-flash');

var matchConfig = require('../config/match');
var commentConfig = require('../config/comment');

var Match = require('../models/match');
var Comments = require('../models/comment');


module.exports = function(app, passsport) {


	//View for create Match
	app.get('/createMatch', isLoggedIn, function(req, res) {
		res.render('createMatch.jade', {
			title: 'Create Match'
		});
	});

	//Create Match
	app.post('/createMatch', isLoggedIn, function(req, res) {
		console.log(req.body);
		matchConfig.createMatch(req, res, req.user);
	});

	//FIND MATCH BY ID
	app.get('/match/:id', isLoggedIn, function(req, res) {

		Match.findById(req.params.id, function(err, match) {
			if (err) {
				console.log(err);
				res.redirect('/404');
			}
			if (match) {

				Comments.find({
					thread: req.params.id,
					type: 'match'
				}, function(err, comments) {
					res.render('match.jade', {
						user: req.user,
						match: match,
						comments: comments
					});
				});
			} else console.log('Match not found');


		});


	});


	//Play GAME
	app.get('/play/:id', isLoggedIn, function(req, res) {
		matchConfig.playMatch(req, res, req.user);
	});


	//Don't play
	app.get('/notplay/:id', isLoggedIn, function(req, res) {
		matchConfig.dontPlay(req, res, req.user);
	});


	//Remove match
	app.get('/deletematch/:id', isLoggedIn, function(req, res) {
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