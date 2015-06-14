'use strict';

controllers.controller('ProductsCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.products = [];

        $scope.selectedCollection = null;
        $http({method: 'GET', url: '/admin/collections/'}).
            success(function (data) {
                $scope.collections = data;
            });

        $http({method: 'GET', url: '/admin/products'}).
            success(function (data) {
                $scope.products = data;
            });
    }
]);
