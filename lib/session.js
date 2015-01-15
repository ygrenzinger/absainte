"use strict";

var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);

module.exports = function mongostore(settings, postgresConfig) {
    settings.store = new MongoStore(postgresConfig);
    return session(settings);
};
