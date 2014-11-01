/**
 * A model for blog
 */
'use strict';

var mongoose = require('mongoose'),
    descriptionSchema = require('./descriptionSchema.js');

var blogModel = function() {

  var blogSchema = mongoose.Schema({
    title: String,
    description: descriptionSchema
  });

  return mongoose.model('Blog', blogSchema);
};

module.exports = new blogModel();