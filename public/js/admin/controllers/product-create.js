'use strict';

controllers.controller('ProductCreateCtrl', ['$scope', '$http', '$location', '_',
    function ($scope, $http, $location, _) {

        $scope.editorOptions = {
            language: 'en',
            'skin': 'moono',
            'extraPlugins': "imagebrowser",
            imageBrowser_listUrl: '/admin/images_list',
            toolbarLocation: 'top',
            toolbar: 'full'
        };

        $scope.product = {
            collectionName: '',
            name: '',
            price: 0,
            mainImage: {},
            otherImages: []
        };

        $scope.response = null;

        $scope.addOtherImage = function() {
            $scope.product.otherImages.push({});
        };

        $scope.removeOtherImage = function(index) {
            $scope.product.otherImages.splice(index, 1);
        };

        $scope.createProduct = function () {
            $http.post('/admin/products', $scope.product)
                .success(function(data, status, headers, config) {
                    console.log(status);
                }).error(function(data, status, headers, config) {
                    console.log(status);
                });
        };
    }]);
