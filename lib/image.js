'use strict';

var knox = require('knox'),
  fs = require('fs'),
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

  var saveToDisk = function(type, file) {
    var deferred = Q.defer();


    var relativePath = '/img/uploads/' + type + '/';
    var relativeUrl = relativePath + file.name;
    var destPath = process.cwd() + '/public' + relativePath;
    var destFile = destPath + file.name;

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, '0766', function(err) {
        if (err) {
          deferred.reject(err);
        }
      });
    }

    var source = fs.createReadStream(file.path);
    var dest = fs.createWriteStream(destFile);

    source.pipe(dest);
    source.on('end', function() {
      fs.unlink(file.path);
      deferred.resolve(relativeUrl);
    });
    source.on('error', function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  return {
    saveToDisk: saveToDisk
  };
};


module.exports = image();
