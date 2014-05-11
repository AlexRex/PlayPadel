
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var configPS = require('./config/passport')(passport);

var configDB = require('./config/database.js')(mongoose);

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 1500);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json()); 
	app.use(express.urlencoded());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));
	
	app.locals.pretty = true;

	app.use(express.session({ secret: 'kdd011aletormat'}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	app.use(app.router);

});
// all environments


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./routes/accounts.js')(app, passport);
require('./routes/routes.js')(app, passport);
require('./routes/admin.js')(app, passport);
require('./routes/matchs.js')(app, passport);
require('./routes/profile.js')(app, passport);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
