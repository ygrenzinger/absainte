'use strict';


var IndexModel = require('../models/index');


module.exports = function (router) {

    var model = new IndexModel();


    router.get('/', function (req, res) {
        res.render('index', model);
    });

    router.get('/setLocale/:locale', function (req, res) {
        res.cookie('locale', req.params.locale);
        res.redirect('/');
    });

    router.get('/admin', function (req, res) {
        res.render('admin', model);
    });

};
