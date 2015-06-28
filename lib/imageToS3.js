'use strict';

var _ = require('lodash'),
    fs = require('fs-extra'),
    request = require('request'),
    Q = require('q'),
    gm = require('gm'),
    AWS = require('aws-sdk'),
    stringUtil = require('./stringUtil.js'),
    ImageModel = require('../models/imageModel.js');

var s3Stream = require('s3-upload-stream')(new AWS.S3());

var getUploadS3Conf = function(originalKey) {
    return {
        Key: originalKey,
        Bucket: 'absainte',
        ACL: 'public-read',
        StorageClass: 'REDUCED_REDUNDANCY',
        ContentType: 'image/jpeg'
    };
};

var image = function () {

    var changeName = function (uploadS3Conf, size) {
        var split = uploadS3Conf.Key.split('.');
        uploadS3Conf.Key = split[0] + '-' + size + '.' + split[1];
    };

    var resizeAndUpload = function(uploadS3Conf,inputStream, size, isHorizontal) {
        var deferred = Q.defer();
        var x = null;
        var y = null;
        if (size === 'thumbnail') {
            changeName(uploadS3Conf,'thumbnail');
            isHorizontal ? x = '100' : y = '100';
        } else if (size === 'list') {
            changeName(uploadS3Conf, 'list');
            isHorizontal ? x = '200' : y = '200';
        } else if (size === 'large') {
            changeName(uploadS3Conf, 'large');
            isHorizontal ? x = '620' : y = '620';
        }  else {
            isHorizontal ? x = '310' : y = '310';
        }

        gm(inputStream).resize(x, y)
            .stream(function (err, stdout) {
                if (err) {
                    deferred.reject(err);
                } else {
                    var upload = s3Stream.upload(uploadS3Conf);

                    upload.on('error', function (error) {
                        deferred.reject(error);
                    });
                    upload.on('uploaded', function (details) {
                        console.log(details);
                        deferred.resolve(details.Location);
                    });

                    stdout.pipe(upload);

                }
            });

        return deferred.promise;
    };

    var save = function (type, file) {
        var deferred = Q.defer();

        var uploadedUrls = {
            largeImgUrl: '',
            imageUrl: '',
            listImgUrl: '',
            thumbnailImgUrl: ''
        };
        var name = type+'/'+file.name;

        gm(file.path).size(function(err, size) {
            if (err) {
                deferred.reject(err);
            } else {
                var isHorizontal = size.width > size.height;
                var readStream = fs.createReadStream(file.path);
                resizeAndUpload(getUploadS3Conf(name), readStream, 'large', isHorizontal).then(function (url) {
                    uploadedUrls.largeImgUrl = url;
                    return resizeAndUpload(getUploadS3Conf(name), request(url), 'standard', isHorizontal);
                }).then(function (url) {
                    uploadedUrls.imageUrl = url;
                    return resizeAndUpload(getUploadS3Conf(name), request(url), 'list', isHorizontal);
                }).then(function (url) {
                    uploadedUrls.listImgUrl = url;
                    return resizeAndUpload(getUploadS3Conf(name), request(url), 'thumbnail', isHorizontal);
                }).then(function (url) {
                    uploadedUrls.thumbnailImgUrl = url;
                    deferred.resolve(uploadedUrls);
                }).fail(function(err) {
                    deferred.reject(err);
                });
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
            } else {
                res.send(image);
            }
        });
    };

    var getImageById = function (id) {
        var deferred = Q.defer();
        ImageModel.findOne({
            _id: id
        }, function (err, image) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(image);
            }
        });
        return deferred.promise;
    };

    var saveImage = function (req, res, type) {
        var startTime = new Date().getTime();

        var file = req.files.file;
        var name = req.body.name;
        var newImage = new ImageModel({
            type: type,
            name: name,
            permalink: stringUtil.createPermalink(name),
            imageUrl: '',
            listImgUrl: '',
            thumbnailImgUrl: '',
            largeImgUrl: ''
        });
        save(type, file)
            .then(function (result) {
                newImage.imageUrl = result.imageUrl;
                newImage.listImgUrl = result.listImgUrl;
                newImage.thumbnailImgUrl = result.thumbnailImgUrl;
                newImage.largeImgUrl = result.largeImgUrl;
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
                    saveImage(req, res, type);
                }
            });
        }
    };

    return {
        uploadImage: uploadImage,
        findAllImages: findAllImages,
        findImagesByType: findImagesByType,
        getImageFromPermalink: getImageFromPermalink,
        getImageById: getImageById
    };
};


module.exports = image();
