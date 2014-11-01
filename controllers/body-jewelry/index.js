'use strict';

var ProductModel = require('../../models/productModel.js'),
    CollectionModel = require('../../models/collectionModel.js');

module.exports = function (router) {

    router.get('/collection/:permalink', function(req, res) {
        CollectionModel
            .findByPermalink(req.params.permalink)
            .then(function(collection) {
                ProductModel.find({collectionFrom: collection._id})
                    .populate('mainImage')
                    .populate('otherImages')
                    .exec(function (err, products) {
                        if (err) {
                            res.send(500, err);
                        } else {
                            var model =
                            {
                                products: products
                            };
                            res.render('products/products', model);
                        }
                    });
            }).fail(function(err) {
                res.send(500, err);
            });
    });

    router.get('/', function(req, res) {
        ProductModel.find({})
            .populate('mainImage')
            .populate('otherImages')
            .exec(function (err, products) {
                if (err) {
                    res.send(500, err);
                } else {
                    var model =
                    {
                        products: products
                    };
                    res.render('products/products', model);
                }
            });
    });

    router.get('/:permalink', function(req, res) {
        ProductModel.findOne({
                permalink: req.params.permalink
            })
            .populate('mainImage')
            .populate('otherImages')
            .exec(function (err, product) {
                if (err) {
                    res.send(500, err);
                } else {
                    var model =
                    {
                        product: product
                    };
                    res.render('products/product', model);
                }
            });
    });

};
