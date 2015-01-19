'use strict';

var BrowseImageModalCtrl = function ($scope, $modalInstance, $http, type) {

    $http({method: 'GET', url: '/admin/images_list'}).
        success(function (data) {
            $scope.images = data;
        });

    $scope.search = {};

    $scope.selectedImage = null;
    $scope.selectImage = function(image) {
        $scope.selectedImage = image;
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selectedImage);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

directivesModule.directive('browseImageModal', ['$modal', '$log',
    function ($modal, $log) {
        return {
            restrict: 'A',
            scope: {
                selectedImage: "=selectedImage"
            },
            link: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    browse();
                });
                var browse = function () {

                    var modalInstance = $modal.open({
                        windowClass: 'image-browser-modal',
                        templateUrl: '/partials/browse-image-modal.html',
                        controller: BrowseImageModalCtrl,
                        resolve: {
                            type: function () {
                                return $attrs.type;
                            }
                        }
                    });

                    modalInstance.result.then(function (selectedImage) {
                        $scope.selectedImage = selectedImage;
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };
            }
        };
    }]);
