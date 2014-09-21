'use strict';

controllers.controller('ProductCreateCtrl', ['$scope', '$location',
    function ($scope, $location) {
        $scope.product = {
            collection: '',
            name: '',
            price: 0,
            mainImage: {
                imageUrl: ''
            }
        };

        $scope.response = null;

        $scope.createProduct = function () {
            console.log('ds');
        };
    }]);
