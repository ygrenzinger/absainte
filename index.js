'use strict';

var kraken = require('kraken-js'),
    db = require('./lib/database'),
    app = require('express')(),
    options = require('./lib/spec')(app),
    port = process.env.PORT || 8080;

app.use(kraken(options));

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});



