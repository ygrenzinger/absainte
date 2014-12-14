'use strict';

module.exports = function () {
    return function (req, res, next) {
        res.locals.cartQty = 0;
        if (!!req.session.cart) {
            for (var item in req.session.cart) {
                res.locals.cartQty += req.session.cart[item].qty;
            }
        }
        next();
    };
};
