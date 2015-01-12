'use strict';

var mongoose = require('mongoose');

var imageModel = function () {

    var imageSchema = mongoose.Schema({
        type: {type: String, required: true},
        name: {type: String, required: true},
        permalink: {type: String, required: true, unique: true},
        imageUrl: {type: String, required: true},
        thumbnailImgUrl: {type: String, required: true},
        listImgUrl: {type: String, required: true}
    });

    return mongoose.model('Image', imageSchema);

};

module.exports = new imageModel();
