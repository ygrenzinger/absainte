'use strict';

var Illustration = require('../../models/illustrationModel.js');

module.exports = function(router) {

  router.get('/', function(req, res) {
    Illustration.find(function(err, illustrations) {
      if (err) {
        res.send(500, err);
      }
			var model =
			{
				illustrations: illustrations,
      };
			res.render('illustrations/illustrations', model);
    });
  });

  router.get('/:permalink', function(req, res) {
    var permalink = req.params.permalink;
    Illustration.findOne({permalink: permalink}, function(err, illustration) {
      if (err) {
        res.send(500, err);
      }
      var model =
      {
        illustration: illustration,
      };
      res.render('illustrations/illustration', model);
    });
  });

};
