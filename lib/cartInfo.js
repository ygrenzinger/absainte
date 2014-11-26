'use strict';

module.exports = function () {
    return function (req, res, next) {
        if (!req.session.cart) {
            req.session.cart = { qty: 0 };
        }

        res.locals.cart = req.session.cart;
        next();
    };
};
