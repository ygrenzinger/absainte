'use strict';

controllers.controller('ProductCtrl', ['$scope', '$http', '$location', '$routeParams', '_',
    function ($scope, $http, $location, $routeParams, _) {

        $scope.editorOptions = {
            language: 'en',
            height: '100px',
            'skin': 'moono',
            'extraPlugins': "imagebrowser",
            imageBrowser_listUrl: '/admin/images_list',
            toolbarLocation: 'top',
            toolbar: 'full'
        };

        $scope.product = {
            collectionFrom: {},
            name: '',
            price: 0,
            mainImage: {},
            otherImages: []
        };

        $http({method: 'GET', url: '/admin/collections/'}).
            success(function(data, status, headers, config) {
                $scope.collections = data;
            });

        $scope.selectCollection = function(collection) {
            $scope.product.collectionFrom = collection;
        };

        $scope.otherImage = {};

        if (!!$routeParams.permalink) {
            $http({method: 'GET', url: '/admin/products/' + $routeParams.permalink}).
                success(function(data, status, headers, config) {
                    $scope.product = data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        $scope.response = null;

        $scope.addOtherImage = function() {
            $scope.product.otherImages.push($scope.otherImage);
        };

        $scope.removeOtherImage = function(index) {
            $scope.product.otherImages.splice(index, 1);
        };

        $scope.saveProduct = function () {
            $http.post('/admin/products', $scope.product)
                .success(function(data, status, headers, config) {
                    console.log(data);
                    $location.path('/product/'+data.permalink);
                }).error(function(data, status, headers, config) {
                    console.log(status);
                    $scope.response = {type: 'alert round', msg: data};
                });
        };
    }]);

