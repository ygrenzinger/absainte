'use strict';

var onHeaders = require('on-headers');

/**
 * Reponse time:
 *
 * Adds the `X-Response-Time` header displaying the response
 * duration in milliseconds.
 *
 * @param {object} [options]
 * @param {number} [options.digits=3]
 * @return {function}
 * @api public
 */

module.exports = function responseTime(options) {

    options = options || {};

    // response time digits
    var digits = options.digits !== undefined ? options.digits : 2;

    // header name
    var header = options.header || 'X-Response-Time';

    // display suffix
    var suffix = options.suffix !== undefined ? Boolean(options.suffix) : true;

    return function responseTime(req, res, next) {
        var startAt = process.hrtime();
        var url = req.url;

        onHeaders(res, function () {
            if (this.getHeader(header)) {
                return;
            }

            var diff = process.hrtime(startAt);
            var ms = diff[0] * 1e3 + diff[1] * 1e-6;
            var val = ms.toFixed(digits);

            if (suffix) {
                val += 'ms';
            }
            console.log('request time for url ' +url+ ': '+ val);

            this.setHeader(header, val);
        });

        next();
    };
};
