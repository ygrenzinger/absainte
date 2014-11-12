'use strict';

var mongoose = require('mongoose'),
    Q = require('q'),
    querystring = require('querystring');


var productModel = function () {

    var productSchema = mongoose.Schema({
        collectionFrom: {type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true},
        name: {type: String, required: true},
        permalink: {type: String, required: true, unique: true},
        price: {type: Number, min: 0},
        mainImage: {type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true},
        description:    {
            "en" : String,
            "fr" : String
        },
        otherImages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}]

    });

    return mongoose.model('Product', productSchema);

};

var model = new productModel();
module.exports.model = model;

module.exports.findAll = function () {
    var deferred = Q.defer();
    model.find({})
        .populate('collectionFrom')
        .populate('mainImage')
        .populate('otherImages')
        .exec(function (err, products) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(products);
            }
        });
    return deferred.promise;
};

module.exports.findByPermalink = function (permalink) {
    var deferred = Q.defer();
    model.findOne({
        permalink: querystring.escape(permalink)
    })
        .populate('collectionFrom')
        .populate('mainImage')
        .populate('otherImages')
        .exec(function (err, product) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(product);
            }
        });
    return deferred.promise;
};

module.exports.findAllByCollectionId = function (collectionId) {
    var deferred = Q.defer();
    model.find({collectionFrom: collectionId})
        .populate('collectionFrom')
        .populate('mainImage')
        .populate('otherImages')
        .exec(function (err, products) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(products);
            }
        });
    return deferred.promise;
};

module.exports.upsert = function (product) {
    var deferred = Q.defer();
    var id = !!product._id ? product._id : new mongoose.Types.ObjectId();
    model.findByIdAndUpdate(id, product, {upsert: true}, function (err) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(product);
        }
    });
    return deferred.promise;
};
