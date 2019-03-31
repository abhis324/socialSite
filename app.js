var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose")
var path = require('path')
var passport = require('passport')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/loginpage');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//// connection to database section

mongoose.connect('mongodb://admin:admin123@ds119996.mlab.com:19996/shoppingcart',{ useNewUrlParser: true },)

// mongoose.connect('mongodb://localhost/pragyanhackathon1',{ useNewUrlParser: true })

mongoose.connection.once('open',function(){

console.log("Connection is established successfully")

}).on('error',function(error){

	console.log('Connection error',error)

})

//// connection to database done ok 200

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
var sess = {
	genid: function(req) {
	return (Math.random()*4500+1).toString()+"uenai"},
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60*60*1000 },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//app.use(express.static(__dirname + 'uploads'));

/// models imported here

const Post = require('./models/post')

app.use(function(err,req,res,next){
	console.log("initialising session ")
	res.locals.session = req.session
	if (!req.session.username)
	{
		req.session.username = "user";
	}
	if(!req.session.userid)
	{
		req.session.userid;
	}
	next();
})

app.use('/', indexRouter);

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
