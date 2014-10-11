'use strict';

var ImageModel = require('../../models/imageModel.js'),
    _ = require('lodash'),
    image = require('../../lib/image.js');

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.cookie('XSRF-TOKEN', res.locals._csrf);
        res.render('admin');
    });

    var getImageList = function(res) {
        ImageModel.find({}, function (err, images) {
            if (err) {
                throw err;
            } else {
                res.send(images);
            }
        });
    };

    router.get('/images_list', function (req, res) {
        getImageList(res);
    });

    //TODO: Correct url
    router.post('/image', function(req, res) {
        image.uploadImage(req, res, req.body.type);
    });

};
