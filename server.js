'use strict';

var app = require('./index');
var http = require('http');

var server;

/*
 * Create and start HTTP server.
 */

server = http.createServer(app);

