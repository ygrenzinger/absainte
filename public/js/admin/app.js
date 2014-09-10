'use strict';

var controllers = angular.module('absainteAdmin.controllers', []);

angular.module('absainteAdmin', [
    'ngRoute',
    'ngCookies',
    'angularFileUpload',
    'mm.foundation',
    'ngCkeditor',
    'absainteAdmin.filters',
    'absainteAdmin.services',
    'absainteAdmin.directives',
    'absainteAdmin.controllers'
]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/products', {templateUrl: '/partials/products.html', controller: 'ProductsCtrl'});
    $routeProvider.when('/product/:permalink', {templateUrl: '/partials/product.html', controller: 'ProductCtrl'});
    $routeProvider.when('/product-create', {templateUrl: '/partials/product-create.html', controller: 'ProductCreateCtrl'});
    $routeProvider.when('/illustrations', {templateUrl: '/partials/illustrations.html', controller: 'IllustrationsCtrl'});
    $routeProvider.when('/illustration/:permalink', {templateUrl: '/partials/illustration.html', controller: 'IllustrationCtrl'});
    $routeProvider.when('/illustration-create', {templateUrl: '/partials/illustration-create.html', controller: 'IllustrationCreateCtrl'});
    $routeProvider.when('/blog-create', {templateUrl: '/partials/blog-create.html', controller: 'BlogCreateCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
}]).run(function ($http, $cookies) {
    $http.defaults.headers.post['x-csrf-token'] = $cookies['XSRF-TOKEN'];
});
