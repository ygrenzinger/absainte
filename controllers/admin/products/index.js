'use strict';

var ProductModel = require('../../../models/productModel.js'),
    stringUtil = require('../../../lib/stringUtil.js'),
    _ = require('lodash');

module.exports = function(router) {

  router.get('/', function(req, res) {
      ProductModel
          .findAll()
          .then(function (products) {
              res.send(products);
          })
          .fail(function (err) {
              res.send(500, err);
          });
  });

  router.get('/:permalink', function(req, res) {
      ProductModel
          .findByPermalink(req.params.permalink)
          .then(function (product) {
              res.send(product);
          })
          .fail(function (err) {
              res.send(500, err);
          });
  });

  var isProductValid = function(req, res) {
      if (!req.body.collectionFrom) {
          res.send(400, 'Associated collection is missing');
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

      var product = {
          _id: req.body._id,
          collectionFrom: req.body.collectionFrom._id,
          name: req.body.name,
          permalink: req.body.name,
          price: req.body.price,
          mainImage: req.body.mainImage._id,
          description: {
              'en': req.body.description.en,
              'fr': req.body.description.fr
          },
          otherImages: _.map(req.body.otherImages, function(img) { return img._id; })
      };

      ProductModel
          .upsert(product)
          .then(function (product) {
              res.send(product);
          })
          .fail(function (err) {
              res.status(500).send(err);
          });
  });
};
