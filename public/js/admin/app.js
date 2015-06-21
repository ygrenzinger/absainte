'use strict';

var lodash = angular.module('lodash', []);
lodash.factory('_', function() {
    return window._; // assumes lodash has already been loaded on the page
});

var controllers = angular.module('absainteAdmin.controllers', []);

angular.module('absainteAdmin', [
    'ngRoute',
    'ngCookies',
    'angularFileUpload',
    'mm.foundation',
    'ngCkeditor',
    'lodash',
    'absainteAdmin.filters',
    'absainteAdmin.services',
    'absainteAdmin.directives',
    'absainteAdmin.controllers'
]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/articles', {templateUrl: '/partials/articles.html', controller: 'ArticlesCtrl'});
    $routeProvider.when('/article/:permalink?', {templateUrl: '/partials/article.html', controller: 'ArticleCtrl'});
    $routeProvider.when('/collections', {templateUrl: '/partials/collections.html', controller: 'CollectionsCtrl'});
    $routeProvider.when('/collection/:permalink?', {templateUrl: '/partials/collection.html', controller: 'CollectionCtrl'});
    $routeProvider.when('/products', {templateUrl: '/partials/products.html', controller: 'ProductsCtrl'});
    $routeProvider.when('/product/:permalink?', {templateUrl: '/partials/product.html', controller: 'ProductCtrl'});
    $routeProvider.when('/images', {templateUrl: '/partials/images.html', controller: 'ImagesCtrl'});
    $routeProvider.when('/image/:permalink?', {templateUrl: '/partials/image.html', controller: 'ImageCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
}]).run(function ($http, $cookies) {
    $http.defaults.headers.common['x-csrf-token'] = $cookies['XSRF-TOKEN'];
});
