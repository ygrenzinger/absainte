'use strict';

controllers.controller('CollectionCtrl', ['$scope', '$http', '$location', '$routeParams', '_',
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

        $scope.collection = {
            name: '',
            price: 0,
            mainImage: {},
            otherImages: []
        };

        $scope.otherImage = {};

        if (!!$routeParams.permalink) {
            $http({method: 'GET', url: '/admin/collections/' + $routeParams.permalink}).
                success(function(data, status, headers, config) {
                    $scope.collection = data;
                }).
                error(function(data, status, headers, config) {
                });
        }

        $scope.response = null;

        $scope.saveCollection = function () {
            $http.post('/admin/collections', $scope.collection)
                .success(function(data, status, headers, config) {
                    console.log(data);
                    $location.path('/collection/'+data.permalink);
                }).error(function(data, status, headers, config) {
                    console.log(status);
                    $scope.response = {type: 'alert round', msg: data};
                });
        };
    }]);

