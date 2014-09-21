'use strict';

var _ = require('lodash'),
    fs = require('fs-extra'),
    Q = require('q'),
    im = require('imagemagick'),
    stringUtil = require('./stringUtil.js'),
    ImageModel = require('../models/imageModel.js');

var image = function () {

    var buildRelativePath = function (type) {
        return '/img/uploads/' + type + '/';
    };

    var buildRelativeUrl = function (type, fileName) {
        return buildRelativePath(type) + fileName;
    };

    var buildDirPath = function (type) {
        return process.cwd() + '/public' + buildRelativePath(type);
    };

    var buildFilePath = function (type, fileName) {
        return buildDirPath(type) + fileName;
    };

    var resizeToMaxSize = function (filePath) {
        return resizeImg(filePath, filePath, 960);
    };

    var thumbnailize = function (path) {
        var split = path.split('.');
        return split[0] + '-thumbnail' + '.' + split[1];
    };

    var createThumbnail = function (filePath) {
        return resizeImg(filePath, thumbnailize(filePath), 200);
    };

    var resizeImg = function (filePath, destPath, maxWidth) {
        var deferred = Q.defer();

        im.identify(filePath, function (err, features) {
            if (err) {
                deferred.reject(err);
            } else {
                if (features.width < maxWidth) {
                    deferred.resolve(destPath);
                } else {

                    var ratio = features.width / maxWidth;
                    var height = Math.floor(features.height / ratio);

                    im.resize({
                        srcPath: filePath,
                        dstPath: destPath,
                        width: maxWidth,
                        height: height
                    }, function (err, stdout, stderr) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(destPath);
                        }
                    });
                }

            }
        });
        return deferred.promise;
    };

    var saveToDisk = function (type, file) {
        var deferred = Q.defer();

        fs.ensureDir(buildDirPath(type), function (err) {
            if (err) {
                deferred.reject(err);
            } else {
                var destFilePath = buildFilePath(type, file.name);
                fs.move(file.path, destFilePath, function (err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        resizeToMaxSize(destFilePath)
                            .then(function () {
                                deferred.resolve();
                            })
                            .fail(function (err) {
                                deferred.reject(err);
                            });
                    }
                });
            }
        });

        return deferred.promise;
    };

    var save = function (type, file, withThumbnail) {
        var deferred = Q.defer();
        var destFilePath = buildFilePath(type, file.name);

        saveToDisk(type, file).then(function () {
            var imageUrl = buildRelativeUrl(type, file.name);
            if (withThumbnail) {
                createThumbnail(destFilePath).then(function () {
                    var result = {
                        imageUrl: imageUrl,
                        thumbnailUrl: thumbnailize(imageUrl)
                    };
                    deferred.resolve(result);
                }).fail(function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.resolve(imageUrl);
            }
        }).fail(function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    var renameImage = function (type, oldName, newName) {
        var deferred = Q.defer();
        fs.move(buildFilePath(type, oldName), buildFilePath(type, newName), function (err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(buildRelativeUrl(type, newName));
            }
        });
        return deferred.promise;
    };

    var findAllImages = function (res) {
        res.setHeader('Content-Type', 'text/json');
        ImageModel.find({}, function (err, images) {
            if (err) {
                res.send(500, err);
            }
            res.send(images);
        });
    };

    var findImagesByType = function (res, type) {
        res.setHeader('Content-Type', 'text/json');
        ImageModel.find({ type: type }, function (err, images) {
            if (err) {
                res.send(500, err);
            }
            res.send(images);
        });
    };

    var getImageFromPermalink = function (req, res) {
        ImageModel.findOne({
            permalink: req.params.permalink
        }, function (err, image) {
            if (err) {
                res.send(500, err);
            }
            res.send(image);
        });
    };

    var saveImageToDisk = function (req, res, type) {
        var file = req.files.file;
        var name = req.body.name;
        var newImage = new ImageModel({
            type: type,
            name: name,
            permalink: stringUtil.createPermalink(name),
            imageUrl: '',
            thumbnailUrl: ''
        });
        save(type, file, true)
            .then(function (result) {
                newImage.imageUrl = result.imageUrl;
                newImage.thumbnailUrl = result.thumbnailUrl;
                newImage.save(function (err) {
                    if (err) {
                        console.log('newImage.save error', err);
                        res.send(500, err);
                    } else {
                        res.send(newImage);
                    }
                });
            }).fail(function (err) {
                res.send(500, err);
            });
    };

    var uploadImage = function (req, res, type) {
        res.setHeader('Content-Type', 'text/json');
        if (!req.files.file || req.files.file.size === 0) {
            res.send(400, 'No file uploaded');
        } else if (!req.body.name) {
            res.send(400, 'No name');
        } else {
            var name = req.body.name;
            var file = req.files.file;
            var permalink = stringUtil.createPermalink(name);
            file.name = permalink + '.' + file.name.split('.').pop();
            ImageModel.find({
                permalink: permalink
            }, function (err, image) {
                if (!_.isEmpty(image)) {
                    res.send(409, name + ' existe déjà !');
                } else {
                    saveImageToDisk(req, res, type);
                }
            });
        }
    };

    return {
        uploadImage: uploadImage,
        findAllImages: findAllImages,
        findImagesByType: findImagesByType,
        getImageFromPermalink: getImageFromPermalink
    };
};


module.exports = image();
