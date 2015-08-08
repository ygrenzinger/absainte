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
        config: function (conf) {
            var mongoDbUrl = 'mongodb://'
                +process.env.MONGODB_ADDON_USER+':'+process.env.MONGODB_ADDON_PASSWORD
                +'@'+process.env.MONGODB_ADDON_HOST+':'+process.env.MONGODB_ADDON_PORT
                +'/'+ process.env.MONGODB_ADDON_DB;
            console.log('Connecting to mongodb url : ' + mongoDbUrl);
            mongoose.connect( mongoDbUrl );
            //mongoose.connect('mongodb://' + conf.host + '/' + conf.database);
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function callback() {
                console.log('db connection open');
            });
        }
    };
};

module.exports = db();







