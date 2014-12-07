'use strict';

var ArticleModel = require('../../../models/articleModel.js');

module.exports = function (router) {

    router.get('/', function (req, res) {
        ArticleModel
            .findAll()
            .then(function (articles) {
                res.send(articles);
            })
            .fail(function (err) {
                res.status(500).send(err);
            });
    });

    router.get('/:permalink', function (req, res) {
        ArticleModel
            .findByPermalink(req.params.permalink)
            .then(function (article) {
                res.send(article);
            })
            .fail(function (err) {
                res.status(500).send(err);
            });
    });

    var isArticleValid = function (req, res) {
        if (!req.body.title) {
            res.send(400, 'article title is missing');
            return false;
        }
        if (!req.body.permalink) {
            res.send(400, 'article permalink is missing');
            return false;
        }
        if (!req.body.summary) {
            res.send(400, 'article summary is missing');
            return false;
        }
        if (!req.body.content) {
            res.send(400, 'article content is missing');
            return false;
        }
        if (!req.body.language) {
            res.send(400, 'article language is missing');
            return false;
        }
        return true;
    };

    var upsertArticle = function(article, res) {
        ArticleModel
            .upsert(article)
            .then(function (article) {
                res.send(article);
            })
            .fail(function (err) {
                res.status(500).send(err);
            });
    };

    router.post('/copy', function (req, res) {
        var article = req.body;
        article.title = article.title + ' copy';
        article.permalink = article.permalink + '-copy';
        article.publishedDate = null;
        article.published = false;
        delete article._id;
        delete article.__v;

        upsertArticle(article, res);
    });

    router.post('/', function (req, res) {

        if (!isArticleValid(req, res)) {
            return;
        }

        var article = req.body;
        delete article.__v;

        if (article.published && !article.publishedDate) {
            article.publishedDate = Date.now();
        } else {
            article.publishedDate = null;
        }

        upsertArticle(article, res);
    });
};
