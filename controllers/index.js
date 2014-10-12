'use strict';

var passport = require('passport');

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.render('index');
    });

    router.get('/profile', function(req, res) {
        res.render('profile');
    });

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/',
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
