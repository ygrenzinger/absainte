'use strict';

controllers.controller('IllustrationCreateCtrl', ['$scope', function($scope) {
  $scope.startUploading = function() {
    console.log('uploading....')
  };
  
  $scope.uploadComplete = function (content) {
    $scope.response = JSON.parse(content);
    $scope.name = '';
  };
}]);
