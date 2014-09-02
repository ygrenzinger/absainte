'use strict';

controllers.controller('IllustrationsCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.illustrations = [];
    $http({method: 'GET', url: '/admin/illustrations'}).
      success(function(data, status, headers, config) {
        $scope.illustrations = data;
      });
  }
]);
