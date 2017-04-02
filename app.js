var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs=require('express-handlebars');
var expressValidator=require('express-validator');
var flash=require("connect-flash");
var session=require("express-session");
var passport=require("passport");
var localStrategy=require("passport-local").Strategy;
var mongo=require("mongodb");
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/cypher");
var db=mongoose.connection;


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs',exphbs({defaultLayout:'layout.handlebars'}))
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//EXPRESS SESSION
app.use((session({
    secret:"cypher@123",
    saveUninitialized:true,
    resave:true
})));

//PASSPORT INIT
app.use(passport.initialize());
app.use(passport.session());

//EXPRESS_VALIDATOR MIDDLEWARE https://github.com/ctavan/express-validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

//CONNECT FLASH MIDDLEWARE
app.use(flash());

//GLOBAL VARIABLES
app.use(function (req,res,next) {
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');
  res.locals.user=req.user || null;
  // if(res.locals.user)
  // res.locals.user.name;
  next();
});

app.use('/', index);
app.use('/users', users.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
