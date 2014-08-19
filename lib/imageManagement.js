'use strict';

var knox = require('knox');

module.exports = function () {

  var client = knox.createClient({
      key: '<api-key-here>'
    , secret: '<secret-here>'
    , bucket: 'learnboost'
  });

  

  return {

  };
};
