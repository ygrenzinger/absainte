'use strict';

controllers.controller('ArticleCtrl', ['$scope', '$http', '$location', '$routeParams', 'DescriptionsService',
    function ($scope, $http, $location, $routeParams, DescriptionsService) {

        $scope.langSelected = 'en';
        $scope.languages = ['en','fr'];

        $scope.article = {
            title: '',
            descriptions: [
                {'language':'en', 'content':''},
                {'language':'fr', 'content':''}
            ]
        };

        $scope.descriptions = DescriptionsService.convertArrayToObject($scope.article.descriptions);

        if (!!$routeParams.permalink) {
            $http({method: 'GET', url: '/admin/articles/' + $routeParams.permalink}).
                success(function(data, status, headers, config) {
                    $scope.article = data;
                    $scope.descriptions = DescriptionsService.convertArrayToObject($scope.article.descriptions);
                }).
                error(function(data, status, headers, config) {
                });
        }

        $scope.response = null;

        $scope.saveArticle = function () {
            $scope.article.descriptions = DescriptionsService.convertObjectToArray($scope.descriptions);

            $http.post('/admin/articles', $scope.article)
                .success(function(data, status, headers, config) {
                    console.log(data);
                    $location.path('/article/'+data.permalink);
                }).error(function(data, status, headers, config) {
                    console.log(status);
                    $scope.response = {type: 'alert round', msg: data};
                });
        };
    }]);

