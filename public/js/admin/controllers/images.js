'use strict';

controllers.controller('ImagesCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.images = [];

        var loadAll = function () {
            $http({method: 'GET', url: '/admin/images'}).
            success(function (data) {
                $scope.images = data;
            });
        };
        loadAll();

        $scope.delete = function (image) {
            var modalInstance = $modal.open({
                templateUrl: 'imageDeleteModal.html',
                controller: ['$scope', '$modalInstance', 'image',
                    function ($scope, $modalInstance, image) {
                        $scope.image = image;

                        $scope.ok = function () {
                            $modalInstance.close($scope.image);
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }],
                resolve: {
                    image: function () {
                        return image;
                    }
                }
            });

            modalInstance.result.then(function (image) {
                $http({method: 'DELETE', url: '/admin/images/' + image._id}).
                success(function () {
                    $log.info('Deleted ' + image.name + ' deleted');
                    loadAll();
                });
            }, function () {
                $log.info('Delete Modal dismissed');
            });
        };
    }
]);
