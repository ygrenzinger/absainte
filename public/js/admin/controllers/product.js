'use strict';

controllers.controller('ProductCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    var permalink = $routeParams.permalink;
    $scope.product = null;
    $http({method: 'GET', url: '/admin/products/' + permalink}).
      success(function(data, status, headers, config) {
        $scope.product = data;
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  }
]);
