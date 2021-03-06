'use strict';

var mongoose = require('mongoose'),
    Q = require('q'),
    querystring = require('querystring');


var collectionModel = function () {

    var collectionSchema = mongoose.Schema({
        type: {type: String, required: true},
        name: {type: String, required: true},
        permalink: {type: String, required: true, unique: true},
        mainImage: {type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true},
        description: {
            'en': String,
            'fr': String
        }
    });

    return mongoose.model('Collection', collectionSchema);

};

var model = new collectionModel();
module.exports.model = model;

module.exports.findAll = function () {
    var deferred = Q.defer();
    model.find({})
        .populate('mainImage')
        .exec(function (err, collections) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(collections);
            }
        });
    return deferred.promise;
};

module.exports.findByType = function (type) {
    var deferred = Q.defer();
    model.find({type: type})
        .populate('mainImage')
        .exec(function (err, collections) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(collections);
            }
        });
    return deferred.promise;
};

module.exports.findByPermalink = function (permalink) {
    var deferred = Q.defer();
    model.findOne({
        permalink: querystring.escape(permalink)
    })
        .populate('mainImage')
        .exec(function (err, collection) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(collection);
            }
        });
    return deferred.promise;
};

module.exports.upsert = function (collection) {
    var deferred = Q.defer();
    model.findByIdAndUpdate({_id: collection._id}, collection, {upsert: true, 'new': true}, function (err, updateCollection) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(updateCollection);
        }
    });
    return deferred.promise;
};
