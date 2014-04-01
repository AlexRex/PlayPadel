

var LocalSt = require('passport-local').Strategy;
var FacebookSt = require('passport-facebook').Strategy;

//user model
var User = require('../models/user');

//auth Variables
var configAuth = require('./auth');

//expose this function to the app
module.exports = function(passport){

	//passport session setup
	//persistent login sessions

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});



	//LOCAL SIGNUP
	passport.use('local-signup', new LocalSt({

		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true

	},
	function(req, email, password, done){

		//function findOne wont fire until data is sent back
		process.nextTick(function(){

			if(!req.user) { //Si no existe creo uno nuevo
				User.findOne({ 'local.email' : email}, function(err, user){
				//if there are any errors
				if(err)
					return done(err);
				//if the user already exists
				if(user) {
					return done( null, false, req.flash('signupMessage', 'That email is already taken.'));
				} 

				//if there is no user with that email
				//create user
				else {
					var newUser = new User();

					//Set the user's local credentials
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					//Save the user

					newUser.save(function(err) {
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
				});
			}
			else{
				var user = req.user;

				//Set the user's local credentials
				user.local.email = email;
				user.local.password = user.generateHash(password);

				//Save the user

				user.save(function(err) {
					if(err)
						throw err;
					return done(null, user);
				});
			}
		});

	}));

	//LOCAL LOGIN
	passport.use('local-login', new LocalSt({

			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done) {

			User.findOne({'local.email' : email}, function(err, user){

				if(err)
					return done(err);

				if(!user)
					return done(null, false, req.flash('loginMessage', 'No user found.'));

				if(!user.validPassword(password))
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));


				return done(null, user);
			});
		
		
	}));


	//FACEBOOK
	passport.use(new FacebookSt({
		//get auth settings
		clientID : configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		passReqToCallback: true

	},

	//Facebook send back token and profile
	function(req, token, refreshToken, profile, done){
		
		//async
		process.nextTick(function() {

			if(!req.user){ //USER DONT EXISTS

				User.findOne({ 'facebook.id' : profile.id}, function(err, user){
					if(err) return done(err);

					if(user) {
						// if there is a user id already but no token (user was linked at one point and then removed)
						// just add our token and profile information
					    if (!user.facebook.token) {
					        user.facebook.token = token;
					        user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
					        user.facebook.email = profile.emails[0].value;

					        user.save(function(err) {
					            if (err)
					                throw err;
					            return done(null, user);
					        });
					    }
						return done(null, user);
					}
					else {
						var newUser = new User();

						newUser.facebook.id = profile.id;
						newUser.facebook.token = token;
						newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value;

						newUser.save(function(err){
							if(err) throw err;

							return done(null, newUser);
						});
					}
				
				});
			}
			else { //USER ALREADY EXISTS

				var user = req.user;

				//update user credentials
				user.facebook.id = profile.id;
				user.facebook.token = token;
				user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
				user.facebook.email = profile.emails[0].value;
				
				//save user

				user.save(function(err) {
					if(err) throw err;
					return done(null, user);
				});
			}
		});

	}));

};




















