'use strict';

controllers.controller('BlogCreateCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.editorOptions = {
        language: 'en',
        'skin': 'moono',
        'extraPlugins': "imagebrowser",
        imageBrowser_listUrl: '/admin/images_list',
        toolbarLocation: 'top',
        toolbar: 'full'
    };

      $scope.save = function() {
          $http.post('/examples/test.php', {
              content: $scope.test
          }).success(function() {
              alert('Saved');
          });
      }
  }
]);
