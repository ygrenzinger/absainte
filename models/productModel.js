'use strict';

var mongoose = require('mongoose');

var productModel = function () {

    var productSchema = mongoose.Schema({
        collection:   String,
        name:         String,
        price:        { type: Number, min: 0 },
        mainImage:    mongoose.Schema.ObjectId,
        description:  String,
        otherImages:  String

    });

    return mongoose.model('Product', productSchema);

};

module.exports = new productModel();
