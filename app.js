require('dotenv').config();

var createError = require('http-errors');
const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
var cookieParser = require('cookie-parser'); 
var session = require('express-session');
var csrf = require('csurf');
var passport = require('passport');
var flash = require('connect-flash');
var logger = require('morgan');

var SQLiteStore = require('connect-sqlite3')(session);

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(session({
    secret : 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: false,
    store:new SQLiteStore({db: 'sessions.db', dir: 'var/db'})
}));
app.use(flash());
app.use(csrf());
app.use(passport.authenticate('session'));
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/', indexRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next){
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;