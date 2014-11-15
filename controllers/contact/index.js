'use strict';

var mail = require('../../lib/mail.js');

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.render('contact');
    });

    router.post('/', function (req, res) {
        var message = "Message de " + req.body.firstname + " " + req.body.lastname + " " + req.body.email + "\n";
        message += req.body.message;
        mail.send(req.body.email, "Contact Absainte", message);
        var model =
        {
            sended: false
        };
        res.render('contact', model);
    });

};
