'use strict';

var passport = require('passport'),
    mail = require('../lib/mail.js');

var addOauthProvider = function(provider, router) {

    router.get('/auth/'+provider, passport.authenticate(provider, { scope: [ 'email' ] }));
    router.get('/auth/'+provider+'/callback', function(req, res, next){
        passport.authenticate(provider, function(err, user, info){
            // This is the default destination upon successful login.
            var redirectUrl = '/';

            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }

                // If we have previously stored a redirectUrl, use that,
                // otherwise, use the default.
                if (req.session.goingTo) {
                    redirectUrl = req.session.goingTo;
                    req.session.goingTo = null;
                }
                res.redirect(redirectUrl);
            });
        })(req, res, next);
    });
};

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.render('index');
    });

    router.get('/profile', function(req, res) {
        res.render('profile');
    });

    addOauthProvider('google', router);
    addOauthProvider('facebook', router);

    router.get('/mailTest', function(req, res) {
        mail.send('yannick.grenzinger@gmail.com', 'test', 'hello world mail');
        res.send(200);
    });

};
