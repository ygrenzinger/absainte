/**
 * A model for blog
 */
'use strict';

var mongoose = require('mongoose');

var blogModel = function() {

  var blogSchema = mongoose.Schema({
    title: String,
    description: String
  });

  return mongoose.model('Blog', blogSchema);
};

module.exports = new blogModel();