'use strict';

var Product = require('../../models/productModel'),
    User = require('../../models/userModel'),
    getBundle = require('../../lib/getBundle'),
    paypal = require('paypal-rest-sdk'),
    _ = require('lodash'),
    port = process.env.PORT || 8000;

module.exports = function (router) {

    /**
     * Display the shopping cart
     */
    router.get('/', getBundle, function (req, res) {


        var prettyPrice = function (price) {
            return price ? price.toFixed(2) + ' €' : '€';
        };

        var locals = res.locals;
        var i18n = res.app.kraken.get('i18n');
        var locality = locals && locals.context && locals.context.locality || i18n.fallback;

        //Retrieve the shopping cart from memory
        var cart = req.session.cart,
            displayCart = {items: [], total: 0},
            total = 0;
        if (!cart) {
            res.bundle.get({
                'bundle': 'messages',
                'model': {},
                'locality': locality
            }, function bundleReturn(err, messages) {
                res.render('result', {result: messages.empty, continueMessage: messages.keepShopping});
            });

            return;
        }

        _.forEach(cart, function(item) {
            displayCart.items.push(item);
            total += (item.qty * item.price);
        });

        req.session.total = total;
        var cartLength = Object.keys(cart).length;

        var model =
        {
            cart: displayCart,
            total: prettyPrice(total)
        };
        res.bundle.get({
            'bundle': 'messages',
            'model': {'cartItemLength': cartLength},
            'locality': locality
        }, function bundleReturn(err, messages) {
            model.itemsInCart = messages.items;
            res.render('cart', model);
        });

    });

    router.post('/finalize', function (req, res) {

        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var fullname = (firstname + ' ' + lastname).substring(0, 50);
        var email = req.body.email;

        var shipping_address = {
            'recipient_name': fullname,
            'line1': req.body.address1,
            'line2': req.body.address2,
            'city': req.body.city,
            'country_code': req.body.country,
            'postal_code': req.body.postalcode,
            'state': req.body.state
        };

        var user = {
            firstname: firstname,
            lastname: lastname,
            fullname: fullname,
            email: email
        };

        var paypalPayment = {
            'intent': 'sale',
            'payer': {
                'payment_method': 'paypal',
                'payer_info': {
                    'shipping_address': shipping_address
                }
            },
            'redirect_urls': {
                'return_url': 'http://localhost:' + port + '/cart/order-finalized',
                'cancel_url': 'http://localhost:' + port + '/cart/finalize'
            },
            'transactions': [{
                'amount': {
                    'currency': 'EUR'
                }
            }]
        };

        var transaction = paypalPayment.transactions[0];
        transaction.amount.total = Number(req.session.total).toFixed(2);
        transaction.description = 'Absainte order';

        transaction.item_list = {
            'items': []
        };
        var cart = req.session.cart;

        _.forEach(cart, function(item) {
            var cartitem = {
                'name': item.name,
                'quantity': item.qty,
                'price': Number(item.price).toFixed(2),
                'currency': 'eur'

            };
            transaction.item_list.items.push(cartitem);
        });

        User.insertNewOrder(user, paypalPayment).then(function() {
            paypal.payment.create(paypalPayment, {}, function (err, resp) {
                if (err) {
                    res.render('cart', {message: [{desc: 'Payment API call failed', type: 'error'}]});
                }

                if (resp) {
                    var now = (new Date()).toISOString().replace(/\.[\d]{3}Z$/, 'Z ');

                    var link = resp.links;
                    for (var i = 0; i < link.length; i++) {
                        if (link[i].rel === 'approval_url') {
                            res.redirect(link[i].href);
                        }
                    }
                }
            });
        });

    });
};
