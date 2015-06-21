'use strict';

controllers.controller('ProductsCtrl', ['$scope', '$http', '$log', '$modal',
    function ($scope, $http, $log, $modal) {
        $scope.products = [];

        $http({method: 'GET', url: '/admin/collections'}).
            success(function (data) {
                $scope.collections = data;
            });

        $scope.delete  = function(product) {
            var modalInstance = $modal.open({
                templateUrl: 'productDeleteModal.html',
                controller: ['$scope', '$modalInstance', 'product',
                    function($scope, $modalInstance, product) {
                        $scope.product = product;

                        $scope.ok = function () {
                            $modalInstance.close($scope.product);
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }],
                resolve: {
                    product: function () {
                        return product;
                    }
                }
            });

            modalInstance.result.then(function (product) {
                $http({method: 'DELETE', url: '/admin/products/'+product._id}).
                    success(function () {
                        $log.info('Product '+product.name+' deleted');
                        loadAll();
                    });
            }, function () {
                $log.info('Delete Modal dismissed');
            });
        };

        var loadAll = function() {
            $http({method: 'GET', url: '/admin/products'}).
                success(function (data) {
                    $scope.products = data;
                });
        };
        loadAll();
    }
]);
