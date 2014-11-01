'use strict';

var mongoose = require('mongoose');

var descriptionSchema = mongoose.Schema({
    language: String,
    content: String
});

module.exports = descriptionSchema;