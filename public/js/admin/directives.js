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
                descriptions: "=descriptions",
                lang: "=lang"
            },
            templateUrl: '/partials/description.html',
            controller: function($scope, $element){
                $scope.isFrSelected = function() {
                    return $scope.lang === 'fr';
                };

                $scope.isEnSelected = function() {
                    return $scope.lang === 'en';
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

