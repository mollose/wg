var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20');
var db = require('../db');
var shortid = require('shortid');

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'], 
  callbackURL: '/auth/google/callback',
  scope: ['profile', 'email'],
  state: true
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile);

  db.get('SELECT * FROM users WHERE provider = ? AND subject = ?', [
    'google', 
    profile.id
  ], function(err, row) {
    if (err) {return cb(err);}
    if (!row) {
      var id = shortid.generate();
      db.run('INSERT INTO users (id, provider, subject, displayName, email, photo) VALUES (?, ?, ?, ?, ?, ?)', [
        id,
        'google',
        profile.id,
        profile.displayName,
        profile.emails[0].value,
        profile.photos[0].value
      ], function(err) {
        if (err) {return cb(err);}
        var user = {
          id: id,
          profider: 'google',
          subject: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value
        };
        return cb(null, user);
      });
    } else {
      return cb(null, row);
    }
  });
}));

passport.serializeUser(function(user, cb) {
  console.log('serializeUser', user);
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.get('SELECT * FROM users WHERE id = ?', [
    id
  ], function(err, row){
    if (err) {return cb(err);}
    console.log('deserializeUser', id, row);
    cb(null, row);
  });
});

var router = express.Router();

router.get('/google', passport.authenticate('google'));

router.get('/google/callback', passport.authenticate('google', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/'
}));

router.get('/logout', function(req, res, next) {
  req.logout(err => {
    if (err) {
      return next(err);
    } else {
      console.log('logout');
      res.redirect('/');
    }
  });
});

module.exports = router;