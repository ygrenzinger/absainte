'use strict';

var mongoose = require('mongoose');

var imageModel = function () {

    var imageSchema = mongoose.Schema({
        type: {type: String, required: true},
        name: {type: String, required: true},
        permalink: {type: String, required: true, unique: true},
        imageUrl: {type: String, required: true},
        thumbnailUrl: String
    });

    return mongoose.model('Image', imageSchema);

};

module.exports = new imageModel();
