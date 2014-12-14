'use strict';
var Product = require('../../models/productModel');
var getBundle = require('../../lib/getBundle');

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
            res.bundle.get({'bundle': 'messages', 'model': {}, 'locality': locality}, function bundleReturn(err, messages) {
                res.render('result', {result: messages.empty, continueMessage: messages.keepShopping});
            });

            return;
        }

        //Ready the products for display
        for (var item in cart) {
            displayCart.items.push(cart[item]);
            total += (cart[item].qty * cart[item].price);
        }

        req.session.total = total;
        var cartLength = Object.keys(cart).length;

        var model =
        {
            cart: displayCart,
            total: prettyPrice(total)
        };
        res.bundle.get({'bundle': 'messages', 'model': {'cartItemLength': cartLength}, 'locality': locality}, function bundleReturn(err, messages) {
            model.itemsInCart = messages.items;
            res.render('cart', model);
        });

    });

    router.post('finalize', function (req, res) {
        var paypalPayment = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {},
            "transactions": [{
                "amount": {
                    "currency": "USD"
                }
            }]
        };

        console.log(config);
        paypalPayment.transactions[0].amount.total = req.query.order_amount;
        paypalPayment.redirect_urls.return_url = "http://localhost:" + (config.port ? config.port : 3000) + "/orderExecute?order_id=" + order_id;
        paypalPayment.redirect_urls.cancel_url = "http://localhost:" + (config.port ? config.port : 3000) + "/?status=cancel&order_id=" + order_id;
        paypalPayment.transactions[0].description = req.session.desc;
        paypal.payment.create(paypalPayment, {}, function (err, resp) {
            if (err) {
                res.render('order_detail', { message: [{desc: "Payment API call failed", type: "error"}]});
            }

            if (resp) {
                var now = (new Date()).toISOString().replace(/\.[\d]{3}Z$/, 'Z ');
                db.insertOrder(order_id, req.session.email, resp.id, resp.state, req.session.amount, req.session.desc, now, function (err, order) {
                    if (err || !order) {
                        console.log(err);
                        res.render('order_detail', { message: [{desc: "Could not save order details", type: "error"}]});
                    } else {
                        var link = resp.links;
                        for (var i = 0; i < link.length; i++) {
                            if (link[i].rel === 'approval_url') {
                                res.redirect(link[i].href);
                            }
                        }
                    }
                });
            }
        });
    });
};
