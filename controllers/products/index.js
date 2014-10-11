'use strict';

var ProductModel = require('../../models/productModel.js');

module.exports = function (router) {

    router.get('/', function(req, res) {
        var query = {};
        if (!!req.query.collection) {
            query.collectionFrom = req.query.collection;
        }

        ProductModel.find(query)
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
