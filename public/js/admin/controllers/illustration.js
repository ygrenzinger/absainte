'use strict';

/* Controllers */

controllers.controller('IllustrationCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    var permalink = $routeParams.permalink;
    $scope.illustration = null;
    $http({method: 'GET', url: '/admin/illustrations/' + permalink}).
      success(function(data, status, headers, config) {
        $scope.illustration = data;
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  }
]);
