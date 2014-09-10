'use strict';

var ImageModel = require('../../models/imageModel.js'),
    _ = require('lodash'),
    image = require('../../lib/image.js');

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.render('admin');
        res.cookie('XSRF-TOKEN', res.locals._csrf);
    });

    router.get('/images', function (req, res) {
        ImageModel.find({}, function (err, images) {
            if (err) {
                throw err;
            } else {
                var image_list = _.map(images, function (image) {
                    return {
                        '_id': image._id,
                        'name': image.name,
                        'permalink': image.permalink,
                        'image': image.imageUrl,
                        'thumb': image.thumbnailUrl,
                        'folder': image.type
                    };
                });
                res.send(image_list);
            }
        });
    });

    router.post('/image', function(req, res) {
        image.uploadImage(req, res, req.body.type);
    });

};
