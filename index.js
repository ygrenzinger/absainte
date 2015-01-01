'use strict';

var kraken = require('kraken-js'),
    db = require('./lib/database'),
    app = require('express')(),
    options = require('./lib/spec')(app),
    CollectionModel = require('./models/collectionModel.js'),
    port = process.env.PORT || 8000;

app.use(kraken(options));

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
