'use strict';

controllers.controller('ArticleCtrl', ['$scope', '$http', '$location', '$routeParams', '_',
    function ($scope, $http, $location, $routeParams, _) {

        $scope.article = {
            name: '',
            description: [
                {'language':'en', 'content':''},
                {'language':'fr', 'content':''}
            ]
        };

        $scope.otherImage = {};

        if (!!$routeParams.permalink) {
            $http({method: 'GET', url: '/admin/articles/' + $routeParams.permalink}).
                success(function(data, status, headers, config) {
                    $scope.article = data;
                }).
                error(function(data, status, headers, config) {
                });
        }

        $scope.response = null;

        $scope.saveArticle = function () {
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

