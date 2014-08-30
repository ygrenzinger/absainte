'use strict';

var knox = require('knox'),
  fs = require('fs-extra'),
  Q = require('q'),
  im = require('imagemagick');

var image = function() {

  var buildRelativePath = function(type) {
    return '/img/uploads/' + type + '/';
  };

  var buildRelativeUrl = function(type, fileName) {
    return buildRelativePath(type) + fileName;
  };

  var buildDirPath = function(type) {
    return process.cwd() + '/public' + buildRelativePath(type);
  };

  var buildFilePath = function(type, fileName) {
    return buildDirPath(type) + fileName;
  };

  var resizeToMaxSize = function(filePath) {
    return resizeImg(filePath, filePath, 960);
  };

  var createThumbnail = function(filePath) {
    var split = filePath.split('.');
    var thumbPath = split[0] + '-thumbnail' + '.' + split[1];
    return resizeImg(filePath, thumbPath, 200);
  };

  var resizeImg = function(filePath, destPath, maxWidth) {
    var deferred = Q.defer();

    im.identify(filePath, function(err, features) {
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
          }, function(err, stdout, stderr) {
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

  var renameImage = function(type, oldName, newName) {
    var deferred = Q.defer();
    fs.move(buildFilePath(type, oldName), buildFilePath(type, newName), function(err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(buildRelativeUrl(type, newName));
      }
    });
    return deferred.promise;
  };

  var saveToDisk = function(type, file) {
    var deferred = Q.defer();

    fs.ensureDir(buildDirPath(type), function(err) {
      if (err) {
        deferred.reject(err);
      } else {
        var destFilePath = buildFilePath(type, file.name);
        fs.move(file.path, destFilePath, function(err) {
          if (err) {
            deferred.reject(err);
          } else {
            resizeToMaxSize(destFilePath)
              .then(function() {
                return createThumbnail(destFilePath);
              }).then(function() {
                var imageUrl = buildRelativeUrl(type, file.name);
                var split = imageUrl.split('.');
                var thumbnailUrl = split[0] + '-thumbnail' + '.' + split[1];
                var result = {
                  imageUrl: imageUrl,
                  thumbnailUrl: thumbnailUrl
                };
                deferred.resolve(result);
              })
              .fail(function(err) {
                deferred.reject(err);
              });
          }
        });
      }
    });

    return deferred.promise;
  };

  return {
    saveToDisk: saveToDisk
  };
};


module.exports = image();
