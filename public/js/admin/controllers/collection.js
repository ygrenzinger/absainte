'use strict';

controllers.controller('CollectionCtrl', ['$scope', '$http', '$location', '$routeParams', '_', 'PermalinkService',
    function ($scope, $http, $location, $routeParams, _, PermalinkService) {

        $scope.langSelected = 'en';
        $scope.languages = ['en','fr'];

        $scope.collection = {
            name: '',
            permalink: '',
            description: {
                'en': '',
                'fr': ''
            },
            mainImage: {},
            otherImages: []
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

