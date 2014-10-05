'use strict';


var ProductModel = require('../models/productModel.js');

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.render('index');
    });

    router.get('/setLocale/:locale', function (req, res) {
        res.cookie('locale', req.params.locale);
        res.send(200);
    });

    router.get('/getLocale', function (req, res) {
        if (!req.cookies.locale) {
          res.send({ locale: 'en-US' });
        } else {
          res.send({ locale: req.cookies.locale });
        }
    });

    router.get('/collections', function (req, res) {
        ProductModel.find({})
            .select('collectionName')
            .exec(function(err, collectionNames) {
                if (err) {
                    res.send(500, err);
                } else {
                    res.send(collectionNames);
                }
            });
    });

};
