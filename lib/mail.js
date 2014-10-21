'use strict';

var emailjs = require('emailjs'),
    Q = require('q');

var mail = function () {

    var smtpServer = emailjs.server.connect({
        user: "absainte@yahoo.fr",
        password: process.env.MANDRILL_API_KEY,
        host: "smtp.mandrillapp.com",
        port: "587"
    });

    var send = function (to, subjet, text) {

        var deferred = Q.defer();
        smtpServer.send({
            from: "contact@absainte.com",
            to: to,
            subject: subjet,
            text: text
        }, function (err, message) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(message);
            }
        });
        return deferred.promise;
    };

    return {
        send: send
    };
};

module.exports = mail();