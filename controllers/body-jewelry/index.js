'use strict';

var ProductModel = require('../../models/productModel.js'),
    CollectionModel = require('../../models/collectionModel.js');

module.exports = function (router) {

    router.get('/collection/:permalink', function(req, res) {
        CollectionModel
            .findByPermalink(req.params.permalink)
            .then(function(collection) {
                return ProductModel.findAllByCollectionId(collection.id);
            }).then(function(products) {
                var model =
                {
                    products: products
                };
                res.render('products/products', model);
            }).fail(function(err) {
                res.send(500, err);
            });
    });

    router.get('/', function(req, res) {
        ProductModel
            .findAll()
            .then(function (products) {
                var model =
                {
                    products: products
                };
                res.render('products/products', model);
            })
            .fail(function (err) {
                res.send(500, err);
            });
    });

    router.get('/:permalink', function(req, res) {
        ProductModel.findByPermalink(req.params.permalink)
            .then(function (product) {
                var model =
                {
                    product: product
                };
                res.render('products/product', model);
            })
            .fail(function (err) {
                res.send(500, err);
            });
    });

};
