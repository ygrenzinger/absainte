'use strict';

controllers.controller('BlogCreateCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.editorOptions = {
        language: 'en',
        'skin': 'moono',
        'extraPlugins': "imagebrowser",
        imageBrowser_listUrl: '/#/illustration-create',
        toolbarLocation: 'top',
        toolbar: 'full',
        toolbar_full: [
            { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', 'Underline' ] },
            { name: 'paragraph', items: [ 'BulletedList', 'NumberedList', 'Blockquote' ] },
            { name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
            { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
            { name: 'tools', items: [ 'SpellChecker', 'Maximize' ] },
            { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
            { name: 'styles', items: [ 'Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat' ] },
            { name: 'insert', items: [ 'Image', 'Table', 'SpecialChar' ] },'/',
        ]
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
