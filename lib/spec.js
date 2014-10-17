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
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    passport.deserializeUser(function(user, done) {
      UserModel.findOne({
        _id: user.id
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