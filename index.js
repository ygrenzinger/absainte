'use strict';

var kraken = require('kraken-js'),
    app = require('express')(),
    options = require('./lib/spec')(app),
    port = process.env.PORT || 3000;

app.use(kraken(options));

app.locals.env = process.env.NODE_ENV;

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d with ENV ', app.settings.env, port, process.env.NODE_ENV);
});



