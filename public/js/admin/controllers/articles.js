'use strict';

controllers.controller('ArticlesCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.articles = [];
    $http({method: 'GET', url: '/admin/articles'}).
      success(function(data, status, headers, config) {
        $scope.articles = data;
      });
  }
]);
