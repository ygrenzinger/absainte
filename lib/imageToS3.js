'use strict';

var _ = require('lodash'),
    fs = require('fs-extra'),
    Q = require('q'),
    im = require('imagemagick-stream'),
    AWS = require('aws-sdk'),
    stringUtil = require('./stringUtil.js'),
    ImageModel = require('../models/imageModel.js');

var s3Stream = require('s3-upload-stream')(new AWS.S3());

var uploadS3Conf = {
    Bucket: 'absainte',
    ACL: 'public-read',
    StorageClass: 'REDUCED_REDUNDANCY',
    ContentType: 'image/jpeg'
};

var image = function () {

    var generateName = function (path, size) {
        var split = path.split('.');
        return split[0] + '-' + size + '.' + split[1];
    };

    var uploadToS3 = function(type, file, size) {
        var deferred = Q.defer();
        var uploadStream = fs.createReadStream(file.path);

        uploadS3Conf.Key = type+'/'+file.name;
        var resizeFunction = null;
        if (size === 'thumbnail') {
            uploadS3Conf.Key = generateName(uploadS3Conf.Key,'thumbnail');
            resizeFunction = im().resize('80x120');
        } else if (size === 'list') {
            uploadS3Conf.Key = generateName(uploadS3Conf.Key, 'list');
            resizeFunction = im().resize('199x300');
        } else {
            resizeFunction = im().resize('320x483');
        }
        var upload = s3Stream.upload(uploadS3Conf);

        upload.on('error', function (error) {
            deferred.reject(error);
        });
        upload.on('uploaded', function (details) {
            console.log(details);
            deferred.resolve(details.Location);
        });

        uploadStream.pipe(resizeFunction).pipe(upload);

        return deferred.promise;
    };

    var save = function (type, file) {
        var deferred = Q.defer();

        var result = {
            imageUrl: '',
            listImgUrl: '',
            thumbnailImgUrl: ''
        };

        uploadToS3(type, file, false).then(function (imgUrl) {
            result.imageUrl = imgUrl;
            return uploadToS3(type, file, 'thumbnail');
        }).then(function (thumbUrl) {
            result.thumbnailImgUrl = thumbUrl;
            return uploadToS3(type, file, 'list');
        }).then(function (listUrl) {
            result.listImgUrl = listUrl;
            deferred.resolve(result);
        }).fail(function(err) {
            deferred.reject(err);
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
        var file = req.files.file;
        var name = req.body.name;
        var newImage = new ImageModel({
            type: type,
            name: name,
            permalink: stringUtil.createPermalink(name),
            imageUrl: '',
            listImgUrl: '',
            thumbnailImgUrl: ''
        });
        save(type, file)
            .then(function (result) {
                newImage.imageUrl = result.imageUrl;
                newImage.listImgUrl = result.listImgUrl;
                newImage.thumbnailImgUrl = result.thumbnailImgUrl;
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
