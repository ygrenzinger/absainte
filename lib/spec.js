'use strict';

var express = require('express'),
    passport = require('passport'),
    auth = require('../lib/auth'),
    paypal = require('paypal-rest-sdk'),
    db = require('../lib/database'),
    UserModel = require('../models/userModel');

var addingUser = function() {

    var u1 = new UserModel({
        name: 'Kraken McSquid',
        login: 'kraken',
        password: 'kraken',
        role: 'admin'
    });

    var u2 = new UserModel({
        name: 'Ash Williams',
        login: 'ash',
        password: 'ash',
        role: 'user'
    });

    //Ignore errors. In this case, the errors will be for duplicate keys as we run this app more than once.
    u1.save();
    u2.save();

};

module.exports = function spec(app) {
    addingUser();
    app.on('middleware:after:session', function configPassport(eventargs) {
        passport.use(auth.facebookStrategy());
        //Tell passport to use our newly created local strategy for authentication
        passport.use(auth.localStrategy());
        //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
        passport.deserializeUser(function(id, done) {
            UserModel.findOne({
                _id: id
            }, function(err, user) {
                done(null, user);
            });
        });
        app.use(passport.initialize());
        app.use(passport.session());
    });
    return {
        onconfig: function(config, next) {

            var dbConfig = config.get('databaseConfig'),
                cryptConfig = config.get('bcrypt');

            //configure mongodb and paypal sdk
            db.config(config.get('databaseConfig'));
            paypal.configure(config.get('paypalConfig'));

            next(null, config);
        }
    };

};