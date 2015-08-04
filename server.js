'use strict';

if (process.env.NODE_ENV === 'production' && !!process.env.NODE_ENV) {
    require('nodetime').profile({
        accountKey: process.env.NODETIME_KEY,
        appName: 'Absainte website'
    });
}

var app = require('./index');
var http = require('http');

var server;

/*
 * Create and start HTTP server.
 */

server = http.createServer(app);
server.listen(process.env.PORT || 3000);
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});
