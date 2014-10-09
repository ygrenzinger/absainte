'use strict';

var mongoose = require('mongoose');

var collectionModel = function () {

    var collectionSchema = mongoose.Schema({
        name:           { type: String, required: true },
        permalink:      { type: String, required: true },
        mainImage:      { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
        description:    String

    });

    return mongoose.model('Collection', collectionSchema);

};

module.exports = new collectionModel();
