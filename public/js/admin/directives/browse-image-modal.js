'use strict';

var BrowseImageModalCtrl = function ($scope, $modalInstance, $http, type) {

    $http({method: 'GET', url: '/admin/images/'+type}).
        success(function (data) {
            $scope.images = data;
        });

    $scope.selectedImage = null;
    $scope.selectImage = function(image) {
        $scope.selectedImage = image;
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selectedImage._id);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

directivesModule.directive('browseImageModal', ['$modal', '$log',
    function ($modal, $log) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    browse();
                });
                var browse = function () {

                    var modalInstance = $modal.open({
                        templateUrl: '/partials/browse-image-modal.html',
                        controller: BrowseImageModalCtrl,
                        resolve: {
                            type: function () {
                                return $attrs.type;
                            }
                        }
                    });

                    modalInstance.result.then(function (selectedImageId) {
                        $scope.selectedImageId = selectedImageId;
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };
            }
        };
    }]);