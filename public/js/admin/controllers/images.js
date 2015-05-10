'use strict';

controllers.controller('ImagesCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.images = [];
    $http({method: 'GET', url: '/admin/images'}).
      success(function(data, status, headers, config) {
        $scope.images = data;
      });
  }
]);
