
/**
 * Module dependencies.
 */
//cbh6 testing sync
var express = require('express');
var http = require('http');
var path = require('path');

var morgan = require('morgan'); //logger
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var configPS = require('./config/passport')(passport);

var configDB = require('./config/database.js')(mongoose);

var app = express();
var port = process.env.PORT || 2000;

//CONFIG
app.use(cookieParser());
app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));


app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');

//passport
app.use(session({secret:'kdd011aletormat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());




http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});

/* Express 3
app.configure(function(){
	app.set('port', process.env.PORT || 2000);
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

});*/


// all environments


// development only
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
 // app.use(express.errorHandler());
 app.use(morgan('dev'));
 app.locals.pretty = true;

}

require('./routes/accounts.js')(app, passport);
require('./routes/routes.js')(app, passport);
require('./routes/admin.js')(app, passport);
require('./routes/matchs.js')(app, passport);
require('./routes/profile.js')(app, passport);


//404
app.use(function (req,res) { //1
	res.status(404);
    res.send('404 on search for ' +req.url); //2
});


