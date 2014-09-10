'use strict';

var UploadImageModalCtrl = function ($scope, $modalInstance, $upload, type) {

    $scope.type = type;
    $scope.imageName = '';

    $scope.imageSelected = {
        test: 'test'
    };

    $scope.onFileSelect = function($files) {
        $scope.files = $files;
    };

    $scope.submit = function() {
        $scope.upload = $upload.upload({
            url: '/admin/image',
            method: 'POST',
            data: {
                type: type,
                name: $scope.imageName
            },
            file: $scope.files
        }).progress(function(evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            console.log('percent: ' + progress);
        }).success(function(data) {
            console.log(data);
            $modalInstance.close(data);
        }).error(function(data, status) {
            $scope.response = {type: 'alert round', msg: data};
            console.log(status);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

directivesModule.directive('uploadImageModal', ['$modal', '$log',
    function ($modal, $log) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    upload();
                });

                var upload = function () {

                    var modalInstance = $modal.open({
                        templateUrl: '/partials/upload-image-modal.html',
                        controller: UploadImageModalCtrl,
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
