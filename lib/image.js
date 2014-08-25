'use strict';

var knox = require('knox'),
  fs = require('q-io/fs'),
  Q = require('q');

var image = function() {

  var client = knox.createClient({
    key: '<api-key-here>',
    secret: '<secret-here>',
    bucket: 'learnboost'
  });

  var saveToDisk = function(type, file) {
    var deferred = Q.defer();
    fs.read(file.path).then(function(data) {
      var relativeUrl = '/img/uploads/' + type + '/' + file.name;
      var newPath = __dirname + '/../public' + relativeUrl;
      fs.write(newPath, data).then(function() {
        console.log('Image saved to disk here: ' + newPath);
        fs.remove(file.path);
        deferred.resolve(relativeUrl);
      }, function(err) {
        console.log('fs.writeFile error', err);
        deferred.reject(err);
      });
    }, function(err) {
      console.log('fs.readFile error', err);
      deferred.reject(err);
    });
    return deferred.promise;
  };

  return {
    saveToDisk: saveToDisk
  };
};


module.exports = image();
