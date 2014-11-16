'use strict';

var mail = require('../../lib/mail.js'),
    app = require('express')();

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.render('contact');
    });

    router.post('/', function (req, res) {

        var model = {
            firstname: req.body.firstname,
            lastname: req.body.lastname
        };

        mail.templates(res.locals.context.locality, model).then(function(templates) {
            var contactMessage = "Message de " + req.body.firstname + " " + req.body.lastname + " " + req.body.email + "<br/>";
            contactMessage += req.body.message;
            mail.send("contact@absainte.com", "Demande de Contact - Absainte", contactMessage).then(function() {
                return mail.send(req.body.email, templates.confirmSubject, templates.confirmMessage);
            }).then(function() {
                res.render('contact', {sended: false});
            }).fail(function(err) {
                console.log(err);
                res.render('contact', {sended: false});
            });
        }).fail(function(err) {
            console.log(err);
            res.render('contact', {sended: false});
        });
    });

};
