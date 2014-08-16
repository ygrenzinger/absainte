'use strict';

var neat = require('node-neat');
var path = require('path');

var configPaths = function() {
  var neatPaths = neat.includePaths;
  var bitterPaths = path.join(__dirname, '../public/components/bitters/app/assets/stylesheets');
  var refillsPaths = path.join(__dirname, '../public/components/refills/app/assets/stylesheets');
  return neatPaths.concat(bitterPaths).concat(refillsPaths);
};

module.exports = {

  paths: configPaths()

};
