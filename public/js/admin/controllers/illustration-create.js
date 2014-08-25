'use strict';

controllers.controller('IllustrationCreateCtrl', ['$scope', '$upload', function($scope, $upload) {
  $scope.files = [];
  $scope.onFileSelect = function($files) {
    $scope.files = $files;
  };

  $scope.name = '';

  $scope.submit = function() {
    $scope.upload = $upload.upload({
      url: '/admin/illustrations',
      method: 'POST',
      data: {name: $scope.name},
      file: $scope.files,
    }).progress(function(evt) {
      console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
    }).success(function(data, status, headers, config) {
      // file is uploaded successfully
      console.log(data);
    }).error(function(data, status, headers, config) {
      // file is uploaded successfully
      console.log(status);
    });
  };
}]);
