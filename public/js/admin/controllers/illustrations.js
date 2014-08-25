'use strict';

/* Controllers */

controllers.controller('IllustrationsCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.illustrations = [];
    $http({method: 'GET', url: '/admin/illustrations'}).
      success(function(data, status, headers, config) {
        $scope.illustrations = data;
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  }
]);
