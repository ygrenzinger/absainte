'use strict';
//var fs = require('fs');

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.render('admin');
    });

    router.post('/illustrations', function (req, res) {
      res.setHeader('Content-Type', 'text/json');

      var pictureUrl = '/tmp/pictures';
      var fileUploadMessage = '';

      // process file
      if (!req.files.file || req.files.file.size === 0) {
        res.send(400, 'No file uploaded');
      }
      else if (!req.name) {
        res.send(400, 'No name');
      }
      else {
          var file = req.files.file;

          fs.unlink(file.path, function (err) {
              if (err) {
                  throw err;
              }
              else {
                  fileUploadMessage = '<b>"' + file.name + '"<b> uploaded to the server at ' + new Date().toString();
                  pictureUrl = '/picture-uploads/' + file.name;

                  var responseObj = {
                      fullname: req.param('name'),
                      pictureUrl: pictureUrl
                  };
                  res.send(JSON.stringify(responseObj));
              }
          });
      }
    });
};
