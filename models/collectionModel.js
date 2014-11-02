'use strict';

var mongoose = require('mongoose'),
    Q = require('q');

var collectionModel = function () {

    var collectionSchema = mongoose.Schema({
        name:           { type: String, required: true },
        permalink:      { type: String, required: true, unique: true },
        mainImage:      { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
        description:    String

    });

    return mongoose.model('Collection', collectionSchema);

};

var model = new collectionModel();
module.exports.model = model;

module.exports.findAll = function() {
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

module.exports.findByPermalink = function(permalink) {
    var deferred = Q.defer();
    model.findOne({
        permalink: permalink
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

module.exports.upsert = function(collection) {
    var deferred = Q.defer();
    model.findOneAndUpdate({permalink: collection.permalink}, collection, {upsert: true}, function (err) {
        if (err) {
            deferred.reject(err);
        } else {
            res.send(collection);
        }
    });
    return deferred.promise;
};
