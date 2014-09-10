'use strict';

var Image = require('../../models/imageModel.js');

module.exports = function (router) {

    router.get('/', function (req, res) {
        Image.find({ type: 'illustration' }, function (err, illustrations) {
            if (err) {
                res.send(500, err);
            } else {
                var model = {
                    illustrations: illustrations
                };
                res.render('illustrations/illustrations', model);
            }
        });
    });

    router.get('/:permalink', function (req, res) {
        var permalink = req.params.permalink;
        Image.findOne({permalink: permalink}, function (err, illustration) {
            if (err) {
                res.send(500, err);
            }
            var model =
            {
                illustration: illustration
            };
            res.render('illustrations/illustration', model);
        });
    });

};
