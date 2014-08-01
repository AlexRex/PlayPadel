var passport = require('passport');
var flash = require('connect-flash');

var matchConfig = require('../config/match');
var commentConfig = require('../config/comment');


var MatchM = require('../models/match');
var Comments = require('../models/comment');

module.exports = function(app, passsport){

	//INDEX
	app.get('/index', function(req, res){
		res.render('index', { title: 'PadelPlay', message: req.flash('loginMessage') });
	});

	app.get('/', function(req, res){
		res.redirect('/home');
	});


	//HOME
	app.get('/home', isLoggedIn, function(req, res){
		MatchM.find().lean().exec(function(err, match){
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
		MatchM.find({'city' : cit}, function(err, match){
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


	//Add comment
	app.post('/addComment/:id', isLoggedIn, function(req, res){
		console.log(req.params.id);
		console.log(req.body);
		commentConfig.newComment(req, res, req.user, 'match');
	});

	app.get('/deleteComment/:id', isLoggedIn, function(req, res){
		commentConfig.deleteComment(req, res, req.user);
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