'use strict';

var mongoose = require('mongoose'),
    Q = require('q'),
    _ = require('lodash'),
    querystring = require('querystring');


var productModel = function () {

    var productSchema = mongoose.Schema({
        collectionFrom: {type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true},
        name: {type: String, required: true},
        permalink: {type: String, required: true, unique: true},
        price: {type: Number, min: 0},
        mainImage: {type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true},
        description:    {
            'en' : String,
            'fr' : String
        },
        otherImages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}]

    });


    productSchema.methods.prettyPrice = function () {
        return (this && this.price) ? this.price.toFixed(2) + ' €' : '';
    };

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

module.exports.findRandom = function (number) {
    if (!number) { number = 3; }
    var deferred = Q.defer();
    model.find({})
        .populate('collectionFrom')
        .populate('mainImage')
        .exec(function (err, products) {
            if (err) {
                deferred.reject(err);
            } else {
                var randomProducts = _.sample(products, number);
                deferred.resolve(randomProducts);
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
    model.findByIdAndUpdate({_id: product._id}, product, {upsert: true, 'new': true}, function (err, updateProduct) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(updateProduct);
        }
    });
    return deferred.promise;
};

module.exports.delete = function (id) {
    var deferred = Q.defer();
    model.findByIdAndRemove(id, function (err) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
};
