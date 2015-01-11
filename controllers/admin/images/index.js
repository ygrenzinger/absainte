'use strict';

var image = require('../../../lib/imageToS3.js');

module.exports = function(router) {

  router.get('/', function(req, res) {
      image.findAllImages(res);
  });

  router.get('/:permalink', function(req, res) {
      image.getImageFromPermalink(req, res);
  });

  router.post('/', function(req, res) {
      image.uploadImage(req, res, 'illustration');
  });
};
