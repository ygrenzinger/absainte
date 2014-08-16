'use strict';


var IndexModel = require('../models/index');


module.exports = function (router) {

    var model = new IndexModel();


    router.get('/', function (req, res) {
        res.render('index', model);
    });

    router.get('/setLocale/:locale', function (req, res) {
        res.cookie('locale', req.params.locale);
        res.send(200);
    });

    router.get('/getLocale', function (req, res) {
        if (!req.cookies.locale) {
          res.send({ locale: 'en-US' });
        } else {
          res.send({ locale: req.cookies.locale });
        }
    });

    router.get('/admin', function (req, res) {
        res.render('admin', model);
    });

};
