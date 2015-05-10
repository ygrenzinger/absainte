'use strict';

controllers.controller('ImageCtrl', ['$scope', '$http', '$location', '$routeParams', '_',
    function ($scope, $http, $location, $routeParams, _) {

        $scope.image = {
            type: '',
            name: '',
            permalink: '',
            listImgUrl: '',
            imageUrl: '',
            thumbnailImgUrl: '',
            largeImgUrl: ''
        };

        $scope.otherImage = {};

        if (!!$routeParams.permalink) {
            $http({method: 'GET', url: '/admin/images/' + $routeParams.permalink}).
                success(function(data, status, headers, config) {
                    $scope.image = data;
                }).
                error(function(data, status, headers, config) {
                });
        }

        $scope.response = null;
    }]);

