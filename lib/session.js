'use strict';

var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

module.exports = function mongostore(settings, mongostoreConfig) {
    settings.store = new MongoStore({ mongooseConnection: mongoose.connection });
    return session(settings);
};
