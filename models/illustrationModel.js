'use strict';

var mongoose = require('mongoose');

var illustrationModel = function () {

    //Define a super simple schema for our products.
    var illustrationSchema = mongoose.Schema({
        name: String,
        permalink: String,
        imageUrl: String,
        thumbnailUrl: String
    });

    return mongoose.model('Illustration', illustrationSchema);

};

module.exports = new illustrationModel();
