'use strict';

var mail = require('../../lib/mail.js'),
    _ = require('lodash'),
    app = require('express')();

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.render('contact');
    });

    router.post('/', function (req, res) {

        if (!_.isEmpty(req.body.tech)) {
            res.render('contact');
            return;
        }

        var model = {
            name: req.body.name
        };

        mail.templates(res.locals.context.locality, model).then(function(templates) {
            var contactMessage = 'Message de ' + req.body.name + ' ' + req.body.email + '<br/>';
            contactMessage += req.body.message;
            mail.send('contact@absainte.com', 'Demande de Contact - Absainte', contactMessage).then(function() {
                return mail.send(req.body.email, templates.confirmSubject, templates.confirmMessage);
            }).then(function() {
                res.render('contact', {'sended': 'ok'});
            }).fail(function(err) {
                console.log(err);
                res.render('contact', {'sended': 'ko'});
            });
        }).fail(function(err) {
            console.log(err);
            res.render('contact', {'sended': 'ko'});
        });
    });

};
