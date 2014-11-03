'use strict';

var directivesModule = angular.module('absainteAdmin.directives', []);

directivesModule.directive('appVersion', ['version',
    function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }
]);

directivesModule.directive('description', ['_',
    function (_) {
        return {
            restrict: 'E',
            scope: {
                descriptions: "=descriptions"
            },
            templateUrl: '/partials/description.html',
            link: function ($scope, $element, $attrs) {
                $scope.langSelected = 'en';

                if (!$scope.descriptions) {
                    $scope.descriptions = [
                        {'language':'en', 'content':''},
                        {'language':'fr', 'content':''}
                    ];
                }

                $scope.content = {};
                $scope.content.en = _.find($scope.descriptions, {'language': 'en'});
                $scope.content.fr = _.find($scope.descriptions, {'language': 'fr'});
                $scope.languages = ['en','fr'];

                $scope.isFrSelected = function() {
                    return $scope.langSelected === 'fr';
                };

                $scope.isEnSelected = function() {
                    return $scope.langSelected === 'en';
                };

                $scope.editorOptions = {
                    language: 'en',
                    height: '100px',
                    'skin': 'moono',
                    'extraPlugins': "imagebrowser",
                    imageBrowser_listUrl: '/admin/images_list',
                    toolbarLocation: 'top',
                    toolbar: 'full'
                };
            }
        };
    }]);

