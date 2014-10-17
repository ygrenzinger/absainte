'use strict';

var passport = require('passport');

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.render('index');
    });

    router.get('/profile', function(req, res) {
        res.render('profile');
    });

    router.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/',
            failureRedirect: '/login' }));

    router.get('/auth/google', passport.authenticate('google', { scope: [ 'email' ] }));
    router.get('/auth/google/callback',
        passport.authenticate('google', { successRedirect: '/',
            failureRedirect: '/login' }));

    router.get('/setLocale/:locale', function (req, res) {
        res.cookie('locale', req.params.locale);
        res.send(200);
    });

    router.get('/getLocale', function (req, res) {
        if (!req.cookies.locale) {
          res.send({ locale: 'en-US' });
        } else {
          res.send({ locale: req.cookies.locale });
        }
    });

};
