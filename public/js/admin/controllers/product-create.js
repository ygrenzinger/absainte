'use strict';

controllers.controller('ProductCreateCtrl', ['$scope', '$location', '$upload',
function($scope, $location, $upload) {

  $scope.response = null;

  var reset = function() {
    $scope.name = '';
    $scope.files = [];
    $scope.progress = 0;
  };
  reset();

  $scope.onFileSelect = function($files) {
    $scope.files = $files;
  };

  $scope.submit = function() {
    $scope.upload = $upload.upload({
      url: '/admin/products',
      method: 'POST',
      data: {name: $scope.name},
      file: $scope.files,
    }).progress(function(evt) {
      var progress = parseInt(100.0 * evt.loaded / evt.total);
      console.log('percent: ' + progress);
    }).success(function(data, status, headers, config) {
      console.log(data);
      $location.path('/product/'+data.permalink);
      reset();
    }).error(function(data, status, headers, config) {
      $scope.response = {type: 'alert round', msg: data};
      console.log(status);
    });
  };
}]);
