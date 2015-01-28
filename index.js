'use strict';

require('nodetime').profile({
    accountKey: process.env.NODETIME_KEY,
    appName: 'Absainte website'
});

var kraken = require('kraken-js'),
    db = require('./lib/database'),
    app = require('express')(),
    options = require('./lib/spec')(app),
    port = process.env.PORT || 3000;

app.use(kraken(options));

app.locals.env = process.env.NODE_ENV;

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});



