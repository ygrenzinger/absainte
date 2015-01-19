'use strict';

var ProductModel = require('../../models/productModel.js'),
    CollectionModel = require('../../models/collectionModel.js');

module.exports = function (router) {

    router.get('/:type/collections', function (req, res) {
        CollectionModel.findByType(req.params.type).then(function (collections) {
            var model =
            {
                type: req.params.type,
                collections: collections
            };
            res.render('collections', model);
        }).fail(function (err) {
            res.send(500, err);
        });
    });

    router.get('/:type/collections/:permalink', function (req, res) {
        var collection = {};
        CollectionModel
            .findByPermalink(req.params.permalink)
            .then(function (collectionFromDB) {
                collection = collectionFromDB;
                return ProductModel.findAllByCollectionId(collection.id);
            }).then(function (products) {
                var descriptionToDisplay = collection.description[res.locals.language];
                var summary = '';
                if (descriptionToDisplay) {
                    summary = descriptionToDisplay.replace(/(<([^>]+)>)/ig,'');
                    if (!!descriptionToDisplay && descriptionToDisplay.length > 255) {
                        summary = summary.substring(0, 255);
                    }
                }
                var model =
                {
                    collection: collection,
                    summary: summary,
                    descriptionToDisplay: descriptionToDisplay,
                    type: req.params.type,
                    products: products
                };
                res.render('products/products', model);
            }).fail(function (err) {
                res.send(500, err);
            });
    });

    router.get('/:type/:permalink', function (req, res) {
        ProductModel.findByPermalink(req.params.permalink)
            .then(function (product) {
                var descriptionToDisplay = product.description[res.locals.language];
                var summary = descriptionToDisplay.replace(/(<([^>]+)>)/ig,'');
                if (!!descriptionToDisplay && descriptionToDisplay.length > 255) {
                    summary = summary.substring(0, 255);
                }
                ProductModel.findRandom(5).then(function (recommendations) {
                    product.recommendations = recommendations;
                    var model =
                    {
                        summary: summary,
                        descriptionToDisplay: descriptionToDisplay,
                        type: req.params.type,
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
    router.post('/:type/:permalink/buy', function (req, res) {

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
            res.redirect('/shop/'+req.params.type+'/' + req.params.permalink);

        });
    });

};
