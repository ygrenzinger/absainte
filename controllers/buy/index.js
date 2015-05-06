'use strict';

var ProductModel = require('../../models/productModel.js'),
    mail = require('../../lib/mail.js'),
    app = require('express')();

module.exports = function (router) {

    router.get('/:permalink', function (req, res) {
        ProductModel.findByPermalink(req.params.permalink)
            .then(function (product) {
                var model =
                {
                    product: product
                };
                res.render('buy', model);
            });
    });

    router.post('/', function (req, res) {

        if (!_.isEmpty(req.body.tech)) {
            res.render('contact', {sended: false});
            return;
        }

        var model = {
            firstname: req.body.firstname,
            lastname: req.body.lastname
        };

        mail.templates(res.locals.context.locality, model).then(function(templates) {
            var contactMessage = 'Achat de '+req.body.product+' de ' + req.body.firstname + ' ' + req.body.lastname + ' ' + req.body.email + '<br/>';
            contactMessage += req.body.message;
            mail.send('contact@absainte.com', 'Demande d\'achat - Absainte', contactMessage).then(function() {
                return mail.send(req.body.email, templates.confirmSubject, templates.confirmMessage);
            }).then(function() {
                res.render('buy', {sended: true});
            }).fail(function(err) {
                console.log(err);
                res.render('buy', {sended: false});
            });
        }).fail(function(err) {
            console.log(err);
            res.render('buy', {sended: false});
        });
    });

};
