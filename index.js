'use strict';

var kraken = require('kraken-js'),
    paypal = require('paypal-rest-sdk'),
    db = require('./lib/database'),
    app = require('express')(),
    CollectionModel = require('./models/collectionModel.js'),
    options = {
        onconfig: function (config, next) {

                //configure mongodb and paypal sdk
                db.config(config.get('databaseConfig'));
                paypal.configure(config.get('paypalConfig'));

            //any config setup/overrides here
            next(null, config);
        }
    },
    port = process.env.PORT || 8000;


app.use(kraken(options));

app.use(function (req, res, next) {
    if (!app.locals.collections) {
        CollectionModel.find({})
            .exec(function(err, collections) {
                if (err) {
                    res.send(500, err);
                } else {
                    app.locals.collections = collections;
                }
            });
    }
    next();
});


app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
