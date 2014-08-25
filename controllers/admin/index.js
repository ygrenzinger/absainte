'use strict';

module.exports = function(router) {

  router.get('/', function(req, res) {
    res.render('admin');
    res.cookie('XSRF-TOKEN', res.locals._csrf);
  });

};
