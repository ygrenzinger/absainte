'use strict';

var mongoose = require('mongoose');

var productModel = function () {

    var productSchema = mongoose.Schema({
        collectionName: { type: String, required: true },
        name:           { type: String, required: true },
        price:          { type: Number, min: 0 },
        mainImage:      { type: mongoose.Schema.ObjectId, required: true },
        description:    String,
        otherImages:    [mongoose.Schema.Types.ObjectId]

    });

    return mongoose.model('Product', productSchema);

};

module.exports = new productModel();
