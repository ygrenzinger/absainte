'use strict';

var mandrill = require('mandrill-api/mandrill'),
    mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY),
    Q = require('q');

var mail = function () {
    var message = {
        "html": null,
        "text": null,
        "subject": null,
        "from_email": "contact@absainte.com",
        "from_name": "Absainte",
        "to": [
            {
                "email": "",
                "name": "",
                "type": "to"
            }
        ],
        "headers": {
            "Reply-To": "contact@absainte.com"
        }
    };

    var send = function (to, subject, text) {

        message.to[0].email = to;
        message.html = text;
        message.text = text;
        message.subject = subject;

        var deferred = Q.defer();

        mandrill_client.messages.send({"message": message, "async": false, "ip_pool": null, "send_at": null},
            function (result) {
                deferred.resolve(result);
            }, function (e) {
                var err = 'An email delivery error occurred: ' + e.name + ' - ' + e.message;
                console.log(err);
                deferred.reject(err);
            });

        return deferred.promise;
    };

    return {
        send: send
    };
};

module.exports = mail();
