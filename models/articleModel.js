/**
 * A model for blog
 */
'use strict';

var mongoose = require('mongoose'),
    Q = require('q');

var articleModel = function () {

    var articleSchema = mongoose.Schema({
        title: String,
        permalink: {type: String, required: true, unique: true},
        description: [{
            language: String,
            content: String
        }]
    });

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

module.exports.findByPermalink = function(permalink) {
    var deferred = Q.defer();
    model.findOne({
        permalink: permalink
    })
        .exec(function (err, article) {
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
    model.findOneAndUpdate({permalink: article.permalink}, article, {upsert: true}, function (err) {
        if (err) {
            deferred.reject(err);
        } else {
            res.send(article);
        }
    });
    return deferred.promise;
};
