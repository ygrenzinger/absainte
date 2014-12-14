'use strict';

var ProductModel = require('../../models/productModel.js'),
    CollectionModel = require('../../models/collectionModel.js');

module.exports = function (router) {

    router.get('/collection', function (req, res) {
        CollectionModel.findAll().then(function (collections) {
            var model =
            {
                collections: collections
            };
            res.render('collections', model);
        }).fail(function (err) {
            res.send(500, err);
        });
    });

    router.get('/collection/:permalink', function (req, res) {
        CollectionModel
            .findByPermalink(req.params.permalink)
            .then(function (collection) {
                return ProductModel.findAllByCollectionId(collection.id);
            }).then(function (products) {
                var model =
                {
                    products: products
                };
                res.render('products/products', model);
            }).fail(function (err) {
                res.send(500, err);
            });
    });

    router.get('/', function (req, res) {
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

    router.get('/:permalink', function (req, res) {
        ProductModel.findByPermalink(req.params.permalink)
            .then(function (product) {
                product.descriptionToDisplay = product.description[res.locals.language];
                ProductModel.findRandom(10).then(function (recommendations) {
                    product.recommendations = recommendations;
                    var model =
                    {
                        product: product
                    };
                    res.render('products/product', model);

                }).fail(function (err) {
                    res.send(500, err);
                });
            })
            .fail(function (err) {
                res.send(500, err);
            });
    });


    /**
     * Add an item to the shopping cart
     */
    router.post('/:permalink/buy', function (req, res) {

        //Load (or initialize) the cart
        if (!req.session.cart) {
            req.session.cart = {};
        }
        var cart = req.session.cart;

        //Read the incoming product data
        var id = req.param('item_id');

        var color = req.param('color');

        //Locate the product to be added
        ProductModel.model.findById(id, function (err, prod) {
            if (err) {
                console.log('Error adding product to cart: ', err);
                res.status(500).send(err);
            }

            //Add or increase the product quantity in the shopping cart.
            if (cart[id]) {
                cart[id].qty += 1;
            } else {
                cart[id] = {
                    name: prod.name,
                    color: color,
                    price: prod.price,
                    prettyPrice: prod.prettyPrice(),
                    qty: 1
                };
            }
            //res.status(200).send('Product added to cart');
            res.redirect('/body-jewelry/' + req.params.permalink);

        });
    });

};
