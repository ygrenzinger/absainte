'use strict';

var CollectionModel = require('../../../models/collectionModel.js'),
    stringUtil = require('../../../lib/stringUtil.js');

module.exports = function(router) {

  router.get('/', function(req, res) {
      CollectionModel.find({})
          .populate('mainImage')
          .exec(function (err, collections) {
              if (err) {
                  res.send(500, err);
              } else {
                  res.send(collections);
              }
          });
  });

  router.get('/:permalink', function(req, res) {
      CollectionModel.findOne({
          permalink: req.params.permalink
      })
          .populate('mainImage')
          .exec(function (err, collection) {
              if (err) {
                  res.send(500, err);
              } else {
                  res.send(collection);
              }
          });
  });

    var isCollectionValid = function(req, res) {
        if (!req.body.name) {
            res.send(400, 'Collection name is missing');
            return false;
        }
        if (!req.body.mainImage._id) {
            res.send(400, 'Main image is missing');
            return false;
        }
        return true;
    };

    router.post('/', function(req, res) {

        if (!isCollectionValid(req, res)) {
            return;
        }

        var permalink = stringUtil.createPermalink(req.body.name);

        var collection = {
            name: req.body.name,
            permalink: permalink,
            mainImage: req.body.mainImage._id,
            description: req.body.description
        };
        CollectionModel.update({permalink: permalink}, collection, {upsert: true}, function (err) {
            if (err) {
                res.send(500, err);
            } else {
                res.send(collection);
            }
        });
    });
};
