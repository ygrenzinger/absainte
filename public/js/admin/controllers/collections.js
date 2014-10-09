'use strict';

controllers.controller('CollectionsCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.collections = [];
    $http({method: 'GET', url: '/admin/collections'}).
      success(function(data, status, headers, config) {
        $scope.collections = data;
      });
  }
]);
