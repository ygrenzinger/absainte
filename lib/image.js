'use strict';

var knox = require('knox'),
  fs = require('fs-extra'),
  Q = require('q');

var image = function() {

  var uploadImgPath = process.cwd() + '/public/img/uploads/';
  if (!fs.existsSync(uploadImgPath)) {
    fs.mkdirSync(uploadImgPath, '0766', function(err) {
      if (err) {
        throw err;
      }
    });
  }

  var client = knox.createClient({
    key: '<api-key-here>',
    secret: '<secret-here>',
    bucket: 'learnboost'
  });

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
        fs.move(file.path, buildFilePath(type, file.name), function(err) {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve(buildRelativeUrl(type, file.name));
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
