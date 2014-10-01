'use strict';

var mongoose = require('mongoose');

var productModel = function () {

    var productSchema = mongoose.Schema({
        collectionName: { type: String, required: true },
        name:           { type: String, required: true },
        permalink:      { type: String, required: true },
        price:          { type: Number, min: 0 },
        mainImage:      { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
        description:    String,
        otherImages:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image'}]

    });

    return mongoose.model('Product', productSchema);

};

module.exports = new productModel();
