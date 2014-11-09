'use strict';

var CollectionModel = require('../../../models/collectionModel.js'),
    stringUtil = require('../../../lib/stringUtil.js');

module.exports = function (router) {

    router.get('/', function (req, res) {
        CollectionModel
            .findAll()
            .then(function (collections) {
                res.send(collections);
            })
            .fail(function (err) {
                res.send(500, err);
            });
    });

    router.get('/:permalink', function (req, res) {
        CollectionModel
            .findByPermalink(req.params.permalink)
            .then(function (collection) {
                res.send(collection);
            })
            .fail(function (err) {
                res.send(500, err);
            });
    });

    var isCollectionValid = function (req, res) {
        if (!req.body.name) {
            res.send(400, 'Collection name is missing');
            return false;
        }
        if (!req.body.mainImage._id) {
            res.send(400, 'Main image is missing');
            return false;
        }
        return true;
    };

    router.post('/', function (req, res) {

        if (!isCollectionValid(req, res)) {
            return;
        }

        var collection = req.body;
        collection.mainImage = req.body.mainImage._id;
        delete collection.__v;

        CollectionModel
            .upsert(collection)
            .then(function (collection) {
                res.send(collection);
            })
            .fail(function (err) {
                res.status(500).send(err);
            });
    });
};
