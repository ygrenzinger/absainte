'use strict';
var _ = require('lodash'),
  fs = require('fs'),
  image = require('../../../lib/image.js'),
  stringUtil = require('../../../lib/stringUtil.js'),
  ImageModel = require('../../../models/imageModel.js');

module.exports = function(router) {

  router.get('/', function(req, res) {

    ImageModel.find({}, function(err, illustrations) {
      if (err) {
        res.send(500, err);
      }
      res.send(illustrations);
    });
  });

  router.get('/:permalink', function(req, res) {

    ImageModel.findOne({
      permalink: req.params.permalink
    }, function(err, illustration) {
      if (err) {
        res.send(500, err);
      }
      res.send(illustration);
    });
  });

  var saveImageToDisk = function(req, res) {
    var file = req.files.file;
    var name = req.body.name;
    var newImage = new ImageModel({
      type: 'illustration',
      name: name,
      permalink: stringUtil.createPermalink(name),
      imageUrl: '',
      thumbnailUrl: ''
    });
    image.save('illustrations', file, true)
      .then(function(result) {
        newImage.imageUrl = result.imageUrl;
        newImage.thumbnailUrl = result.thumbnailUrl;
        newImage.save(function(err) {
          if (err) {
            console.log('newImage.save error', err);
            res.send(500, err);
          }
          res.send(newImage);
        });
      }).fail(function(err) {
        res.send(500, err);
      });
  };

  router.post('/', function(req, res) {
    res.setHeader('Content-Type', 'text/json');
    if (!req.files.file || req.files.file.size === 0) {
      res.send(400, 'No file uploaded');
    } else if (!req.body.name) {
      res.send(400, 'No name');
    } else {
      var name = req.body.name;
      var file = req.files.file;
      var permalink = stringUtil.createPermalink(name);
      file.name = permalink + '.' + file.name.split('.').pop();
      ImageModel.find({
        permalink: permalink
      }, function(err, illustration) {
        if (!_.isEmpty(illustration)) {
          res.send(409, name + ' existe déjà !');
        } else {
          saveImageToDisk(req, res);
        }
      });
    }
  });
};
