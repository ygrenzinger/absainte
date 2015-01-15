'use strict';

var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);

module.exports = function mongostore(settings, mongostoreConfig) {
    settings.store = new MongoStore(mongostoreConfig);
    return session(settings);
};
