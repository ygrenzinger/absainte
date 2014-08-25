'use strict';

var controllers = angular.module('absainteAdmin.controllers', []);

// Declare app level module which depends on filters, and services
angular.module('absainteAdmin', [
  'ngRoute',
  'ngCookies',
  'angularFileUpload',
  'absainteAdmin.filters',
  'absainteAdmin.services',
  'absainteAdmin.directives',
  'absainteAdmin.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/illustrations', {templateUrl: '/partials/illustrations.html', controller: 'IllustrationsCtrl'});
  $routeProvider.when('/illustrations/create', {templateUrl: '/partials/illustration-create.html', controller: 'IllustrationCreateCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});
}])
.run(function ($http, $cookies) {
  $http.defaults.headers.post['x-csrf-token'] = $cookies['XSRF-TOKEN'];
});
