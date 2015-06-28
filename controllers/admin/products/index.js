'use strict';

var ProductModel = require('../../../models/productModel.js'),
    _ = require('lodash');

module.exports = function (router) {

    router.get('/', function (req, res) {
        ProductModel
            .findAll()
            .then(function (products) {
                res.send(products);
            })
            .fail(function (err) {
                res.send(500, err);
            });
    });

    router.get('/:permalink', function (req, res) {
        ProductModel
            .findByPermalink(req.params.permalink)
            .then(function (product) {
                res.send(product);
            })
            .fail(function (err) {
                res.send(500, err);
            });
    });

    router.delete('/:id', function (req, res) {
        ProductModel
            .delete(req.params.id)
            .then(function () {
                res.send('product deleted');
            })
            .fail(function (err) {
                res.send(500, err);
            });
    });

    var validProduct = function (req, res) {
        if (!req.body.collectionFrom || !req.body.collectionFrom._id) {
            res.status(400).send('Associated collection is missing');
            return false;
        }
        if (!req.body.name) {
            res.status(400).send('Product name is missing');
            return false;
        }
        if (isNaN(req.body.price) || req.body.price < 0) {
            res.status(400).send('Price is not correct');
            return false;
        }
        if (!req.body.mainImage._id) {
            res.status(400).send('Main image is missing');
            return false;
        }
        return true;
    };

    router.post('/', function (req, res) {
        if (!validProduct(req, res)) {
            return;
        }

        var product = {
            _id: req.body._id,
            collectionFrom: req.body.collectionFrom._id,
            name: req.body.name,
            permalink: req.body.permalink,
            price: req.body.price,
            mainImage: req.body.mainImage._id,
            description: {
                'en': req.body.description.en,
                'fr': req.body.description.fr
            },
            otherImages: _.map(req.body.otherImages, function (img) {
                return img._id;
            })
        };

        ProductModel
            .upsert(product)
            .then(function (product) {
                res.send(product);
            })
            .fail(function (err) {
                res.status(500).send(err);
            });
    });
};
