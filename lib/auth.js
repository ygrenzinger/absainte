/**
 * Module that will handle our authentication tasks
 */
'use strict';

var UserModel = require('../models/userModel'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

exports.config = function (settings) {

};

var save = function (user, done) {
    UserModel.upsert(user).then(function(userFromDB) {
        done(null, userFromDB);
    }).fail(function(err) {
        done(err);
    });
};

/**
 * A helper method to retrieve a user from a local DB and ensure that the provided password matches.
 * @param req
 * @param res
 * @param next
 */
exports.localStrategy = function () {

    return new LocalStrategy(function (username, password, done) {

        //Retrieve the user from the database by login
        UserModel.findOne({
            login: username
        }, function (err, user) {
            //If something weird happens, abort.
            if (err) {
                return done(err);
            }

            //If we couldn't find a matching user, flash a message explaining what happened
            if (!user) {
                return done(null, false, {
                    message: 'Login not found'
                });
            }

            //Make sure that the provided password matches what's in the DB.
            if (!user.passwordMatches(password)) {
                return done(null, false, {
                    message: 'Incorrect Password'
                });
            }
            //If everything passes, return the retrieved user object.
            done(null, user);

        });
    });
};

exports.facebookStrategy = function () {
    return new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: 'http://' + process.env.SERVER_HOST + '/auth/facebook/callback'
        },
        function (accessToken, refreshToken, profile, done) {

            var user = {
                email: profile._json.email,
                fullname: profile.displayName,
                firstname: profile._json.first_name,
                lastname: profile._json.last_name
            };
            save(user, done);

        }
    );
};


exports.googleStrategy = function () {
    return new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://' + process.env.SERVER_HOST + '/auth/google/callback'
        },
        function (accessToken, refreshToken, profile, done) {

            var user = {
                email: profile.email,
                fullname: profile.displayName,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName
            };
            save(user, done);

        }
    );
};

/**
 * A helper method to determine if a user has been authenticated, and if they have the right role.
 * If the user is not known, redirect to the login page. If the role doesn't match, show a 403 page.
 * @param role The role that a user should have to pass authentication.
 */
exports.isAuthenticated = function () {

    return function (req, res, next) {
        //access map
        var auth = {
                '/admin': true,
                '/profile': true
            },
            blacklist = {
                'client': {
                    '/admin': true
                }
            },
            route = req.url,
            role = (req.user && req.user.role) ? req.user.role : '';
        if (!auth[route]) {
            next();
        } else if (!req.isAuthenticated()) {
            //If the user is not authorized, save the location that was being accessed so we can redirect afterwards.
            req.session.goingTo = req.url;
            req.flash('error', 'Please log in to view this page');
            res.redirect('/login');
        }
        //Check blacklist for this user's role
        else if (blacklist[role] && blacklist[role][route] === true) {
            var model = {
                url: route
            };

            //pop the user into the response
            res.locals.user = req.user;
            res.status(401);

            res.render('errors/401', model);
        } else {
            next();
        }

    };
};

/**
 * A helper method to add the user to the response context so we don't have to manually do it.
 * @param req
 * @param res
 * @param next
 */
exports.injectUser = function () {
    return function injectUser(req, res, next) {
        if (req.isAuthenticated()) {
            res.locals.user = req.user;
        }
        next();
    };
};
