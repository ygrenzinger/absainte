'use strict';

var ProductModel = require('../../../models/productModel.js'),
    stringUtil = require('../../../lib/stringUtil.js'),
    imageLib = require('../../../lib/image.js'),
    _ = require('lodash');

module.exports = function(router) {

  router.get('/', function(req, res) {
      ProductModel.find({})
          .populate('mainImage')
          .populate('otherImages')
          .exec(function (err, products) {
              if (err) {
                  res.send(500, err);
              } else {
                  res.send(products);
              }
          });
  });

  router.get('/:permalink', function(req, res) {
      ProductModel.findOne({
          permalink: req.params.permalink
      })
      .populate('mainImage')
      .populate('otherImages')
      .exec(function (err, product) {
          if (err) {
              res.send(500, err);
          } else {
              res.send(product);
          }
      });
  });

  var isProductValid = function(req, res) {
      if (!req.body.collectionName) {
          res.send(400, 'Collection name is missing');
          return false;
      }
      if (!req.body.name) {
          res.send(400, 'Product name is missing');
          return false;
      }
      if (isNaN(req.body.price) || req.body.price < 0) {
          res.send(400, 'Price is not correct');
          return false;
      }
      if (!req.body.mainImage._id) {
          res.send(400, 'Main image is missing');
          return false;
      }
      return true;
  };

  router.post('/', function(req, res) {

      if (!isProductValid(req, res)) {
          return;
      }

      var permalink = stringUtil.createPermalink(req.body.name);

      var product = {
          collectionName: req.body.collectionName,
          name: req.body.name,
          permalink: permalink,
          price: req.body.price,
          mainImage: req.body.mainImage._id,
          description: req.body.description,
          otherImages: _.map(req.body.otherImages, function(img) { return img._id; })
      };
      ProductModel.update({permalink: permalink}, product, {upsert: true}, function (err) {
            if (err) {
               res.send(500, err);
            } else {
                res.send(product);
            }
      });
  });
};
