'use strict';

var ImageModel = require('../../models/imageModel.js'),
    _ = require('lodash');

module.exports = function(router) {

  router.get('/', function(req, res) {
    res.render('admin');
    res.cookie('XSRF-TOKEN', res.locals._csrf);
  });

  router.get('/image_list', function(req, res) {
      ImageModel.find({}, function(err, images) {
          if (err){
              throw err;
          } else {
              var image_list = _.map(images, function(image){
                  return {
                      "image": image.imageUrl,
                      "thumb": image.thumbnailUrl,
                      "folder": image.type
                  }
              });
              res.send(image_list);
          }
      });
  });

};
