'use strict';

var ProductModel = require('../../../models/productModel.js'),
    _ = require('lodash');

module.exports = function(router) {

  router.get('/', function(req, res) {
  });

  router.get('/:permalink', function(req, res) {
  });

  router.post('/', function(req, res) {

      var productImage = new ProductModel({
          collectionName: req.body.collectionName,
          name: req.body.name,
          price: req.body.price,
          mainImage: req.body.mainImage._id,
          description: req.body.description,
          otherImages: _.map(req.body.otherImages, function(img) { return img._id; })
      });
      productImage.save(function (err) {
            if (err) {
               res.send(500, "Product Save error");
            } else {
                res.send(200);
            }
      });
  });
};
