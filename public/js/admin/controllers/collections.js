'use strict';

controllers.controller('CollectionsCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.collections = [];
    $http({method: 'GET', url: '/admin/collections'}).
      success(function(data, status, headers, config) {
        $scope.collections = data;
      });



      var loadAll = function () {
          $http({method: 'GET', url: '/admin/collections'}).
          success(function (data) {
              $scope.collections = data;
          });
      };
      loadAll();

      $scope.delete = function (collection) {
          var modalInstance = $modal.open({
              templateUrl: 'collectionDeleteModal.html',
              controller: ['$scope', '$modalInstance', 'collection',
                  function ($scope, $modalInstance, collection) {
                      $scope.collection = collection;

                      $scope.ok = function () {
                          $modalInstance.close($scope.collection);
                      };

                      $scope.cancel = function () {
                          $modalInstance.dismiss('cancel');
                      };
                  }],
              resolve: {
                  collection: function () {
                      return collection;
                  }
              }
          });

          modalInstance.result.then(function (collection) {
              $http({method: 'DELETE', url: '/admin/collections/' + collection._id}).
              success(function () {
                  $log.info('Deleted ' + collection.name + ' deleted');
                  loadAll();
              });
          }, function () {
              $log.info('Delete Modal dismissed');
          });
      };
  }
]);
