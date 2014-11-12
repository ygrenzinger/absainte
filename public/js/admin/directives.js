'use strict';

var directivesModule = angular.module('absainteAdmin.directives', []);

directivesModule.directive('appVersion', ['version',
    function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }
]);

directivesModule.directive('richTextEditor', ['_',
    function (_) {
        return {
            restrict: 'E',
            scope: {
                content: "=content"
            },
            templateUrl: '/partials/richTextEditor.html',
            controller: function($scope, $element){

                $scope.editorOptions = {
                    language: 'en',
                    height: '200px',
                    'skin': 'moono',
                    'extraPlugins': "imagebrowser",
                    imageBrowser_listUrl: '/admin/images_list',
                    toolbarLocation: 'top',
                    format_tags: 'p;h2;h3;h4;h5;h6;pre;address;div',
                    toolbar: 'full'
                };
            }
        };
    }]);

