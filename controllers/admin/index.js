'use strict';

var ImageModel = require('../../models/imageModel.js'),
    _ = require('lodash'),
    image = require('../../lib/image.js');

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.render('admin');
        res.cookie('XSRF-TOKEN', res.locals._csrf);
    });

    var getImageList = function(res) {
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
    };

    router.get('/images_list', function (req, res) {
        getImageList(res);
    });

    //TODO: Correct url
    router.post('/image', function(req, res) {
        image.uploadImage(req, res, req.body.type);
    });

};
