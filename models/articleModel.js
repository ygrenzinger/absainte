/**
 * A model for blog
 */
'use strict';

var mongoose = require('mongoose'),
    Q = require('q'),
    querystring = require('querystring');

var articleModel = function () {

    var articleSchema = mongoose.Schema({
        title: {type: String, required: true},
        permalink: {type: String, required: true},
        summary: {type: String, required: true},
        content: {type: String, required: true},
        language: {type: String, required: true},
        published: { type: Boolean, default: false },
        publishedDate: Date
    });

    articleSchema.index({language: 1, permalink: 1}, {unique: true});

    return mongoose.model('Article', articleSchema);
};

var model = new articleModel();
module.exports.model = model;

module.exports.findAll = function() {
    var deferred = Q.defer();
    model.find({})
        .exec(function (err, articles) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(articles);
            }
        });
    return deferred.promise;
};

module.exports.findPublishedByLanguage = function(language) {
    var deferred = Q.defer();
    model.find({
        language: language,
        published: true
    }).exec(function (err, articles) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(articles);
            }
        });
    return deferred.promise;
};

module.exports.findByPermalink = function(permalink) {
    var deferred = Q.defer();
    model.findOne({
        permalink: querystring.escape(permalink)
    }).exec(function (err, article) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(article);
        }
    });
    return deferred.promise;
};

module.exports.findByLanguageAndPermalink = function(language, permalink) {
    var deferred = Q.defer();
    model.findOne({
        language: language,
        permalink: querystring.escape(permalink)
    }).exec(function (err, article) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(article);
            }
        });
    return deferred.promise;
};

module.exports.upsert = function(article) {
    var deferred = Q.defer();
    var id = !!article._id ? article._id : new mongoose.Types.ObjectId();
    model.findByIdAndUpdate(id, article, {upsert: true}, function (err, articleFromDB) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(articleFromDB);
        }
    });
    return deferred.promise;
};
