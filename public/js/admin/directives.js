'use strict';

var directivesModule = angular.module('absainteAdmin.directives', []);

directivesModule.directive('appVersion', ['version',
    function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }
]);

