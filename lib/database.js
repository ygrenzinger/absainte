/**
 * A custom library to establish a database connection
 */
'use strict';
var mongoose = require('mongoose');

var db = function () {
    return {

        /**
         * Open a connection to the database
         * @param conf
         */
        config: function () {
            var mongoDbUrl;
            if (!!process.env.MONGODB_ADDON_HOST) {
                mongoDbUrl = 'mongodb://'+process.env.MONGODB_ADDON_USER+':'+process.env.MONGODB_ADDON_PASSWORD+'@'+process.env.MONGODB_ADDON_HOST+':'+process.env.MONGODB_ADDON_PORT+'/'+ process.env.MONGODB_ADDON_DB;
            } else {
                mongoDbUrl = 'mongodb://127.0.0.1:27017/absainte';

            }
            console.log('Connect to mongodb url : ' + mongoDbUrl);
            mongoose.connect( mongoDbUrl );
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function callback() {
                console.log('db connection open');
            });
        }
    };
};

module.exports = db();







