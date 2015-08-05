'use strict';

var express = require('express'),
    passport = require('passport'),
    auth = require('../lib/auth'),
    paypal = require('paypal-rest-sdk'),
    db = require('../lib/database'),
    UserModel = require('../models/userModel');

module.exports = function spec(app) {
    app.on('middleware:after:session', function configPassport(eventargs) {
        passport.use(auth.facebookStrategy());
        passport.use(auth.googleStrategy());
        passport.use(auth.localStrategy());
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function (id, done) {
            UserModel.model.findById(id, function (err, user) {
                done(err, user);
            });
        });
        app.use(passport.initialize());
        app.use(passport.session());
    });
    return {
        onconfig: function (config, next) {

            //configure mongodb and paypal sdk
            db.config(config.get('databaseConfig'));
            paypal.configure(config.get('paypalConfig'));

            next(null, config);
        }
    };

};
