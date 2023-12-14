var express = require('express');
var router = express.Router();
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var db = require('../db');

var ensureLoggedIn = ensureLogIn();

router.get('/', function(req, res, next) {
    if(!req.user) {
        return res.render('home');
    }
    next();
}, function(req, res, next) {
    res.locals.photo = req.user.photo;
    res.render('index');
});

router.get('/profile', ensureLoggedIn, function(req, res, next) {
    res.locals.displayName = req.user.displayName;
    res.locals.email = req.user.email;
    res.locals.photo = req.user.photo;
    res.render('profile');
});

module.exports = router;