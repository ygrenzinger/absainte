'use strict';

var ArticleModel = require('../../../models/articleModel.js'),
    stringUtil = require('../../../lib/stringUtil.js');

module.exports = function (router) {

    router.get('/', function (req, res) {
        ArticleModel
            .findAll()
            .then(function (articles) {
                res.send(articles);
            })
            .fail(function (err) {
                res.send(500, err);
            });
    });

    router.get('/:permalink', function (req, res) {
        ArticleModel
            .findByPermalink(req.params.permalink)
            .then(function (article) {
                res.send(article);
            })
            .fail(function (err) {
                res.send(500, err);
            });
    });

    var isArticleValid = function (req, res) {
        if (!req.body.name) {
            res.send(400, 'article name is missing');
            return false;
        }
        return true;
    };

    router.post('/', function (req, res) {

        if (!isArticleValid(req, res)) {
            return;
        }

        var article = {
            name: req.body.name,
            permalink: stringUtil.createPermalink(req.body.name),
            description: req.body.description
        };

        ArticleModel
            .upsert(article)
            .then(function (article) {
                res.send(article);
            })
            .fail(function (err) {
                res.send(500, err);
            });
    });
};
