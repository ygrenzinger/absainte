'use strict';
var _ = require('lodash'),
  fs = require('fs'),
  image = require('../../../lib/image.js'),
  stringUtil = require('../../../lib/stringUtil.js'),
  Illustration = require('../../../models/illustrationModel.js');

module.exports = function(router) {

  router.get('/', function(req, res) {

    Illustration.find({}, function(err, illustrations) {
      if (err) {
        res.send(500, err);
      }
      res.send(illustrations);
    });
  });

  router.get('/:permalink', function(req, res) {

    Illustration.find({
      name: req.params.name
    }, function(err, illustrations) {
      if (err) {
        res.send(500, err);
      }
      res.send(illustrations);
    });
  });

  var saveImageToDisk = function(req, res) {
    var file = req.files.file;
    var name = req.body.name;
    var newIllustration = new Illustration({
      name: name,
      permalink: stringUtil.createPermalink(name),
      url: ''
    });
    image.saveToDisk('illustrations', file)
      .then(function(relativeUrl) {
        newIllustration.url = relativeUrl;
        newIllustration.save(function(err) {
          if (err) {
            console.log('newIllustration.save error', err);
            res.send(500, err);
          }
          res.send(JSON.stringify(newIllustration));
        });
      }).fail(function(err) {
        res.send(500, err);
      });
  };

  router.post('/', function(req, res) {
    res.setHeader('Content-Type', 'text/json');

    // process file
    if (!req.files.file || req.files.file.size === 0) {
      res.send(400, 'No file uploaded');
    } else if (!req.body.name) {
      res.send(400, 'No name');
    } else {
      var name = req.body.name;
      var file = req.files.file;
      var permalink = stringUtil.createPermalink(name);
      file.name = permalink + '.' + file.name.split('.').pop();
      Illustration.find({
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
