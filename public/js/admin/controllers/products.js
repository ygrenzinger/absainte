'use strict';

controllers.controller('ProductsCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.products = [];
    $http({method: 'GET', url: '/admin/products'}).
      success(function(data, status, headers, config) {
        $scope.products = data;
      });
  }
]);
