'use strict';

var ArticleModel = require('../../models/articleModel.js');

module.exports = function (router) {

    router.get('/', function(req, res) {
        ArticleModel
            .findPublishedByLanguage(res.locals.language)
            .then(function (articles) {
                var model =
                {
                    articles: articles
                };
                res.render('articles/articles', model);
            })
            .fail(function (err) {
                res.status(500).send(err);
            });
    });

    router.get('/:permalink', function(req, res) {
        ArticleModel.findByLanguageAndPermalink(res.locals.language, req.params.permalink)
            .then(function (article) {
                var model =
                {
                    article: article
                };
                res.render('articles/article', model);
            })
            .fail(function (err) {
                res.status(500).send(err);
            });
    });

};
