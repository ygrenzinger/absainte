'use strict';

module.exports = function () {
    return function (req, res, next) {
        var locale = 'en-US';
        res.locals.language = 'en';
        res.locals.langPath = '';

        if (req.url.lastIndexOf('/fr/', 0) === 0) {
            locale = 'fr-FR';
            res.locals.language = 'fr';
            res.locals.langPath = '/fr';
            req.url = req.url.slice(3);
        }

        //Set the locality for this response. The template will pick the appropriate bundle
        req.locale = locale;
        res.locals.locale = locale;

        next();
    };
};
