'use strict';

controllers.controller('CollectionCtrl', ['$scope', '$http', '$location', '$routeParams', '_', 'PermalinkService',
    function ($scope, $http, $location, $routeParams, _, PermalinkService) {

        $scope.types = [
            {value: 'fashion-harness', label: 'Fashion harness'},
            {value: 'body-jewelry', label: 'body jewelry'}
        ];

        $scope.langSelected = 'en';
        $scope.languages = ['en','fr'];

        $scope.collection = {
            type: '',
            name: '',
            permalink: '',
            description: {
                'en': '',
                'fr': ''
            },
            mainImage: {},
            otherImages: []
        };

        $scope.selectType = function(type) {
            $scope.collection.type = type;
        };

        $scope.createPermalink = function() {
            $scope.collection.permalink = PermalinkService.createPermalink($scope.collection.name);
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
                    $location.path('/collections');
                }).error(function(data, status, headers, config) {
                    console.log(status);
                    $scope.response = {type: 'alert round', msg: data};
                });
        };
    }]);

